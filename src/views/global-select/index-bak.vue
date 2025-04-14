<template>
  <div class="global-select">
    <Select v-model="model" style="width:200px">
        <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
  </div>
</template>

<script>
import { mapState, mapMutations  } from 'vuex';

export default {
  name: "global-select",
  computed: {
    ...mapState('project', ['activeProject', 'projectList']),
    model: {
      get() {
        return this.activeProject
      },
      set(val) {
        this.setProject(val);
      },
    },
  },
  data() {
    return {
      cityList: []
    }
  },
  mounted() {
    this.setProjectList([      {
      value: 'New York',
      label: 'New York'
    }])
  },
  methods: {
    ...mapMutations('project', ['setProjectList', 'setProject'])
  },
}
</script>

<style>

</style>