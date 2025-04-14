<template>
  <component :is="menuComponent" :routerInfo="routerInfo" v-if="!routerInfo.hidden">
    <template v-if="routerInfo.children&&routerInfo.children.length">
      <AsideComponent :key="item.name" :routerInfo="item" v-for="item in routerInfo.children" />
    </template>
  </component>
</template>

<script>
import MenuItem from "./asyncMenuItem";
import AsyncSubmenu from "./asyncSubmenu";

export default {
  name: 'AsideComponent',
  computed: {
    menuComponent() {
      if (this.routerInfo.children && this.routerInfo.children.filter(item => !item.hidden).length && !this.routerInfo.meta.disChildren) {
        return 'AsyncSubmenu';
      }
      return 'MenuItem';
    },
  },
  props: {
    routerInfo: {
      default() {
        return null;
      },
      type: Object,
    },
  },
  components: {
    MenuItem,
    AsyncSubmenu,
  },
};
</script>

<style>

</style>
