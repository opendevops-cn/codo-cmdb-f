<template>
  <MenuItem :name="routerInfo.name" :to="routerInfo">
    <span>{{ routerInfo.meta.title }}</span>
  </MenuItem>
</template>

<script>
export default {
    name: 'AsyncMenuItem',
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
