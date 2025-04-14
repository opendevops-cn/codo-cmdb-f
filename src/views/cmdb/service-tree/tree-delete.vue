<template>
  <Modal v-model="modalMap.show" width="360">
    <p slot="header" style="color: #f60; text-align: center">
      <Icon type="ios-information-circle" />
      <span>Delete confirmation</span>
    </p>
    <div style="text-align: center">
      <p>确定要删除-{{ modalMap.name }}？</p>
      <p>如果该节点下有子节点请先删除子节点.</p>
    </div>
    <div slot="footer">
      <Button type="error" size="large" long @click="handleDelTreeNode">Delete</Button>
    </div>
  </Modal>
</template>

<script>
import { operationTree } from '@/api/service-tree'

export default {
  name: 'TreeDelete',
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
    contextData() {
      return this.data
    },
  },
  methods: {
    // 删除确认
    handleDelTreeNode() {
      const existChildrenData = this.contextData.children
      if (existChildrenData.length !== 0) {
        this.$Message.error('节点下存在数据,删除失败！')
        return
      }
      // 删除数据
      operationTree(
        {
          id: this.contextData.id,
          biz_id: this.contextData.biz_id,
          title: this.contextData.title,
          parent_node: this.contextData.parent_node,
          node_type: this.contextData.node_type,
        },
        'delete',
      ).then((res) => {
        if (res.code === 0) {
          this.$Message.success(`${res.msg}`)
          this.$emit('e-close')
          this.$emit('e-update')
        } else {
          this.$Message.error(`${res.msg}`)
        }
        this.$emit('e-close')
      })
    },
  },
}
</script>
