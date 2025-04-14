<template>
  <div class="layout-container" :class="{'hidden-menu': isCollapse}">
    <aside class="left-menu-container" v-if="showLeftMenu">
      <aside-menu />
      <div class="left-menu-hide-bar item-vertical" @click="changeCollapse">
        <Icon type="ios-arrow-back" class="hidebar-icon" />
      </div>
    </aside>

    <main class="layout-main-container-with-navbar">
      <div class="layout-main-navbar-container item-between" v-if="showNavbar">
        <Breadcrumb separator="/">
          <template v-for="(item, index) in this.router">
            <BreadcrumbItem  :key="index" :to="{ name: item.name }">{{item.meta.title}}</BreadcrumbItem>
          </template>
        </Breadcrumb>

        <div>
          <extendNavbar />
        </div>
      </div>

      <div class="layout-main-content-container" :style="height">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import asideMenu from '../../asideMenu';

export default {
  name: "layout",
  components: {
    asideMenu,
  },
  computed: {
    router() {
      return this.$route.matched;
    },
    showNavbar() {
      return !this.$layout.noShowNavbar;
    },
    showLeftMenu() {
      return !this.$layout.noShowLeftMenu;
    },
    height() {
      return this.showNavbar ? `height: calc(100vh - 150px);` : `height: calc(100vh - 50px);`
    },
  },
  data() {
    return {
      isCollapse: false,
    }
  },
  methods: {
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
}
</script>

<style>

</style>