<template>
  <Modal v-model="modalMap.show" width="360">
    <p slot="header" style="color: #f60; text-align: center">
      <Icon type="ios-information-circle" />
      <span>Delete confirmation</span>
    </p>
    <div style="text-align: center">
      <p>确定要删除-{{ modalMap.name }}？</p>
    </div>
    <div slot="footer">
      <Button type="error" size="large" long @click="handleDelete">Delete</Button>
    </div>
  </Modal>
</template>

<script>
import { deleteTreeAsset } from '@/api/service-tree'

export default {
  name: 'AssetDelete',
  props: {
    dialog: {
      default() {
        return {}
      },
      type: Object,
    },
    data: {
      default() {
        return {}
      },
      type: Object,
    },
  },
  data() {
    return {}
  },
  computed: {
    modalMap() {
      return this.dialog
    },
  },
  methods: {
    async handleDelete() {
      try {
        if (this.data.is_enable === 1 || this.data.is_enable === true) {
          this.$Message.error('上线的资源不能被删除.')
          return
        }
        const res = await deleteTreeAsset({
          asset_type: this.data.asset_type,
          biz_id: this.data.biz_id,
          env_name: this.data.env_name,
          region_name: this.data.region_name,
          module_name: this.data.module_name,
          names: [this.data.name],
        })
        this.$Message.success(`${res.msg}`)
      } finally {
        this.$emit('e-close')
        this.$emit('e-update')
      }
    },
  },
}
</script>
