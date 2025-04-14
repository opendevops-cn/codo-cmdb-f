<template>
  <div class="top-nav item-between">
    <Breadcrumb separator="/">
      <template v-for="(item, index) in this.router">
        <BreadcrumbItem  :key="index" :to="{ name: item.name }">{{item.meta.title}}</BreadcrumbItem>
      </template>
    </Breadcrumb>

    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "top-nav"
}
</script>

<style>

</style>