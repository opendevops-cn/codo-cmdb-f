<template>
  <div class="asider-menu">
    <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
      <div class="menu-container">
        <div class="menu-title" @click="goto({ name: 'index' })">{{AppTitle}}</div>
        <Menu :active-name="$route.name" width="200px" class="menu-item-list" :style="height">
          <template v-for="item in routeChildren">
            <aside-component :key="item.name" :routerInfo="item" v-if="!item.hidden" />
          </template>
        </Menu>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AsideComponent from "./components";

export default {
  name: "aside-layout",
  components: {
    AsideComponent,
  },
  data() {
    return {
      active: "",
      isCollapse: false,
    };
  },
  computed: {
    ...mapGetters("router", ["asyncRouters"]),
    routeChildren() {
      if (this.asyncRouters.length === 0) {
        return [];
      }
      return this.asyncRouters[0].children;
    },
    AppTitle() {
      return process.env.VUE_APP_TITLE;
    },
    height() {
      return `height: calc(100vh - 100px);`
    },
  },
  methods: {
    selectMenuItem(index, _, ele) {
      console.log("selectMenuItem...", index, _, ele);
      const query = {};
      const params = {};
      const { parameters } = ele.route;
      if (parameters) {
        ele.route.parameters.map((item) => {
          if (item.type === "query") {
            query[item.key] = item.value;
          } else {
            params[item.key] = item.value;
          }
          return true;
        });
      }
      if (index === this.$route.name) return;
      if (index.indexOf("http://") > -1 || index.indexOf("https://") > -1) {
        window.open(index);
      } else {
        this.$router.push({ name: index, query, params });
      }
    },
    findActiveRouter() {
      const findDis = this.$route.matched.filter(item => item.meta.disChildren);
      this.active = findDis.length ? findDis[0].name : this.$route.name;
    },
  },
  created() {
    this.findActiveRouter();
    // this.active = this.$route.name;
    // const screenWidth = document.body.clientWidth;
    // if (screenWidth < 1000) {
    //   this.isCollapse = !this.isCollapse;
    // }

    // this.$bus.on("collapse", (item) => {
    //   this.isCollapse = item;
    // });
  },
  watch: {
    $route() {
      // this.active = this.$route.name;
      this.findActiveRouter();
    },
  },
  // beforeDestroy() {
  //   this.$bus.off("collapse");
  // },
};
</script>

<style lang="scss" scoped>
</style>
