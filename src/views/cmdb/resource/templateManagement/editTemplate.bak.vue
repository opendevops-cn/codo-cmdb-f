<template>
  <Drawer v-model="showDrawer" :title="templateInfo.name" width="1000" @on-close="onClose">
    <div class="drawer__content">
      <div class="drawer__content__section">
        <div class="drawer__content__section__header">
          <div class="drawer__content__section__header__title">基本信息</div>
          <div v-if="!editBasicInfo" class="drawer__content__section__header__icon" @click="editBasicInfo = true">
            <Icon type="md-create" /><span class="drawer__content__section__header__icon__text">编辑</span>
          </div>
        </div>
        <div v-if="!editBasicInfo" class="drawer__content__section__info">
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">模板名称</div>
            <div class="drawer__content__section__info__line__value">{{ templateInfo.name }}</div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">模板类型</div>
            <div class="drawer__content__section__info__line__value">{{ templateInfo.resTypeRender }}</div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">私有子网</div>
            <div class="drawer__content__section__info__line__value">{{ templateInfo.subnet_name }}</div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">私有网络</div>
            <div class="drawer__content__section__info__line__value">{{ templateInfo.vpc_name }}</div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">云区域</div>
            <div class="drawer__content__section__info__line__value">{{ templateInfo.cloud_region_id }}</div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">云厂商</div>
            <div class="drawer__content__section__info__line__value">{{ templateInfo.cloundAccountRender }}</div>
          </div>
        </div>
        <div v-else class="drawer__content__section__form">
          <Form ref="basicForm" :model="templateInfo" :label-width="100" :rules="formRules">
            <div class="modal__content__section__form">
              <div class="modal__content__section__form__custom">
                <FormItem prop="name" label="模板名称">
                  <Input v-model="templateInfo.name" type="text" placeholder="请输入模板名称" />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="res_type" label="模板类型">
                  <Select v-model="templateInfo.res_type" type="text" placeholder="请选择模板类型">
                    <Option v-for="item in resTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="modal__content__section__form__longer">
                <FormItem prop="subnet_id" label="私有子网">
                  <Select v-model="templateInfo.subnet_id" filterable placeholder="请选择私有子网" @on-change="handleInstanceChange">
                    <Option v-for="item in vswitchOptions" :key="item.id" :value="item.instance_id">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </div>
              <div class="modal__content__section__form__longer">
                <FormItem prop="vpc_name" label="私有网络">
                  <Input v-model="templateInfo.vpc_name" type="text" disabled />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="cloud_region_id" label="云区域">
                  <Input v-model="templateInfo.cloud_region_id" type="text" disabled placeholder="" />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="cloundAccountRender" label="云厂商">
                  <Input v-model="templateInfo.cloundAccountRender" type="text" disabled placeholder="" />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="region" label="地域">
                  <Input v-model="templateInfo.region" type="text" disabled placeholder="" />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="zone" label="可用区">
                  <Input v-model="templateInfo.zone" type="text" disabled placeholder="" />
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div class="drawer__content__box">
        <div class="drawer__content__section">
          <div class="drawer__content__section__header">
            <div class="drawer__content__section__header__title">实例配置</div>
            <div v-if="!editModelInfo" class="drawer__content__section__header__icon" @click="handleEditModelInfo">
              <Icon type="md-create" /><span class="drawer__content__section__header__icon__text">编辑</span>
            </div>
          </div>
          <div v-if="!editModelInfo" class="drawer__content__section__info">
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">镜像</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.image_name }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">实例计费模式</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.instanceChargeTypeRender }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">CPU</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.cpu }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">内存</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.memory }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">实例类型</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.instance_type }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">系统盘类型</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.systemDiskTypeRender }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">系统盘大小</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.system_disk_size }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">数据盘类型</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.dataDiskTypeRender }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">数据盘大小</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.data_disk.size }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">私有IP</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.inner_ip }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">网络计费模式</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.internetChargeTypeRender }}</div>
            </div>
            <template v-if="templateInfo.internetChargeTypeRender == 'BANDWIDTH_PACKAGE'">
              <div class="drawer__content__section__info__line">
                <div class="drawer__content__section__info__line__label">带宽包</div>
                <div class="drawer__content__section__info__line__value">{{ templateInfo.bandwidth_pkg_id }}</div>
              </div>
            </template>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">带宽限制</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.max_flow_out }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">安全组</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.renderSecurityGroups }}</div>
            </div>
          </div>
          <div v-else class="drawer__content__section__form">
            <Form ref="resTypeForm" :model="templateInfo" :label-width="100" :rules="formRules">
              <div class="modal__content__section__form">
                <div class="modal__content__section__form__longer">
                  <FormItem prop="image_id" label="镜像">
                    <Select
                      v-model="templateInfo.image_id"
                      :disabled="!templateInfo.subnet_id"
                      filterable
                      clearable
                      :placeholder="!templateInfo.subnet_id ? '请先选择私有子网': '请搜索'"
                      :loading="imageIdLoading">
                      <Option v-for="(option, index) in imageIdOptions" :key="index" :value="option.value">{{ option.label }}</Option>
                    </Select>
                  <!-- <Input v-model="templateInfo.image_id" type="text" placeholder="请输入" /> -->
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="instance_charge_type" label="实例计费模式">
                    <Select v-model="templateInfo.instance_charge_type" placeholder="请选择">
                      <Option v-for="item in instanceChargeTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <div class="modal__content__section__form__special">
                    <div class="modal__content__section__form__special__label">
                      实例配置
                      <Tooltip placement="top-start">
                        <div slot="content">
                          <div>填写基础配置及实例类型后自动查询回填</div>
                        </div>
                        <Icon type="ios-help-circle-outline" style="margin-left: 5px;" />
                      </Tooltip>
                    </div>
                    <FormItem prop="cpu">
                      <Input v-model="templateInfo.cpu" type="text" placeholder="CPU" disabled /><span class="modal__content__section__form__special__unit">核</span>
                    </FormItem>
                    <FormItem prop="memory">
                      <Input v-model="templateInfo.memory" type="text" placeholder="内存" disabled /><span class="modal__content__section__form__special__unit">GB</span>
                    </FormItem>
                  </div>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="instance_type" label="实例类型">
                    <Input v-model="templateInfo.instance_type" type="text" placeholder="请输入实例类型" />
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="system_disk_type" label="系统盘类型">
                    <Select v-model="templateInfo.system_disk_type" placeholder="请选择">
                      <Option v-for="item in systemDiskTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="system_disk_size" label="系统盘大小">
                    <Input v-model="templateInfo.system_disk_size" type="number" placeholder="请输入">
                      <div slot="suffix" class="modal__content__section__form__int__unit">G</div>
                    </Input>
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="data_disk_type" label="数据盘类型">
                    <Select v-model="templateInfo.data_disk_type" placeholder="请选择">
                      <Option v-for="item in dataDiskTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="data_disk_size" label="数据盘大小">
                    <Input v-model="templateInfo.data_disk_size" type="number" placeholder="请输入">
                      <div slot="suffix" class="modal__content__section__form__int__unit">G</div>
                    </Input>
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="internet_charge_type" label="网络计费模式">
                    <Select v-model="templateInfo.internet_charge_type" placeholder="请选择">
                      <Option v-for="item in internetChargeTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="max_flow_out" label="带宽限制">
                    <InputNumber v-model="templateInfo.max_flow_out" :max="2000" :min="1" />
                  </FormItem>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="securityGroupsValues" label="安全组">
                    <Select v-model="templateInfo.securityGroupsValues" filterable placeholder="请选择" multiple>
                      <Option v-for="item in securityGroupOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <div class="drawer__content__section">
          <div class="drawer__content__section__header">
            <div class="drawer__content__section__header__title">其他设置</div>
            <div v-if="!editOtherInfo" class="drawer__content__section__header__icon" @click="editOtherInfo = true">
              <Icon type="md-create" /><span class="drawer__content__section__header__icon__text">编辑</span>
            </div>
          </div>
          <div v-if="!editOtherInfo" class="drawer__content__section__info">
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">标签</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.renderTags }}</div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">备注</div>
              <div class="drawer__content__section__info__line__value">{{ templateInfo.description }}</div>
            </div>
          </div>
          <div v-else>
            <Form ref="otherForm" :model="templateInfo" :label-width="100" :rules="formRules">
              <div class="modal__content__section__form">
                <div class="modal__content__section__form__tags">
                  <div class="modal__content__section__form__tags__label">标签</div>
                  <div class="modal__content__section__form__tags__content">
                    <div
                      v-for="(item, index) in templateInfo.tagsValues"
                      :key="index"
                      class="modal__content__section__form__tags__content__line"
                    >
                      <FormItem :prop="'tagsValues.' + index + '.key'" :rules="{required: true, message: '标签键不能为空', trigger: 'blur'}">
                        <Select v-model="item.key" filterable @on-select="handleSelectTag">
                          <Option v-for="tagKey in tagKeyOptions" :key="tagKey.value" :value="tagKey.value">{{ tagKey.label }}</Option>
                        </Select>
                      </FormItem>
                      <FormItem :prop="'tagsValues.' + index + '.value'" :rules="{required: true, message: '标签值不能为空', trigger: 'blur'}">
                        <Select
                          v-model="item.value"
                          filterable
                          :loading="tagValueOptions[item.key] === undefined"
                          :disabled="item.key === ''"
                          :placeholder="item.key === '' ? '请先选择标签键' : '请选择'">
                          <Option v-for="tagValue in tagValueOptions[item.key]" :key="tagValue.value" :value="tagValue.value">{{ tagValue.label }}</Option>
                        </Select>
                      </FormItem>
                      <Icon v-if="index === templateInfo.tagsValues.length - 1" size="20" type="md-add" @click="handleAddTag" />
                      <Icon v-if="templateInfo.tagsValues.length > 1" size="20" type="md-close" @click="handleRemoveTag(index)" />
                    </div>
                  </div>
                </div>
                <div class="modal__content__section__form__longer">
                  <FormItem prop="description" label="备注">
                    <Input v-model="templateInfo.description" type="textarea" placeholder="请输入备注" />
                  </FormItem>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="editBasicInfo || editModelInfo || editOtherInfo" class="drawer__footer">
      <Button type="primary" @click="handleUpdate">确认修改</Button>
    </div>
  </Drawer>
</template>
<!-- eslint-disable camelcase -->

<script>

import { debounce } from "lodash"

import {
  modifyOrderTemplate,
  getTagList,
  getImageIds,
  getInsType,
} from "@/api/cmdb"

import { getVswitch } from "@/api/cloud/vswitch"
import { getSecurityGroup } from "@/api/cloud/security-group"

import { getFeFormInfo, getUniqueStr, getParams } from "../utils"

import {
  resTypeOptions,
  dataDiskTypeOptions,
  systemDiskTypeOptions,
  instanceChargeTypeOptions,
  internetChargeTypeOptions,
} from "../options"

// 镜像查询间隔ms
const DEBOUNCE_IMAGE_ID = 300

// 实例配置查询间隔ms
const DEBOUNCE_INS_OPTIONS = 1000

export default {
  name: "EditTemplate",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // 镜像远程搜索
      imageIdOptions: [],
      imageIdLoading: false,
      specialSplit: "",
      editBasicInfo: false,
      editModelInfo: false,
      editOtherInfo: false,
      vswitchOptions: [],
      securityGroupOptions: [],
      tagKeyOptions: [],
      resTypeOptions,
      dataDiskTypeOptions,
      systemDiskTypeOptions,
      instanceChargeTypeOptions,
      internetChargeTypeOptions,
      tagValueOptions: {},
      templateInfo: {
        cloud_region_id: "",
        cloud_region_name: "",
        account_id: "",
        name: "",
        res_type: "",
        vendor: "",
        region: "",
        zone: "",
        image_id: "",
        cpu: "",
        memory: "",
        instance_type: "",
        system_disk_size: "",
        system_disk_type: "",
        security_groups: {},
        renderSecurityGroups: "",
        tags: {},
        tagsValues: [{
          key: "",
          value: "",
        }],
        renderTags: "",
        vpc_id: "",
        vpc_name: "",
        subnet_id: "",
        subnet_name: "",
        max_flow_out: 1,
        image_passwd: "",
        instance_charge_type: "",
        internet_charge_type: "",
        description: "",
        data_disk_type: "",
        data_disk_size: "",
        data_disk: {
          size: "",
          type: "",
        },
        is_eip: "",
        inner_ip: "",
        bandwidth_pkg_id: "",
        cloundAccountRender: "",
        resTypeRender: "",
        instanceChargeTypeRender: "",
        systemDiskTypeRender: "",
        dataDiskTypeRender: "",
        internetChargeTypeRender: "",
        securityGroupsValues: "",
      },
      formRules: {
        name: [
          { required: true, message: "模板名称必填", trigger: "blur" },
        ],
        res_type: [
          { required: true, message: "模板类型必选", trigger: "blur" },
        ],
        subnet_id: [
          { required: true, message: "私有子网必选", trigger: "change" },
        ],
        cloud_region_id: [
          { required: true, message: "云区域不能为空", trigger: "blur" },
        ],
        cloundAccountRender: [
          { required: true, message: "云厂商不能为空", trigger: "blur" },
        ],
        vpc_name: [
          { required: true, message: "私有网络不能为空", trigger: "blur" },
        ],
        region: [
          { required: true, message: "地域不能为空", trigger: "blur" },
        ],
        zone: [
          { required: true, message: "可用区不能为空", trigger: "blur" },
        ],
        image_id: [
          { required: true, message: "镜像必填", trigger: "blur" },
        ],
        instance_charge_type: [
          { required: true, message: "实例计费模式必填", trigger: "blur" },
        ],
        cpu: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error("cpu必填"))
              } else {
                callback()
              }
            },
            trigger: "blur",
          },
        ],
        memory: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error("内存必填"))
              } else {
                callback()
              }
            },
            trigger: "blur",
          },
        ],
        instance_type: [
          { required: true, message: "实例类型必填", trigger: "blur" },
        ],
        system_disk_type: [
          { required: true, message: "系统盘类型必填", trigger: "blur" },
        ],
        system_disk_size: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error("系统盘大小必填"))
              } else {
                callback()
              }
            },
            trigger: "blur",
          },
        ],
        internet_charge_type: [
          { required: true, message: "网络计费模式必填", trigger: "blur" },
        ],
        max_flow_out: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error("带宽限制必填"))
              } else {
                callback()
              }
            },
            trigger: "blur",
          },
        ],
        securityGroupsValues: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value || value.length === 0) {
                callback(new Error("安全组必填"))
              } else {
                callback()
              }
            },
            trigger: "blur",
          },
        ],
        tags: [
          { required: true, message: "标签必填", trigger: "blur" },
        ],
      },
      showDrawer: false,
    }
  },
  computed: {
    insTypeParams() {
      const {
        account_id, vendor, res_type, region, zone, instance_type,
      } = this.templateInfo
      return {
        account_id, vendor, res_type, region, zone, instance_type, isEdit: this.editModelInfo,
      }
    },
  },
  watch: {
    show(v) {
      if (v) {
        this.getSettings()
      }
      this.showDrawer = v
    },
    row(v) {
      this.editBasicInfo = false
      this.editModelInfo = false
      this.editOtherInfo = false
      this.templateInfo = getFeFormInfo(v, this)
    },
    insTypeParams: {
      async handler(val) {
        const {
          account_id, vendor, res_type, region, zone, instance_type, isEdit,
        } = val
        if (!account_id || !vendor || !res_type || !region || !zone || !instance_type || !isEdit) return
        this.getInsTypeOptions()
      },
      deep: true,
    },
  },
  mounted() {
    this.specialSplit = getUniqueStr(3)
  },
  methods: {
    handleEditModelInfo() {
      this.editModelInfo = true
      this.getSecurityGroupData({
        filter_map: {
          region: this.templateInfo.region,
          cloud_name: this.templateInfo.vendor,
        },
      })
      this.getImageIdOptions({
        filter_map: {
          region: this.templateInfo.region,
          cloud_name: this.templateInfo.vendor,
        },
      })
    },
    getInsTypeOptions: debounce(async function () {
      try {
        const {
          account_id, vendor, res_type, region, zone, instance_type,
        } = this.templateInfo
        const { data } = await getInsType({
          account_id,
          vendor,
          res_type,
          region,
          zone,
          instance_type,
        })
        this.templateInfo.cpu = data.cpu
        this.templateInfo.memory = data.memory
      } catch (err) {
        this.templateInfo.cpu = ""
        this.templateInfo.memory = ""
      }
    }, DEBOUNCE_INS_OPTIONS),
    getImageIdOptions: debounce(async function (params) {
      try {
        this.imageIdLoading = true
        const { data } = await getImageIds(params)
        this.imageIdOptions = data.map((c) => ({
          label: `${c.instance_id} | ${c.name} | ${c.os_name}`,
          value: c.instance_id,
        }))
      } catch (err) {
        this.imageIdOptions = []
      } finally {
        this.imageIdLoading = false
      }
    }, DEBOUNCE_IMAGE_ID),
    tipFormat(val) {
      return val + "Mbps"
    },
    async handleUpdate() {
      try {
        const basicCheck = new Promise((resolve, reject) => {
          if (!this.editBasicInfo) {
            resolve()
          } else {
            this.$refs.basicForm.validate((v) => {
              if (!v) {
                reject(new Error("表单校验失败，请检查"))
              }
              resolve()
            })
          }
        })
        const resTypeCheck = new Promise((resolve, reject) => {
          if (!this.editModelInfo) {
            resolve()
          } else {
            this.$refs.resTypeForm.validate((v) => {
              if (!v) {
                reject(new Error("表单校验失败，请检查"))
              }
              resolve()
            })
          }
        })
        const otherCheck = new Promise((resolve, reject) => {
          if (!this.editOtherInfo) {
            resolve()
          } else {
            this.$refs.otherForm.validate((v) => {
              if (!v) {
                reject(new Error("表单校验失败，请检查"))
              }
              resolve()
            })
          }
        })
        await Promise.all([basicCheck, resTypeCheck, otherCheck])
        const params = getParams(this.templateInfo, this)
        const res = await modifyOrderTemplate({
          id: this.templateInfo.id,
          ...params,
        })
        if (!res) {
          throw new Error("请求错误，请重试")
        }
        this.$emit("editSuccessCallback")
        this.showDrawer = false
        this.$Message.success(res.msg)
      } catch (error) {
        console.log(error)
        this.$Message.error(error.message)
      }
    },
    handleInstanceChange(v) {
      const option = this.vswitchOptions.find((c) => c.instance_id === v)
      this.templateInfo = {
        ...this.templateInfo,
        subnet_name: `${option.instance_id} | ${option.name} | ${option.cidr_block_v4}`,
        vendor: option.cloud_name,
        account_id: option.account_id,
        cloundAccountRender: `${option.account_id} | ${option.cloud_name}`,
        vpc_id: option.vpc_id,
        vpc_name: `${option.vpc_id} | ${option.vpc_name}`,
        cloud_region_id: option.cloud_region_id,
        cloudRender: `${option.cloud_region_id}`,
        region: option.region,
        zone: option.zone,
      }
      this.getSecurityGroupData({
        filter_map: {
          region: option.region,
          cloud_name: option.cloud_name,
        },
      })
      this.getImageIdOptions({
        filter_map: {
          region: option.region,
          cloud_name: option.cloud_name,
        },
      })
    },
    async getSettings() {
      this.getVswitchData()
      this.getTagData()
    },
    async getVswitchData() {
      const { data } = await getVswitch()
      this.vswitchOptions = data.map((c) => ({
        ...c,
        label: `${c.instance_id} | ${c.name} | ${c.cidr_block_v4}`,
      }))
    },
    async getSecurityGroupData(params) {
      const { data } = await getSecurityGroup(params)
      this.securityGroupOptions = data.map((c) => ({
        ...c,
        label: `${c.instance_id} | ${c.security_group_name}`,
        value: `${c.instance_id}${this.specialSplit}${c.security_group_name}`,
      }))
    },
    async getTagData() {
      const { data } = await getTagList()

      this.tagKeyOptions = data.map((c) => ({
        label: c,
        value: c,
      }))
    },
    async handleSelectTag(tag) {
      const { data } = await getTagList({ tag_key: tag.value })

      this.$set(this.tagValueOptions, tag.value, data.map((c) => ({
        label: c,
        value: c,
      })))
    },
    handleAddTag() {
      this.templateInfo.tagsValues.push({
        key: "",
        value: "",
      })
    },
    handleRemoveTag(index) {
      this.templateInfo.tagsValues = this.templateInfo.tagsValues.filter((_, i) => i !== index)
    },
    onClose() {
      this.showDrawer = false
      this.$emit("closeDrawer")
    },
  },
}

</script>

<style scoped lang="less">
.drawer {
  position: relative;
  &__content {
    &__box {
      display: flex;
      margin-top: 12px;
      .drawer__content__section {
        width: 50%;
      }
    }
    &__section {
      margin: 0 12px;
      &__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        &__title {
          font-size: 16px;
        }
        &__icon {
          margin-right: 12px;
          cursor: pointer;
          color: #789EFD;
          &__text {
            margin-left: 5px;
          }
        }
      }
      &__info {
        border-width: 1px 1px 0 1px;
        border-color: #F1F1F1;
        border-style: solid;
        &__line {
          display: flex;
          line-height: 32px;
          border-bottom: #F1F1F1 1px solid;
          box-sizing: border-box;
          &__label {
            display: flex;
            align-items: center;
            padding-left: 16px;
            width: 160px;
            flex-shrink: 0;
            font-size: 14px;
            background-color: #FAFAFA;
          }
          &__value {
            display: flex;
            padding-left: 16px;
            word-break: break-all;
          }
        }
      }
    }
  }
  &__footer {
      position: sticky;
      width: 100%;
      height: 48px;
      padding-right: 24px;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
    }
}

.modal {
  &__content {
    &__section {
      border-width: 1px 0 0 0;
      border-color: #ccc;
      border-style: solid;
      &__form {
        padding-left: 12px;
        display: flex;
        flex-wrap: wrap;
        &__custom {
          width: 50%;
        }
        &__select {
          width: 50%;
        }
        &__int {
          width: 50%;
          &__unit {
            line-height: 32px;
          }
        }
        &__longer {
          width: 100%;
          /deep/ .ivu-input-number {
            width: 100%;
          }
        }
        /deep/ .ivu-form-item {
          padding-right: 20px;
          // width: 50%;
          .ivu-form-item-label {
            padding: 10px 0;
            font-size: 12px;
            text-align: center;
          }
          .ivu-form-item-content {
            margin-left: 112px !important;
          }
        }
        &__special, &__tags {
          display: flex;
          &__label {
            width: 100px;
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            text-align: center;
            flex-shrink: 0;
          }
          &__label::before {
            content: '*';
            display: inline-block;
            margin-right: 4px;
            line-height: 1;
            font-family: SimSun;
            font-size: 14px;
            color: #ed4014;
          }
          &__unit {
            margin-left: 5px;
          }
        }
        &__special {
          /deep/ .ivu-form-item {
            flex: 1;
            padding-right: 0px;
            .ivu-form-item-content {
              display: flex;
              margin-left: 12px !important;
              margin-right: 20px;
            }
          }
        }
        &__tags {
          width: 100%;
          &__content {
            flex: 1;
            &__line {
              display: flex;
              /deep/ .ivu-form-item {
                padding-right: 12px;
                width: 130px;
                margin-left: 12px;
                box-sizing: border-box;
                .ivu-form-item-content {
                  width: 100%;
                  margin-left: 0 !important;
                }
              }
              /deep/ .ivu-icon-md-close, .ivu-icon-md-add {
                margin-right: 10px;
                line-height: 32px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}

/deep/ .ivu-tooltip-content {
  .ivu-tooltip-inner {
    max-width: unset;
    background-color: #fff;
    color: #000;
  }
  .ivu-tooltip-arrow {
    background-color: #fff;
  }
}

</style>
