<template>
  <div>
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :footer-hide="true" width="750">
      <Form ref="formValidate" :model="formValidate" :label-width="10" :mask-closable="false">
        <FormItem>
          <Row>
            <Col span="12">标签键</Col>
            <Col span="12">标签值</Col>
          </Row>
        </FormItem>
        <template v-for="(item, idx) in formValidate.tags">
          <FormItem v-if="item.status" :key="idx">
            <Row>
              <Col span="10"><Input v-model="item.tag_key" placeholder="Enter key ..." /></Col>
              <Col span="1" offset="1"><span> : </span></Col>
              <Col span="10"><Input v-model="item.tag_value" placeholder="Enter value ..." /> </Col>
              <Col span="1" offset="1"><Icon type="md-trash" @click="handleRemove(idx)" /></Col>
            </Row>
          </FormItem>
        </template>
        <FormItem>
          <Row>
            <Col span="18">
              <Tooltip trigger="hover" placement="right" content="批量添加标签,key+vlaue唯一">
                <Button type="dashed" long icon="md-add" @click="handleAdd">继续添加</Button>
              </Tooltip>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <span>备注信息</span>
          <Input v-model="formValidate.tag_detail" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..." />
        </FormItem>
        <div class="demo-footer">
          <Button style="margin-right: 8px" type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="modalMap.modalVisible = false">取消</Button>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>

import { addTag } from '@/api/cmdb'

export default {
  name: 'TagAdd',
  components: {},
  props: {
    form: {
      default() {
        return null
      },
      type: Object,
    },
    dialog: {
      default() {
        return null
      },
      type: Object,
    },
  },
  data() {
    return {
      modalMap: this.dialog,
      formValidate: this.form,
      index: 1,
    }
  },
  mounted() {},
  methods: {
    // 添加条件
    handleAdd() {
      this.index += 1
      if (this.index > 6) {
        this.$Notice.warning({
          title: '条件超出最大限制',
        })
        return
      }
      // 默认配置
      this.formValidate.tags.push({
        tag_key: '',
        tag_value: '',
        index: this.index,
        status: 1,
      })
    },
    // 移除条件
    handleRemove(index) {
      this.index -= 1
      this.formValidate.tags[index].status = 0
    },
    // 提交给后端
    async handleSubmit() {
      const { msg } = await addTag(this.formValidate)
      this.$Message.info(msg)
      this.$emit('e-close')
      this.$emit('e-update')
    },
  },
}
</script>

<style>
.demo-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 5px 16px;
  text-align: right;
}
</style>
