<template>
  <Modal v-model="modalMap.show" width="360">
    <p slot="header" style="color: #f60; text-align: center">
      <Icon type="ios-information-circle" />
      <span>二次确认</span>
    </p>
    <div style="text-align: center">
      <p>确定要{{ dialog.title }} ？</p>
    </div>
    <div slot="footer">
      <Button type="primary" size="large" long @click="handleSubmit">提交</Button>
    </div>
  </Modal>
</template>

<script>
import { changeTreeAssetStatus } from '@/api/service-tree'

export default {
  name: 'ChangeStatus',
  props: {
    dialog: {
      default() {
        return {}
      },
      type: Object,
    }, // {show: true, title: "xxx"}
    data: {
      default() {
        return {}
      },
      type: Object,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    modalMap() {
      return this.dialog
    },
  },
  methods: {
    async handleSubmit() {
      try {
        const res = await changeTreeAssetStatus(this.data)
        this.$Message.success(`${res.msg}`)
      } finally {
        this.$emit('e-close')
        this.$emit('e-update')
      }
    },
  },
}
</script>
