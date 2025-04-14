<template>
  <div>
    <Modal v-model="modalMap.show" :title="dialog.title" :footer-hide="true" width="850" :mask-closable="false">
      <Form ref="formValidate" :model="formValidate" :label-width="95">
        <FormItem label="当前节点">
          <span>/{{ theBusinessName }}/{{ formValidate.env_name }}//{{ formValidate.region_name }}/{{ formValidate.module_name }}</span>
        </FormItem>
        <FormItem label="添加方式">
          <span>基础资源</span>
        </FormItem>
        <FormItem label="选择资源">
          <Select v-model="formValidate.asset_ids" filterable multiple>
            <Option v-for="item in assetList" :key="item.id" :value="item.id">{{ item.name }} - {{ item.inner_ip }}</Option>
          </Select>
        </FormItem>

          <FormItem label="选择模块" v-if="nodeType === 2">
          <Select v-model="formValidate.module_list" filterable multiple>
            <Option v-for="item in moduleList" :key="item.id" :value="item.title" :label="item.title"></Option>
          </Select>
        </FormItem>

        <FormItem label="是否启用">
          <i-switch v-model="formValidate.is_enable" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="扩展字段">
          <vue-json-editor v-model="formValidate.ext_info" :show-btns="false" :mode="'code'" lang="zh" @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
        </FormItem>
        <FormItem style="text-align: right">
          <Button type="primary" :loading="isLoading" @click="handleSubmit('formValidate')">Submit</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getServerList} from '@/api/cloud/server'
import { getRedisList } from '@/api/cloud/redis'
import { getMySQLList } from '@/api/cloud/mysql'
import { getLBList} from '@/api/cloud/lb'
import { postTreeAsset, getTreeModule } from '@/api/service-tree'

import vueJsonEditor from 'vue-json-editor'

export default {

  name: 'AssetAdd',
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
    form: {
      default() {
        return {}
      },
      type: Object,
    },
  },
  data() {
    return {
      jsonErrFlag: false,
      theBusinessName: '',
      assetList: [],
      moduleList: [],
      nodeType: 3,
      isLoading: false,
    }
  },
  computed: {
    formValidate() {
      return this.form
    },
    modalMap() {
      return this.dialog
    },
  },
  methods: {
    // 获取基础主机
    async getAssetData () {
      if (this.formValidate.asset_type === 'server') {
        const res = await getServerList({ page_number: 1, page_size: 999999 })
        this.assetList = res.data
      } else if (this.formValidate.asset_type === 'mysql') {
        const res = await getMySQLList({ page_number: 1, page_size: 999999 })
        this.assetList = res.data
      } else if (this.formValidate.asset_type === 'redis') {
        const res = await getRedisList({ page_number: 1, page_size: 999999 })
        this.assetList = res.data
      } else if (this.formValidate.asset_type === 'lb') {
        const res = await getLBList({ page_number: 1, page_size: 999999 })
        this.assetList = res.data
      }
    },
    // 获取模块列表
    async handleGetTreeModule (node_type) {
       let reqMap = { node_type, "biz_id": this.formValidate.biz_id, "env_name": this.formValidate.env_name, "region_name": this.formValidate.region_name}
       const res = await getTreeModule(reqMap)
       this.moduleList = res.data
    },
    // 提交
    async handleSubmit() {
      try {
        this.isLoading = true
        this.formValidate['node_type'] = this.nodeType
        const res = await postTreeAsset(this.formValidate)
        this.$Message.success(res.msg)
      } finally {
        this.isLoading = false
        this.$emit('e-close')
        this.$emit('e-update')
      }
    },
    // 刷新数据
    handleRefresh(nodeType) {
      console.log('调了hanleRefresh', nodeType)
      this.nodeType = nodeType
      // 切换业务会把BusinessID和Name写到浏览器LocalStorage
      this.theBusinessName = localStorage.getItem('selectBusinessName')
      this.getAssetData()
      if (nodeType === 2) {
        this.handleGetTreeModule(nodeType)
      } else {
        this.moduleList = []
      }
    },
    // 获取最新数据
    onJsonChange(val) {
      console.log('更改了-->', val)
      this.jsonErrFlag = false
    },
    onJsonSave(val) {
      console.log('保存了--->', val)
    },
    onError(val) {
      console.log('报错了--->', val)
      this.jsonErrFlag = true
    },
  },
}
</script>
