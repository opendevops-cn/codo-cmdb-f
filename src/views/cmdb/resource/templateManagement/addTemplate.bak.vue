<template>
  <Modal
    v-model="showModal"
    :title="title"
    :loading="modalLoading"
    :width="70"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <div class="modal__content">
      <Form
        ref="form"
        :model="formValues"
        :label-width="100"
        :rules="formRules"
      >
        <div class="modal__content__section">
          <div class="modal__content__section__title">基础配置</div>
          <div class="modal__content__section__form">
            <div class="modal__content__section__form__custom">
              <FormItem prop="name" label="模板名称">
                <Input
                  v-model="formValues.name"
                  type="text"
                  placeholder="请输入模板名称"
                />
              </FormItem>
            </div>
            <div class="modal__content__section__form__select">
              <FormItem prop="res_type" label="模板类型">
                <Select
                  v-model="formValues.res_type"
                  type="text"
                  placeholder="请选择模板类型"
                >
                  <Option
                    v-for="item in resTypeOptions"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </div>
            <div class="modal__content__section__form__longer">
              <FormItem prop="subnet_id" label="私有子网">
                <Select
                  v-model="formValues.subnet_id"
                  filterable
                  placeholder="请选择私有子网"
                  @on-change="handleInstanceChange"
                >
                  <Option
                    v-for="item in vswitchOptions"
                    :key="item.id"
                    :value="item.instance_id"
                    >{{ item.label }}</Option
                  >
                </Select>
              </FormItem>
            </div>
            <div class="modal__content__section__form__longer">
              <FormItem prop="vpc_name" label="私有网络">
                <Input v-model="formValues.vpc_name" type="text" disabled />
              </FormItem>
            </div>
            <div class="modal__content__section__form__select">
              <FormItem prop="cloud_region_id" label="云区域">
                <Input
                  v-model="formValues.cloud_region_id"
                  type="text"
                  disabled
                  placeholder=""
                />
              </FormItem>
            </div>
            <div class="modal__content__section__form__select">
              <FormItem prop="cloundAccountRender" label="云厂商">
                <Input
                  v-model="formValues.cloundAccountRender"
                  type="text"
                  disabled
                  placeholder=""
                />
              </FormItem>
            </div>
            <div class="modal__content__section__form__select">
              <FormItem prop="region" label="地域">
                <Input
                  v-model="formValues.region"
                  type="text"
                  disabled
                  placeholder=""
                />
              </FormItem>
            </div>
            <div class="modal__content__section__form__select">
              <FormItem prop="zone" label="可用区">
                <Input
                  v-model="formValues.zone"
                  type="text"
                  disabled
                  placeholder=""
                />
              </FormItem>
            </div>
          </div>
          <div class="modal__content__section">
            <div class="modal__content__section__title">实例配置</div>
            <div class="modal__content__section__form">
              <div class="modal__content__section__form__custom">
                <FormItem prop="image_id" label="镜像">
                  <Select
                    v-model="formValues.image_id"
                    :disabled="!formValues.subnet_id"
                    filterable
                    clearable
                    :placeholder="
                      !formValues.subnet_id ? '请先选择私有子网' : '请搜索'
                    "
                    :loading="imageIdLoading"
                  >
                    <Option
                      v-for="(option, index) in imageIdOptions"
                      :key="index"
                      :value="option.value"
                      >{{ option.label }}</Option
                    >
                  </Select>
                  <!-- <Input v-model="formValues.image_id" type="text" placeholder="请输入" /> -->
                </FormItem>
              </div>
              <div class="modal__content__section__form__custom">
                <FormItem prop="instance_charge_type" label="实例计费模式">
                  <Select
                    v-model="formValues.instance_charge_type"
                    placeholder="请选择"
                  >
                    <Option
                      v-for="item in instanceChargeTypeOptions"
                      :key="item.value"
                      :value="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </FormItem>
              </div>
              <div class="modal__content__section__form__int">
                <div class="modal__content__section__form__special">
                  <div class="modal__content__section__form__special__label">
                    <span>实例配置</span>
                    <Tooltip placement="top-start">
                      <div slot="content">
                        <div>填写基础配置及实例类型后自动查询回填</div>
                      </div>
                      <Icon
                        type="ios-help-circle-outline"
                        style="margin-left: 5px"
                      />
                    </Tooltip>
                  </div>
                  <FormItem prop="cpu">
                    <Input
                      v-model="formValues.cpu"
                      type="number"
                      placeholder="CPU"
                      disabled
                    /><span class="modal__content__section__form__special__unit"
                      >核</span
                    >
                  </FormItem>
                  <FormItem prop="memory">
                    <Input
                      v-model="formValues.memory"
                      type="number"
                      placeholder="内存"
                      disabled
                    /><span class="modal__content__section__form__special__unit"
                      >GB</span
                    >
                  </FormItem>
                </div>
              </div>
              <div class="modal__content__section__form__custom">
                <FormItem prop="instance_type" label="实例类型">
                  <Input
                    v-model="formValues.instance_type"
                    type="text"
                    placeholder="请输入实例类型"
                  />
                </FormItem>
              </div>
              <div class="modal__content__section__form__custom">
                <FormItem prop="system_disk_type" label="系统盘类型">
                  <Select
                    v-model="formValues.system_disk_type"
                    placeholder="请选择"
                  >
                    <Option
                      v-for="item in systemDiskTypeOptions"
                      :key="item.value"
                      :value="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </FormItem>
              </div>
              <div class="modal__content__section__form__int">
                <FormItem prop="system_disk_size" label="系统盘大小">
                  <Input
                    v-model="formValues.system_disk_size"
                    type="number"
                    placeholder="请输入"
                  >
                    <div
                      slot="suffix"
                      class="modal__content__section__form__int__unit"
                    >
                      GB
                    </div>
                  </Input>
                </FormItem>
              </div>
              <div class="modal__content__section__form__custom">
                <FormItem prop="data_disk_type" label="数据盘类型">
                  <Select
                    v-model="formValues.data_disk_type"
                    placeholder="请选择"
                  >
                    <Option
                      v-for="item in dataDiskTypeOptions"
                      :key="item.value"
                      :value="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </FormItem>
              </div>
              <div class="modal__content__section__form__int">
                <FormItem prop="data_disk_size" label="数据盘大小">
                  <Input
                    v-model="formValues.data_disk_size"
                    type="number"
                    placeholder="请输入"
                  >
                    <div
                      slot="suffix"
                      class="modal__content__section__form__int__unit"
                    >
                      GB
                    </div>
                  </Input>
                </FormItem>
              </div>
              <div class="modal__content__section__form__custom">
                <FormItem prop="inner_ip" label="指定私有IP">
                  <Input
                    v-model="formValues.inner_ip"
                    type="text"
                    placeholder="请输入"
                  >
                  </Input>
                </FormItem>
              </div>
              <div class="modal__content__section__form__custom">
                <FormItem prop="is_eip" label="开通弹性公网">
                  <RadioGroup v-model="formValues.is_eip" type="button">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
              <template v-if="formValues.is_eip == '1'">
                <div class="modal__content__section__form__custom">
                  <FormItem prop="internet_charge_type" label="网络计费模式">
                    <Select
                      v-model="formValues.internet_charge_type"
                      placeholder="请选择"
                    >
                      <Option
                        v-for="item in internetChargeTypeOptions"
                        :key="item.value"
                        :value="item.value"
                        >{{ item.label }}</Option
                      >
                    </Select>
                  </FormItem>
                </div>
                <div class="modal__content__section__form__limit">
                  <div class="modal__content__section__form__limit__special">
                    <div
                      class="modal__content__section__form__limit__special__label"
                    >
                      带宽限制
                    </div>
                    <FormItem
                      prop="max_flow_out"
                      class="modal__content__section__form__limit__special__slider"
                    >
                      <Slider
                        v-model="formValues.max_flow_out"
                        :max="2000"
                        :tip-format="tipFormat"
                        :marks="commonNums"
                      />
                    </FormItem>
                    <FormItem
                      prop="max_flow_out"
                      class="modal__content__section__form__limit__special__input"
                    >
                      <InputNumber
                        v-model="formValues.max_flow_out"
                        :max="2000"
                        :min="1"
                      /><span
                        class="modal__content__section__form__limit__special__unit"
                        >Mbps</span
                      >
                    </FormItem>
                  </div>
                </div>

                <template
                  v-if="formValues.internet_charge_type == 'BANDWIDTH_PACKAGE'"
                >
                  <div class="modal__content__section__form__custom">
                    <FormItem prop="bandwidth_pkg_id" label="带宽包">
                      <Select
                        v-model="formValues.bandwidth_pkg_id"
                        :disabled="!formValues.subnet_id"
                        filterable
                        clearable
                        :placeholder="
                          !formValues.subnet_id ? '请先选择私有子网' : '请搜索'
                        "
                        :loading="bindWidthIdLoading"
                      >
                        <Option
                          v-for="(option, index) in bindWidthIdOptions"
                          :key="index"
                          :value="option.value"
                          >{{ option.label }}</Option
                        >
                      </Select>
                    </FormItem>
                  </div>
                </template>
              </template>
              <div class="modal__content__section__form__longer">
                <FormItem prop="securityGroupsValues" label="安全组">
                  <Select
                    v-model="formValues.securityGroupsValues"
                    :placeholder="
                      !formValues.subnet_id ? '请先选择私有子网' : '请搜索'
                    "
                    filterable
                    :disabled="!formValues.subnet_id"
                    multiple
                  >
                    <Option
                      v-for="item in securityGroupOptions"
                      :key="item.value"
                      :value="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </FormItem>
              </div>
            </div>
          </div>
          <div class="modal__content__section">
            <div class="modal__content__section__title">其他设置</div>
            <div class="modal__content__section__form">
              <div class="modal__content__section__form__tags">
                <div class="modal__content__section__form__tags__label">
                  标签
                </div>
                <div class="modal__content__section__form__tags__content">
                  <div
                    v-for="(item, index) in formValues.tagsValues"
                    :key="index"
                    class="modal__content__section__form__tags__content__line"
                  >
                    <FormItem
                      :prop="'tagsValues.' + index + '.key'"
                      :rules="{
                        required: true,
                        message: '标签键不能为空',
                        trigger: 'blur',
                      }"
                    >
                      <Select
                        v-model="item.key"
                        filterable
                        @on-select="handleSelectTag"
                      >
                        <Option
                          v-for="tagKey in tagKeyOptions"
                          :key="tagKey.value"
                          :value="tagKey.value"
                          >{{ tagKey.label }}</Option
                        >
                      </Select>
                    </FormItem>
                    <FormItem
                      :prop="'tagsValues.' + index + '.value'"
                      :rules="{
                        required: true,
                        message: '标签值不能为空',
                        trigger: 'blur',
                      }"
                    >
                      <Select
                        v-model="item.value"
                        filterable
                        :loading="tagValueOptions[item.key] === undefined"
                        :disabled="item.key === ''"
                        :placeholder="
                          item.key === '' ? '请先选择标签键' : '请选择'
                        "
                      >
                        <Option
                          v-for="tagValue in tagValueOptions[item.key]"
                          :key="tagValue.value"
                          :value="tagValue.value"
                          >{{ tagValue.label }}</Option
                        >
                      </Select>
                    </FormItem>
                    <Icon
                      v-if="index === formValues.tagsValues.length - 1"
                      size="20"
                      type="md-add"
                      @click="handleAddTag"
                    />
                    <Icon
                      v-if="formValues.tagsValues.length > 1"
                      size="20"
                      type="md-close"
                      @click="handleRemoveTag(index)"
                    />
                  </div>
                </div>
              </div>
              <div class="modal__content__section__form__longer">
                <FormItem prop="description" label="备注">
                  <Input
                    v-model="formValues.description"
                    type="textarea"
                    placeholder="请输入备注"
                  />
                </FormItem>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <div v-if="buy" class="modal__content__buy">
        <Form
          ref="buyForm"
          :model="buyValues"
          :label-width="100"
          :rules="buyFormRules"
        >
          <FormItem prop="name">
            <span slot="label">
              <span>资源名称</span>
              <Tooltip placement="top-start">
                <div slot="content">
                  <div>
                    示例：业务-厂商-地域-环境-服务+编号(ops-tx-sh-test-etcd01)
                  </div>
                  <div>全部为英文或者数字，-为分隔符 是关键字不能被占用</div>
                </div>
                <Icon type="ios-help-circle-outline" style="margin-left: 5px" />
              </Tooltip>
            </span>
            <Input v-model="buyValues.name" type="text" />
          </FormItem>
          <FormItem prop="count" label="购买数量">
            <InputNumber v-model="buyValues.count" :max="10" :min="1" />
          </FormItem>
        </Form>
        <div class="modal__content__buy__price">
          <Tooltip placement="top" :max-width="1000">
            <div slot="content" class="popup__price">
              <div class="popup__price__header">
                <div class="popup__price__header__label">计费项</div>
                <div class="popup__price__header__value">价格</div>
              </div>
              <div class="popup__price__item">
                <div class="popup__price__item__label">实例</div>
                <div class="popup__price__item__value">
                  <div class="popup__price__item__value__final">
                    ￥{{ price.dis_count_price }}
                  </div>
                  <div
                    v-if="price.dis_count !== 100"
                    class="popup__price__item__value__discount"
                  >
                    {{ price.dis_count / 10 }}折
                  </div>
                  <div
                    v-if="price.dis_count !== 100"
                    class="popup__price__item__value__original"
                  >
                    ￥{{ price.original_price }}
                  </div>
                </div>
              </div>
              <div class="popup__price__item">
                <div class="popup__price__item__label">带宽</div>
                <div class="popup__price__item__value">
                  <div class="popup__price__item__value__final">
                    ￥{{ price.bandwidth_dis_count_price }}
                  </div>
                  <div
                    v-if="price.bandwidth_dis_count !== 100"
                    class="popup__price__item__value__discount"
                  >
                    {{ price.bandwidth_dis_count / 10 }}折
                  </div>
                  <div
                    v-if="price.bandwidth_dis_count !== 100"
                    class="popup__price__item__value__original"
                  >
                    ￥{{ price.bandwidth_original_price }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal__content__buy__price__label">配置费用</div>
          </Tooltip>
          <div v-if="!priceLoading" class="modal__content__buy__price__value">
            ￥{{
              (price.bandwidth_dis_count_price + price.dis_count_price).toFixed(
                2
              )
            }}
          </div>
          <div v-else class="modal__content__buy__price__loading">
            <Icon type="ios-loading" />
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<!-- eslint-disable camelcase -->
<script>
import { debounce } from 'lodash';
import {
  createOrderTemplate,
  getTagList,
  getPrice,
  createOrder,
  getImageIds,
  getInsType,
  getBindWidthPkgIds,
} from '@/api/cmdb';

import { getVswitch } from '@/api/cloud/vswitch';
import { getSecurityGroup } from '@/api/cloud/security-group';

import { getFeFormInfo, getUniqueStr, getParams } from '../utils';

import {
  resTypeOptions,
  dataDiskTypeOptions,
  systemDiskTypeOptions,
  instanceChargeTypeOptions,
  internetChargeTypeOptions,
} from '../options';

const DEFAULT_FORM_VALUES = {
  cloud_region_id: '',
  cloud_region_name: '',
  account_id: '',
  name: '',
  res_type: '',
  vendor: '',
  region: '',
  zone: '',
  image_id: '',
  image_name: '',
  cpu: '',
  memory: '',
  instance_type: '',
  system_disk_size: '',
  system_disk_type: '',
  security_groups: {},
  securityGroupsValues: [],
  tags: {},
  tagsValues: [
    {
      key: '',
      value: '',
    },
  ],
  vpc_id: '',
  vpc_name: '',
  subnet_id: '',
  subnet_name: '',
  max_flow_out: 1,
  image_passwd: '',
  instance_charge_type: '',
  internet_charge_type: '',
  description: '',
  is_eip: '',
  inner_ip: '',
  bandwidth_pkg_id: '',
  data_disk_type: '',
  data_disk_size: '',
  cloundAccountRender: '',
};

// 镜像查询间隔ms
const DEBOUNCE_IMAGE_ID = 300;

// 带宽包ID查询间隔ms
const DEBOUNCE_BINDWIDTH_ID = 1000;

// 实例配置查询间隔ms
const DEBOUNCE_INS_OPTIONS = 1000;

const DEFAULT_PRICE = {
  bandwidth_dis_count: 100,
  bandwidth_dis_count_price: 0,
  bandwidth_original_price: 0,
  dis_count: 100,
  dis_count_price: 0,
  original_price: 0,
};

export default {
  name: 'AddTemplateModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    buyRow: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // 镜像远程搜索
      imageIdOptions: [],
      imageIdLoading: false,
      // 镜像远程搜索
      bindWidthIdOptions: [],
      bindWidthIdLoading: false,
      // 带宽限制常用数字，点击设置具体值
      commonNums: {
        1: {
          label: this.$createElement(
            'div',
            {
              on: {
                click: () => {
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.$set(this.formValues, 'max_flow_out', 1);
                    }, 0);
                  });
                },
              },
            },
            '1'
          ),
        },
        200: {
          label: this.$createElement(
            'div',
            {
              on: {
                click: () => {
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.$set(this.formValues, 'max_flow_out', 200);
                    }, 0);
                  });
                },
              },
            },
            '200'
          ),
        },
        500: {
          label: this.$createElement(
            'div',
            {
              on: {
                click: () => {
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.$set(this.formValues, 'max_flow_out', 500);
                    }, 0);
                  });
                },
              },
            },
            '500'
          ),
        },
      },
      title: '创建资源模板字段页面',
      priceLoading: false,
      buy: false,
      price: DEFAULT_PRICE,
      // 处理tags、security_groups等数据结构
      specialSplit: '',
      resTypeOptions,
      dataDiskTypeOptions,
      systemDiskTypeOptions,
      instanceChargeTypeOptions,
      internetChargeTypeOptions,
      vswitchOptions: [],
      securityGroupOptions: [],
      tagKeyOptions: [],
      tagValueOptions: {},
      buyValues: {
        name: '',
        count: 1,
      },
      buyFormRules: {
        name: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (value === '') {
                callback(new Error('资源名称必填'));
              } else if (!/^([a-zA-Z0-9]+-){4}[a-zA-Z0-9]+$/.test(value)) {
                callback(new Error('资源名称格式错误，请检查'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        count: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value || value < 1) {
                callback(new Error('资源数量须大于等于1'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      formValues: DEFAULT_FORM_VALUES,
      formRules: {
        name: [{ required: true, message: '模板名称必填', trigger: 'blur' }],
        res_type: [
          { required: true, message: '模板类型必选', trigger: 'blur' },
        ],
        subnet_id: [
          { required: true, message: '私有子网必选', trigger: 'blur' },
        ],
        cloud_region_id: [
          { required: true, message: '云区域不能为空', trigger: 'blur' },
        ],
        cloundAccountRender: [
          { required: true, message: '云厂商不能为空', trigger: 'blur' },
        ],
        vpc_name: [
          { required: true, message: '私有网络不能为空', trigger: 'blur' },
        ],
        region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
        zone: [{ required: true, message: '可用区不能为空', trigger: 'blur' }],
        image_id: [{ required: true, message: '镜像必填', trigger: 'blur' }],
        instance_charge_type: [
          { required: true, message: '实例计费模式必填', trigger: 'blur' },
        ],
        cpu: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error('cpu必填'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        memory: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error('内存必填'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        instance_type: [
          { required: true, message: '实例类型必填', trigger: 'blur' },
        ],
        system_disk_type: [
          { required: true, message: '系统盘类型必填', trigger: 'blur' },
        ],
        system_disk_size: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error('系统盘大小必填'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        internet_charge_type: [
          { required: true, message: '网络计费模式必填', trigger: 'blur' },
        ],
        max_flow_out: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value) {
                callback(new Error('带宽限制必填'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        securityGroupsValues: [
          {
            required: true,
            validator: (_, value, callback) => {
              if (!value || value.length === 0) {
                callback(new Error('安全组必填'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        tags: [{ required: true, message: '标签必填', trigger: 'blur' }],
      },
      showModal: this.show,
      modalLoading: true,
    };
  },
  computed: {
    realShow() {
      return this.show;
    },
    insTypeParams() {
      const { account_id, vendor, res_type, region, zone, instance_type } =
        this.formValues;
      return {
        account_id,
        vendor,
        res_type,
        region,
        zone,
        instance_type,
      };
    },
  },
  watch: {
    show(v) {
      if (v) {
        this.getSettings();
      }
      this.showModal = v;
    },
    buyRow(v) {
      if (v) {
        this.title = '购买资源';
        this.formValues = getFeFormInfo(v, this);

        this.$nextTick(() => {
          this.buy = true;
          this.getSecurityGroupData({
            filter_map: {
              region: this.formValues.region,
              cloud_name: this.formValues.vendor,
            },
          });
          this.getImageIdOptions({
            filter_map: {
              region: this.formValues.region,
              cloud_name: this.formValues.vendor,
            },
          });
          this.getBindWidthPkgIdOptions({
            filter_map: {
              region: this.formValues.region,
              cloud_name: this.formValues.vendor,
            },
          });
        });
      } else {
        this.title = '创建资源模板字段页面';
        this.buy = false;
        this.formValues = DEFAULT_FORM_VALUES;
      }
    },
    formValues: {
      async handler() {
        if (!this.buy) return;
        this.onFormValiDate();
      },
      deep: true,
    },
    'buyValues.count': {
      async handler() {
        this.onFormValiDate();
      },
      deep: true,
    },
    insTypeParams: {
      async handler(val) {
        const { account_id, vendor, res_type, region, zone, instance_type } =
          val;
        if (
          !account_id ||
          !vendor ||
          !res_type ||
          !region ||
          !zone ||
          !instance_type
        )
          return;
        this.getInsTypeOptions();
      },
      deep: true,
    },
  },
  mounted() {
    this.specialSplit = getUniqueStr(3);
  },
  methods: {
    getInsTypeOptions: debounce(async function () {
      try {
        const { account_id, vendor, res_type, region, zone, instance_type } =
          this.formValues;
        const { data } = await getInsType({
          account_id,
          vendor,
          res_type,
          region,
          zone,
          instance_type,
        });
        this.formValues.cpu = data.cpu;
        this.formValues.memory = data.memory;
      } catch (err) {
        this.formValues.cpu = '';
        this.formValues.memory = '';
      }
    }, DEBOUNCE_INS_OPTIONS),

    getImageIdOptions: debounce(async function (params) {
      try {
        this.imageIdLoading = true;
        const { data } = await getImageIds(params);
        this.imageIdOptions = data.map((c) => ({
          label: `${c.instance_id} | ${c.name} | ${c.os_name}`,
          value: c.instance_id,
        }));
      } catch (err) {
        this.imageIdOptions = [];
      } finally {
        this.imageIdLoading = false;
      }
    }, DEBOUNCE_IMAGE_ID),

    getBindWidthPkgIdOptions: debounce(async function () {
      try {
        this.bindWidthIdLoading = true;
        const { account_id, vendor, res_type, region } = this.formValues;
        const { data } = await getBindWidthPkgIds({
          account_id,
          vendor,
          res_type,
          region,
        });
        this.bindWidthIdOptions = data.map((c) => ({
          label: `${c.id} | ${c.name}`,
          value: c.id,
        }));
      } catch (err) {
        this.bindWidthIdOptions = [];
      } finally {
        this.bindWidthIdLoading = false;
      }
    }, DEBOUNCE_BINDWIDTH_ID),

    tipFormat(val) {
      return val + 'Mbps';
    },
    onFormValiDate: debounce(async function () {
      try {
        await this.validateBeforGetPrice();
        const params = getParams(this.formValues, this);
        this.priceLoading = true;
        const { data } = await getPrice({
          count: this.buyValues.count,
          ...params,
        });
        this.price = data;
      } catch (err) {
        this.price = DEFAULT_PRICE;
      } finally {
        this.priceLoading = false;
      }
    }, 500),
    async validateBeforGetPrice() {
      const validate = await new Promise((resolve, reject) => {
        this.$refs.form.validate((v) => {
          if (v) {
            this.$refs.buyForm.validateField('count', (count) => {
              if (!count) {
                resolve();
              }
            });
          }
          reject(new Error('表单校验失败，请检查'));
        });
      });
      return validate;
    },
    async getSettings() {
      this.getVswitchData();
      this.getTagData();
    },
    async getVswitchData() {
      const { data } = await getVswitch();
      this.vswitchOptions = data.map((c) => ({
        ...c,
        label: `${c.instance_id} | ${c.name} | ${c.cidr_block_v4}`,
      }));
    },
    async getSecurityGroupData(params) {
      const { data } = await getSecurityGroup(params);
      this.securityGroupOptions = data.map((c) => ({
        ...c,
        label: `${c.instance_id} | ${c.security_group_name}`,
        value: `${c.instance_id}${this.specialSplit}${c.security_group_name}`,
      }));
    },
    async getTagData() {
      const { data } = await getTagList();

      this.tagKeyOptions = data.map((c) => ({
        label: c,
        value: c,
      }));
    },
    async handleSelectTag(tag) {
      const { data } = await getTagList({ tag_key: tag.value });

      this.$set(
        this.tagValueOptions,
        tag.value,
        data.map((c) => ({
          label: c,
          value: c,
        }))
      );
    },
    handleAddTag() {
      this.formValues.tagsValues.push({
        key: '',
        value: '',
      });
    },
    handleRemoveTag(index) {
      this.formValues.tagsValues = this.formValues.tagsValues.filter(
        (_, i) => i !== index
      );
    },
    handleInstanceChange(v) {
      const option = this.vswitchOptions.find((c) => c?.instance_id === v);
      if (!option) return;
      this.formValues = {
        ...this.formValues,
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
      };
      this.getSecurityGroupData({
        filter_map: {
          region: option.region,
          cloud_name: option.cloud_name,
        },
      });
      this.getImageIdOptions({
        filter_map: {
          region: option.region,
          cloud_name: option.cloud_name,
        },
      });
      this.getBindWidthPkgIdOptions({
        filter_map: {
          region: option.region,
          cloud_name: option.cloud_name,
        },
      });
    },
    async ok() {
      try {
        await new Promise((resolve, reject) => {
          this.$refs.form.validate((v) => {
            if (!v) {
              reject(new Error('表单校验失败，请检查'));
            }
          });
          if (this.buy) {
            this.$refs.buyForm.validate((v) => {
              if (!v) {
                reject(new Error('表单校验失败，请检查'));
              }
            });
          }
          resolve();
        });
        const params = getParams(this.formValues, this);
        const res = await (this.buy
          ? createOrder({
              instance_name: this.buyValues.name,
              count: this.buyValues.count,
              image_passwd: '',
              ...params,
            })
          : createOrderTemplate({
              ...params,
            }));
        if (!res) {
          throw new Error('请求错误，请重试');
        }
        this.$emit('addSuccessCallback');
        this.showModal = false;
        this.$Message.success(res.msg);
      } catch (err) {
        this.$Message.error(err.message);
        this.modalLoading = false;
      } finally {
        this.$nextTick(() => {
          this.modalLoading = true;
        });
      }
    },
    cancel() {
      this.$emit('closeAddModal');
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .ivu-modal-body {
  padding: 16px 16px 0 0;
}

.modal {
  &__content {
    padding-left: 16px;
    position: relative;
    max-height: calc(~'100vh - 300px');
    overflow-y: auto;
    &__section {
      border-width: 1px 0 0 0;
      border-color: #ccc;
      border-style: solid;
      &__title {
        margin: 12px 0;
      }
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
        &__special,
        &__tags {
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
        &__limit {
          width: 50%;
          &__special {
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
            &__slider {
              flex: 1;
            }
            &__input {
              flex-grow: 0;
              width: 160px;
              flex-shrink: 0;
            }
            &__unit {
              margin-left: 5px;
            }
            /deep/ .ivu-form-item {
              padding-right: 0px;
              .ivu-form-item-content {
                display: flex;
                margin-left: 12px !important;
                margin-right: 20px;
                .ivu-input-number {
                  width: 100%;
                }
                .ivu-slider {
                  flex: 1;
                }
              }
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
                margin-left: 12px;
                width: calc(~'50% - 62px');
                .ivu-form-item-content {
                  width: 100%;
                  margin-left: 0 !important;
                }
              }
              /deep/ .ivu-icon-md-close,
              .ivu-icon-md-add {
                margin-right: 10px;
                line-height: 32px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    &__buy {
      z-index: 1;
      padding-top: 12px;
      background-color: #fbfcfc;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: sticky;
      padding-left: 12px;
      margin-left: -16px;
      bottom: 0;
      border-top: 1px solid #e8eaec;
      -webkit-box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
      box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
      /deep/ .ivu-form-item {
        padding-right: 20px;
        // width: 50%;

        .ivu-form-item-label {
          padding: 10px 0;
          font-size: 12px;
          text-align: right;
        }
        .ivu-form-item-content {
          margin-left: 112px !important;
          width: 200px;
          .ivu-input-number {
            width: 100%;
          }
        }
      }
      &__price {
        height: 34px;
        margin-bottom: 24px;
        margin-right: 200px;
        display: flex;
        align-items: center;
        &__label {
          margin-right: 12px;
          text-decoration: underline dotted #999999;
        }
        &__value {
          color: #ba0018;
        }
        &__loading {
          animation: load 1.1s infinite linear;
        }
      }
    }
  }
  @keyframes load {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}

.popup {
  &__price {
    &__header {
      display: flex;
      padding-left: 10px;
      align-items: center;
      background-color: #f1f2f5;
      height: 50px;
      &__label {
        width: 80px;
        flex-shrink: 0;
      }
      &__value {
        font-weight: bold;
      }
    }
    &__item {
      display: flex;
      padding-left: 10px;
      padding-right: 20px;
      align-items: center;
      height: 70px;
      border-bottom: 1px solid #e2e6ed;
      &__label {
        width: 80px;
        flex-shrink: 0;
      }
      &__value {
        display: flex;
        align-items: center;
        &__final {
          font-weight: bold;
          margin-right: 10px;
          color: #ff7200;
          font-size: 16px;
        }
        &__discount {
          font-weight: bold;
          margin-right: 10px;
          height: 32px;
          line-height: 30px;
          padding: 0 10px;
          background-color: #ffe8d5;
          color: #ff7200;
          border: 1px solid #ff7200;
          border-radius: 50%;
        }
        &__original {
          font-size: 14px;
          text-decoration: line-through;
          color: #a5aebb;
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
