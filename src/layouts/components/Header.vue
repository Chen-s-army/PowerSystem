<template>
  <div :class="layoutCls">
    <t-head-menu :class="menuCls" :theme="theme" expandType="popup" :value="active">
      <template #logo>
        <span v-if="showLogo" class="header-logo-container" @click="handleNav('/dashboard/base')">
<!--         <logo-full class="t-logo" />-->
         <Logo class="t-logo" />

        </span>
        <div v-else class="header-operate-left">
          <t-button theme="default" shape="square" variant="text" @click="changeCollapsed">
            <view-list-icon class="collapsed-icon" />
          </t-button>
<!--          <search :layout="layout" />-->
        </div>
      </template>
      <menu-content v-show="layout !== 'side'" class="header-menu" :navData="menu" />
      <template #operations>
        <div class="operations-container">
          <div class="current-time">{{ currentTime }}</div>
          <div class="mqtt-link">
            <icon name="cloud"/>
            {{mqttConnectionStatus}}
          </div>
<!--          &lt;!&ndash; 搜索框 &ndash;&gt;-->
<!--          <search v-if="layout !== 'side'" :layout="layout" />-->

          <!-- 全局通知 -->
<!--          <notice />-->

          <t-dropdown :min-column-width="125" trigger="click">
            <template #dropdown>
              <t-dropdown-menu>
<!--                <t-dropdown-item class="operations-dropdown-container-item" @click="handleNav('/user/index')">-->
<!--                  <user-circle-icon />个人中心-->
<!--                </t-dropdown-item>-->
                <t-dropdown-item class="operations-dropdown-container-item" @click="handleLogout">
                  <poweroff-icon />退出登录
                </t-dropdown-item>
              </t-dropdown-menu>
            </template>
            <t-button class="header-user-btn" theme="default" variant="text">
              <template #icon>
                <user-circle-icon class="header-user-avatar" />
              </template>
              <div class="header-user-account">{{ username }}</div>
              <template #suffix>
                <chevron-down-icon />
              </template>
            </t-button>
          </t-dropdown>
          <t-tooltip placement="bottom" content="系统设置">
            <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
              <setting-icon />
            </t-button>
          </t-tooltip>
        </div>
      </template>
    </t-head-menu>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  ViewListIcon,
  LogoGithubIcon,
  HelpCircleIcon,
  UserCircleIcon,
  PoweroffIcon,
  SettingIcon,
  ChevronDownIcon,
} from 'tdesign-icons-vue';
import { prefix } from '@/config/global';
import LogoFull from '@/assets/assets-logo-full.svg';
import Logo from '@/assets/a.svg';
import {Icon} from 'tdesign-icons-vue';
import Notice from './Notice.vue';
import Search from './Search.vue';
import MenuContent from './MenuContent.vue';
import mqtt from "mqtt";
import {mapState} from "vuex";

export default Vue.extend({
  components: {
    MenuContent,
    Icon,
    LogoFull,
    Logo,
    Notice,
    Search,
    ViewListIcon,
    LogoGithubIcon,
    HelpCircleIcon,
    UserCircleIcon,
    PoweroffIcon,
    SettingIcon,
    ChevronDownIcon,
  },
  props: {
    theme: String,
    layout: {
      type: String,
      default: 'top',
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    menu: {
      type: Array,
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
    isCompact: {
      type: Boolean,
      default: false,
    },
    maxLevel: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      prefix,
      visibleNotice: false,
      isSearchFocus: false,
      currentTime: '',
      mqttConnectionStatus: '',
    };
  },
  computed: {
    ...mapState('user', ['username']),
    active() {
      if (!this.$route.path) {
        return '';
      }
      return this.$route.path
        .split('/')
        .filter((item, index) => index <= this.maxLevel && index > 0)
        .map((item) => `/${item}`)
        .join('');
    },
    showMenu() {
      return !(this.layout === 'mix' && this.showLogo === 'side');
    },
    layoutCls() {
      return [`${this.prefix}-header-layout`];
    },
    menuCls() {
      return [
        {
          [`${this.prefix}-header-menu`]: !this.isFixed,
          [`${this.prefix}-header-menu-fixed`]: this.isFixed,
          [`${this.prefix}-header-menu-fixed-side`]: this.layout === 'side' && this.isFixed,
          [`${this.prefix}-header-menu-fixed-side-compact`]: this.layout === 'side' && this.isFixed && this.isCompact,
        },
      ];
    },
  },
  mounted() {
    this.initMqtt()
    this.updateCurrentTime();
    setInterval(this.updateCurrentTime, 1000);
  },
  methods: {
    initMqtt() {
      // 连接配置选项
      const options = {
        connectTimeout: 4000, // 超时时间
        clientId: "", // 不填默认随机生成一个ID
      }
      // 连接成功
      this.client = mqtt.connect("ws://106.15.121.181:8083/mqtt", options)
      this.client1 = mqtt.connect("ws://122.51.210.27:8083/mqtt", options)
      this.client.on("connect", () => {
        this.mqttConnectionStatus = "已连接"
        console.log("连接成功")
      })

      // 重连提醒
      this.client.on("reconnect", () => {
        this.mqttConnectionStatus = "正在重连"
        console.log("正在重连")
      })

      // 连接失败提醒
      this.client.on("error", (error) => {
        this.mqttConnectionStatus = "连接失败"
        console.log("连接失败", error)
      })
    },
    //显示当前系统时间
    updateCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    },
    toggleSettingPanel() {
      this.$store.commit('setting/toggleSettingPanel', true);
    },
    handleLogout() {
      this.$router.push(`/login?redirect=${this.$router.history.current.fullPath}`);
    },
    changeCollapsed() {
      this.$store.commit('setting/toggleSidebarCompact');
    },
    handleNav(url) {
      this.$router.push(url);
    },
    // navToGitHub() {
    //   window.open('https://github.com/Tencent/tdesign-vue-starter');
    // },
    // navToHelper() {
    //   window.open('http://tdesign.tencent.com/starter/docs/get-started');
    // },
  },
});
</script>
<style lang="less">
@import '@/style/variables.less';

.header-menu {
  flex: 1 1 1;
  display: inline-flex;
}

.operations-container {
  display: flex;
  align-items: center;
  margin-right: 12px;

  .t-popup__reference {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .t-button {
    margin: 0 8px;

    &.header-user-btn {
      margin: 0;
    }
  }

  .t-icon {
    font-size: 20px;

    &.general {
      margin-right: 16px;
    }
  }
  .current-time {
    color: var(--td-text-color-primary);
    margin-right: 16px;
    font-weight: bold;
  }

  .mqtt-link {
    white-space: nowrap;
    display: flex;
    align-items: center;
    margin-right: 16px;
    font-weight: bold;
  }
}

.header-operate-left {
  display: flex;
  margin-left: 20px;
  align-items: normal;
  line-height: 0;

  .collapsed-icon {
    font-size: 20px;
  }
}

.header-logo-container {
  width: 184px;
  height: 126px;
  display: flex;
  margin-left: 24px;
  color: var(--td-text-color-primary);

  .t-logo {
    align-content: center;
    width: 100%;
    height: 100%;

    &:hover {
      cursor: pointer;
    }
  }

  &:hover {
    cursor: pointer;
  }
}

.header-user-account {
  display: inline-flex;
  align-items: center;
  color: var(--td-text-color-primary);

  .t-icon {
    margin-left: 4px;
    font-size: 16px;
  }
}

.t-head-menu__inner {
  border-bottom: 1px solid var(--td-border-level-1-color);
}

.t-menu--light {
  .header-user-account {
    color: var(--td-text-color-primary);
  }
}

.t-menu--dark {
  .t-head-menu__inner {
    border-bottom: 1px solid var(--td-gray-color-10);
  }

  .header-user-account {
    color: rgba(255, 255, 255, 0.55);
  }

  .t-button {
    --ripple-color: var(--td-gray-color-10) !important;

    &:hover {
      background: var(--td-gray-color-12) !important;
    }
  }
}

.operations-dropdown-container-item {
  width: 100%;
  display: flex;
  align-items: center;

  .t-icon {
    margin-right: 8px;
  }

  .t-dropdown__item {
    .t-dropdown__item__content {
      display: flex;
      justify-content: center;
    }

    .t-dropdown__item__content__text {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }

  .t-dropdown__item {
    width: 100%;
    margin-bottom: 0px;
  }

  &:last-child {
    .t-dropdown__item {
      margin-bottom: 8px;
    }
  }
}
</style>
