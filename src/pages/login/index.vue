<template>
  <div class="login-wrapper">

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录到</h1>
        <h1 class="title">智慧照明云</h1>
      </div>

      <login v-if="type === 'login'" />
      <register v-else @register-success="switchType('login')" />
      <tdesign-setting />
    </div>

<!--    <footer class="copyri ght">Copyright @ 2021-2022 Tencent. All Rights Reserved</footer>-->
  </div>
</template>
<script>
import Login from './components/components-login.vue';
import TdesignSetting from '@/layouts/setting.vue';

export default {
  name: 'LoginIndex',
  components: {
    Login,
    TdesignSetting,
  },
  data() {
    return {
      type: 'login',
    };
  },
  methods: {
    switchType(val) {
      this.type = val;
    },
  },
};
</script>
<style lang="less">
@import url('./index.less');
</style>
