<template>
  <Modal v-model="modalMapTree.modalVisible" :title="modalMapTree.modalTitle" :loading="true" :footer-hide="true" width="650" :mask-closable="false">
    <Form ref="formValidateTree" :model="formValidateTree" :label-width="95">
      <template v-if="methodData === 'post'">
        <FormItem label="模式：">
          <RadioGroup v-model="formValidateTree.create_from">
            <Radio label="直接创建" />
            <template v-if="formValidateTree.node_type === 2">
              <Radio label="模板创建" />
            </template>
            <template v-else>
              <Radio label="模板创建" disabled />
            </template>
          </RadioGroup>
        </FormItem>
      </template>
      <FormItem label="节点：" prop="parent_node">
        <span>{{ formValidateTree.parent_node }}</span>
      </FormItem>
      <template v-if="methodData === 'post'">
        <FormItem label="名称：" prop="title">
          <Input v-model="formValidateTree.title" :maxlength="35" placeholder="请输入名称" />
        </FormItem>
      </template>
      <template v-else>
        <FormItem label="名称：" prop="title">
          <Input v-model="formValidateTree.title" disabled :maxlength="35" placeholder="请输入名称" />
        </FormItem>
      </template>
      <template v-if="formValidateTree.create_from === '模板创建'">
        <FormItem label="模板：">
          <Select v-model="formValidateTree.temp_id">
            <Option v-for="item in setTempList" :key="item.id" :value="item.id">{{ item.temp_name }}</Option>
          </Select>
        </FormItem>
      </template>
      <template v-else>
        <FormItem label="排序：" prop="node_sort">
          <Tooltip trigger="hover" placement="right" content="值越小越靠前">
            <InputNumber v-model="formValidateTree.node_sort" :max="1000" :min="1" />
          </Tooltip>
        </FormItem>
        <FormItem label="展开：" prop="expand">
          <i-switch v-model="formValidateTree.expand" size="large">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="扩展字段">
          <vue-json-editor v-model="formValidateTree.ext_info" :show-btns="false" :mode="'code'" lang="zh" @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
        </FormItem>
        <FormItem label="备注：" prop="detail">
          <Input v-model="formValidateTree.detail" type="textarea" :rows="2" :maxlength="1024" placeholder="Enter something..." />
        </FormItem>
      </template>
      <FormItem style="text-align: right">
        <Button type="primary" @click="handleSubmitTree('formValidateTree')">Submit</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import { getSetTemplist } from '@/api/cmdb'
import { operationTree } from '@/api/service-tree'

export default {
  name: 'TreeAdd',
  components: {
    vueJsonEditor,
  },
  props: {
    dialog: {
      default() {
        return {}
      },
      type: Object,
    },
    method: {
      default() {
        return null
      },
      type: String,
    },
    form: {
      default() {
        return {}
      },
      type: Object,
    },
  },
  data() {
    return {
      setTempList: [],
      jsonErrFlag: false,
    }
  },
  computed: {
    modalMapTree() {
      return this.dialog
    },
    methodData() {
      return this.method
    },
    formValidateTree() {
      return this.form
    },
  },
  mounted() {
    this.getSetTempList()
  },
  methods: {
    async getSetTempList() {
      const res = await getSetTemplist()
      this.setTempList = res.data
    },
    // Tree 提交
    handleSubmitTree(value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            console.info(this.formValidateTree,this.methodData)
            operationTree(this.formValidateTree, this.methodData).then(
              (res) => {
                if (res.code === 0) {
                  this.$Message.success(`${res.msg}`)
                  this.$emit('e-close')
                  this.$emit('e-update')
                } else {
                  this.$Message.error(`${res.msg}`)
                }
              },
            )
          }, 1000)
        } else {
          this.$Message.error('缺少必要参数')
        }
      })
    },
        // 获取最新数据
    onJsonChange(val) {
      console.log(`更改了-->${val}`)
      this.jsonErrFlag = false
    },
    onJsonSave(val) {
      console.log('保存了--->', val)
    },
    onError (val) {
      this.$Message.error(`必须为JSON格式-->${val}`)
      this.jsonErrFlag = true
    },
  },

}
</script>
