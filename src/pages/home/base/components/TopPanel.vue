<template>
  <t-row :gutter="[16, 16]">
    <t-col v-for="(item, index) in PANE_LIST" :key="item.title" :xl="4" :xs="6">
      <t-card
        :bordered="false"
        :class="{ 'dashboard-item': true, 'dashboard-item--main-color': index === 0 }"
        :style="{ height: '140px' }"
        :title="item.title"
      >
        <div class="dashboard-item-top">
          <span :style="{ fontSize: `${resizeTime * 36}px` }">
          <!-- 使用条件判断，判断当前是第四个表格 -->
            <template v-if="index === 5">
            <div>
                <t-select
                  v-model="selectedProject"
                  :borderless="true"
                  :options="PROJECT_SELECTION"
                  size="large"
                  style="width: 210px"
                />
             </div>
            </template>
            <template v-else>{{ item.number }}</template>
        </span>
        </div>
        <div class="dashboard-item-left">
          <div
            v-if="index === 0"
            id="moneyContainer"
            :style="{ width: `${resizeTime * 120}px`, height: `${resizeTime * 66}px` }"
            class="dashboard-chart-container"
          ></div>
          <div
            v-else-if="index === 1"
            id="refundContainer"
            :style="{ width: `${resizeTime * 120}px`, height: `${resizeTime * 42}px` }"
            class="dashboard-chart-container"
          ></div>
          <span v-else-if="index === 2" :style="{ marginTop: `-24px` }">
            <ErrorIcon/>
          </span>
          <span v-else :style="{ marginTop: '-24px' }">
          <ViewListIcon />
          </span>
        </div>
      </t-card>
    </t-col>
  </t-row>
</template>
<script>
import {LineChart, BarChart} from 'echarts/charts';
import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {UsergroupIcon, FileIcon, ChevronRightIcon, ErrorIcon, ViewListIcon} from 'tdesign-icons-vue';
import {mapState} from 'vuex';
import {ChevronDownIcon} from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';

import {constructInitDashboardDataset} from '../index';
import {changeChartsTheme} from '@/utils/color';
import axios from "axios";

echarts.use([LineChart, BarChart, CanvasRenderer]);
export default {
  name: 'TopPanel',
  components: {
    Trend,
    UsergroupIcon,
    FileIcon,
    ChevronRightIcon,
    ErrorIcon,
    ViewListIcon,
    ChevronDownIcon,
  },
  data() {
    return {
      resizeTime: 1,
      selectedProject: '全部项目',
      PROJECT_SELECTION: [],
      PANE_LIST: [
        {
          title: "总设备数（个）",
          number: "N/A",
        },
        {
          title: "本周能耗总数（w）",
          number: "N/A",
          downTrend: "20.5%",
        },
        {
          title: "预警数（个数）",
          number: "N/A",
          upTrend: "30.5%",
        },
        {
          title: "碳排放量（kg）",
          number: "10",
          downTrend: "40.5%",
        },
        {
          title: "设备平均健康度",
          number: "100%",
          downTrend: "40.5%",
        },
        {
          title: "当前项目",
          number: "",
          downTrend: "40.5%",
        },
      ],
    };
  },
  computed: {
    ...mapState('setting', ['brandTheme', 'mode']), // 这里需要用到主题色和主题模式的全局配置
  },
  watch: {
    brandTheme() {
      changeChartsTheme([this.refundChart]);
    },
    mode() {
      [this.moneyCharts, this.refundChart].forEach((item) => {
        item.dispose();
      });
      this.renderCharts();
    },
  },
  mounted() {
    this.fetchData()
    this.$nextTick(() => {
      this.updateContainer();
    });
    setInterval(() => {
      this.fetchData();
    }, 1000);
    window.addEventListener('resize', this.updateContainer, false);
    this.renderCharts();
  },

  methods: {
    async fetchData() {
      try {
        const response1 = await axios.get('http://122.51.210.27:8026/api/light_data/items')

        let params = {};
        // 如果选中的项目不是 '全部项目'，则设置筛选参数
        if (this.selectedProject !== '全部项目') {
          params = {
            project: this.selectedProject, // 使用选定的项目值
          };
        }

        // 使用筛选参数进行API请求
        const response = await axios.get('http://122.51.210.27:8026/api/light_data/items', {params});

        // 使用筛选后的结果更新组件数据
        this.lightData = response.data;
        // 使用 reduce 方法计算所有 "power" 属性值的总和
        const totalPower = this.lightData.reduce((accumulator, currentValue) => {
          const powerValue = parseFloat(currentValue.power) || 0 // 将 "power" 转换为数字，如果无效则为 0
          return accumulator + powerValue
        }, 0)

        const currentTime = new Date()

        this.$set(this.PANE_LIST, 0, {
          title: "总设备数（个）",
          number: this.lightData.length,
        });
        this.$set(this.PANE_LIST, 1, {
          title: "本周能耗总数（Kw‧h）",
          number: totalPower,
        });

        // 计算与当前时间差两小时的设备数量
        const devicesWithinTwoHours = this.lightData.filter(item => {
          const consumptionUpdateTime = new Date(item.ConsumptionUpdate)
          const timeDifference = currentTime.getTime() - consumptionUpdateTime.getTime()
          return timeDifference > 2 * 60 * 60 * 1000
        })

        this.$set(this.PANE_LIST, 2, {
          title: "预警数（个）",
          number: devicesWithinTwoHours.length,
        });

        this.selecteData = response1.data;
        this.selecteData = this.selecteData.filter((item, index, self) => {
          const isDuplicate = self.findIndex(el => el.project === item.project) !== index;
          return !isDuplicate;
        });
        this.PROJECT_SELECTION = [
          {label: '全部项目', value: '全部项目'},
          ...new Set(this.selecteData.map(item => ({
            label: item.project,
            value: item.project,
          })))
        ];
      } catch (error) {
        console.error('获取数据时出错', error);
      }
    },
    updateContainer() {
      if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
        this.resizeTime = (document.documentElement.clientWidth / 2080).toFixed(2);
      } else if (document.documentElement.clientWidth < 1080) {
        this.resizeTime = (document.documentElement.clientWidth / 1080).toFixed(2);
      } else {
        this.resizeTime = 1;
      }
      this.moneyCharts.resize({
        // 根据父容器的大小设置大小
        width: `${this.resizeTime * 120}px`,
        height: `${this.resizeTime * 66}px`,
      });

      this.refundChart.resize({
        // 根据父容器的大小设置大小
        width: `${this.resizeTime * 120}px`,
        height: `${this.resizeTime * 42}px`,
      });
    },

    renderCharts() {
      const {chartColors} = this.$store.state.setting;
      // 收入汇总图
      if (!this.moneyContainer) this.moneyContainer = document.getElementById('moneyContainer');
      this.moneyCharts = echarts.init(this.moneyContainer);
      this.moneyCharts.setOption(constructInitDashboardDataset('line'));

      // 退款图
      if (!this.refundContainer) this.refundContainer = document.getElementById('refundContainer');
      this.refundChart = echarts.init(this.refundContainer);
      this.refundChart.setOption(constructInitDashboardDataset('bar', chartColors));
    },
  },
};
</script>

<style lang="less" scoped>
@import '@/style/variables.less';

.dashboard-item {
  padding: 8px;

  /deep/ .t-card__footer {
    padding-top: 0;
  }

  /deep/ .t-card__title {
    font-size: 14px;
    font-weight: 500;
  }

  /deep/ .t-card__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    position: relative;
  }

  &:hover {
    cursor: pointer;
  }

  &-top {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    > span {
      display: inline-block;
      color: var(--td-text-color-primary);
      font-size: 36px;
      line-height: 44px;
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > .t-icon {
      cursor: pointer;
    }
  }

  &-block {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 22px;
    color: var(--td-text-color-placeholder);
  }

  &-trend {
    margin-left: 8px;
  }

  &-left {
    position: absolute;
    top: 0;
    right: 32px;

    > span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: var(--td-brand-color-2);
      border-radius: 50%;

      .t-icon {
        font-size: 24px;
        color: var(--td-brand-color);
      }
    }
  }

  // 针对第一个卡片需要反色处理
  &--main-color {
    background: var(--td-brand-color);
    color: var(--td-text-color-primary);

    /deep/ .t-card__title,
    .dashboard-item-top span,
    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }

    .dashboard-item-block {
      color: var(--td-text-color-anti);
      opacity: 0.6;
    }

    .dashboard-item-bottom {
      color: var(--td-text-color-anti);
    }
  }

  .tdesign-demo-dropdown {
    &__text {
      display: inline-block;
      color: var(--td-text-color-primary);
      font-size: 28px;
      line-height: 44px;
      .t-icon {
        margin-left: 8px;
      }
    }
  }
  ::v-deep .t-input.t-is-readonly .t-input__inner {
    font-size: 29px;
    color: var(--td-text-color-primary);
  }

  ::v-deep .t-input.t-size-l {
    height: var(--td-comp-size-xxl);
    font: var(--td-font-body-large);
    padding: 0;
    margin-top: -10px;
  }
}
</style>
