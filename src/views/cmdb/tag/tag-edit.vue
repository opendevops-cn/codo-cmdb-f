<template>
  <div>
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :footer-hide="true" width="750">
      <Form ref="formValidate" :model="formValidate" :label-width="10" :mask-closable="false">
        <FormItem>
          <Steps :current="currentStep">
            <Step title="标签信息" icon="md-pricetags" />
            <Step title="绑定资源" icon="md-albums" />
          </Steps>
        </FormItem>
        <template v-if="currentStep === 0">
          <FormItem>
            <Row>
              <Col span="12">标签键</Col>
              <Col span="12">标签值</Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <!-- 这里的input在考虑加不加disabled 反正后端已经不更新这2个值了 -->
              <Col span="10"><Input v-model="formValidate.tag_key" placeholder="Enter key ..." /></Col>
              <Col span="1" offset="1"><span> : </span></Col>
              <Col span="10"><Input v-model="formValidate.tag_value" placeholder="Enter value ..." /> </Col>
              <!-- <Col span="1" offset="1"><Icon type="md-trash" @click="handleEdit(idx)" /></Col> -->
            </Row>
          </FormItem>
        </template>
        <template v-if="currentStep === 1">
          <FormItem prop="asset_type">
            <span>选择类型:</span>
            <Select v-model="formValidate.asset_type" clearable @on-change="getAssetList">
              <Option v-for="item in assetTypeList" :key="item.value" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="asset_ids">
            <span>选择资源:</span>
            <Select v-model="formValidate.asset_ids" clearable filterable multiple>
              <Option v-for="item in assetList" :key="item.id" :value="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="tag_detail">
            <span>备注信息</span>
            <Input v-model="formValidate.tag_detail" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..." />
          </FormItem>
        </template>
        <div class="codo-footer">
          <Button v-if="currentStep === 0" style="margin-right: 8px" type="primary" @click="currentStep += 1">下一步</Button>
          <Button v-if="currentStep === 1" style="margin-right: 8px" @click="currentStep -= 1">上一步</Button>
          <Button v-if="currentStep === 1" style="margin-right: 8px" type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="modalMap.modalVisible = false">取消</Button>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>

import { patchTag, getTagAssetID } from '@/api/cmdb'
import { getServerList } from '@/api/cloud/server'
import { getMySQLList} from '@/api/cloud/mysql'
import { getRedisList} from '@/api/cloud/redis'

export default {
  name: 'TagEdit',
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
      // 资产列表
      assetList: [],
      // 资产类型列表
      assetTypeList: [
        {
          value: 'server',
          label: '主机',
        },
        {
          value: 'mysql',
          label: '数据库',
        },
        {
          value: 'redis',
          label: '缓存',
        },
        // {
        //   value: 'lb',
        //   label: '负载均衡',
        // },
      ],
      // 当前步骤，默认0
      currentStep: 0,
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
  mounted() {},
  methods: {
    handleNext() {
      this.currentStep += 1
    },
    //  获取指定资源的列表
    async getAssetList() {
      // 获取已有的ID
      this.assetList = []
      // this.formValidate.asset_ids = []
      const assetType = this.formValidate.asset_type
      const { data } = await getTagAssetID({ tag_id: this.formValidate.tag_id, asset_type: assetType })
      this.formValidate.asset_ids = data

      switch (assetType) {
      case 'server':
        this.getServerList()
        break
      case 'mysql':
        this.getMysqlList()
        break
      case 'redis':
        this.getRedisList()
        break
      default:
        console.log('default')
      }
    },
    // 获取主机数据
    async getServerList() {
      const { data } = await getServerList({ page_size: 999999 })
      this.assetList = data
    },
    // 获取mysql数据
    async getMysqlList() {
      const { data } = await getMySQLList({ page_size: 999999 })
      this.assetList = data
    },
    // 获取redis数据
    async getRedisList() {
      const { data } = await getRedisList({ page_size: 999999 })
      this.assetList = data
    },
    // 提交给后端
    async handleSubmit() {
      const { msg } = await patchTag(this.formValidate)
      this.$Message.success(msg)
      this.$emit('e-close')
      this.$emit('e-update')
    },
  },
}
</script>

<style>
.codo-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 3px 16px;
  text-align: right;
}
</style>
