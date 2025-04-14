<template>
  <div id="app" :class="{ base_body: isDev }">
    <header class="demo-top-nav" v-if="!QIANKUN">
      <div class="item-between">
        <div class="demo-top-nav-logo font-bold">CoDo</div>
        <div>
          <Avatar icon="ios-person" />
        </div>
      </div>
    </header>

    <router-view />
  </div>
</template>

<script>

export default {
  name: "App",
  data () {
    return {
      // @ts-ignore
      QIANKUN: window.__POWERED_BY_QIANKUN__ === undefined ? false : true
    };
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === 'development';
    },
  },
  mounted() {
  // 调用主应用注册的方法
}

};
</script>

<style>

</style>
