<!-- eslint-disable vue/no-useless-template-attributes -->
<template>
  <Submenu :name="routerInfo.name">
    <template slot="title" class="item-between">
      <div>
        {{ routerInfo.meta.title }}
      </div>
    </template>
    <slot />
  </Submenu>
</template>

<script>
export default {
    name: 'AsyncSubmenu',
    props: {
        routerInfo: {
            default() {
                return null
            },
            type: Object,
        },
    },
}
</script>
<style lang="scss">
</style>
