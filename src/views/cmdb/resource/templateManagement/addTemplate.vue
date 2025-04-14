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
                <Input v-model="formValues.zone" type="text" placeholder="" />
              </FormItem>
            </div>
          </div>
          <div class="modal__content__section">
            <div class="modal__content__section__title">TF配置</div>
            <div class="modal__content__section__form__longer">
              <FormItem prop="content">
                <codo-editor
                  v-model="formValues.content"
                  :lang="formValues.script_type"
                  :read="read"
                  :key="`${_uid}`"
                />
              </FormItem>
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
      </div>
    </div>
  </Modal>
</template>
<!-- eslint-disable camelcase -->
<script>
import {
  createOrderTemplate,
  getTagList,
  createOrder,
} from '@/api/cmdb';

import { getVswitch } from '@/api/cloud/vswitch';

import { getUniqueStr, getParams } from '../utils';
import codoEditor from '@/components/editor/editor-v3';

import {
  resTypeOptions,
  dataDiskTypeOptions,
  systemDiskTypeOptions,
  instanceChargeTypeOptions,
  internetChargeTypeOptions,
} from '../options';

const DEFAULT_FORM_VALUES = {
  script_type: 'python',
  content: '',
  cloud_region_id: '',
  cloud_region_name: '',
  account_id: '',
  name: '',
  res_type: '',
  vendor: '',
  region: '',
  zone: '',
  tags: {},
  tagsValues: [
    {
      key: '',
      value: '',
    },
  ],
};

const DEFAULT_PRICE = {
  bandwidth_dis_count: 100,
  bandwidth_dis_count_price: 0,
  bandwidth_original_price: 0,
  dis_count: 100,
  dis_count_price: 0,
  original_price: 0,
};

export default {
  components: { codoEditor },
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
      lang: 'text',
      read: false,
      // 镜像远程搜索
      imageIdOptions: [],
      imageIdLoading: false,
      // 镜像远程搜索
      bindWidthIdOptions: [],
      bindWidthIdLoading: false,
      title: '创建模板',
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

      formValues: DEFAULT_FORM_VALUES,
      formRules: {
        name: [{ required: true, message: '模板名称必填', trigger: 'blur' }],
        res_type: [
          { required: true, message: '模板类型必选', trigger: 'blur' },
        ],
        subnet_id: [
          { required: true, message: '私有子网必选', trigger: 'blur' },
        ],
        cloundAccountRender: [
          { required: true, message: '云厂商不能为空', trigger: 'blur' },
        ],
        vpc_name: [
          { required: true, message: '私有网络不能为空', trigger: 'blur' },
        ],
        region: [{ required: true, message: '地域不能为空', trigger: 'blur' }],
        zone: [{ required: true, message: '可用区不能为空', trigger: 'blur' }],
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
      const {
        account_id,
        vendor,
        res_type,
        region,
        zone,
        instance_type,
        content,
      } = this.formValues;
      return {
        account_id,
        vendor,
        res_type,
        region,
        zone,
        instance_type,
        content,
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
        vpc_id: option.vpc_id.replace(/[\r\n]/g, ''),
        vpc_name: `${option.vpc_id} | ${option.vpc_name}`,
        cloud_region_id: option.cloud_region_id || '',
        cloudRender: `${option.cloud_region_id}`,
        region: option.region,
        zone: option.zone,
      };
    },
    async ok() {
      this.modalLoading = false;
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
