<template>
  <Drawer
    v-model="showDrawer"
    :title="templateInfo.name"
    width="1000"
    @on-close="onClose"
  >
    <div class="drawer__content">
      <div class="drawer__content__section">
        <div class="drawer__content__section__header">
          <div class="drawer__content__section__header__title">基本信息</div>
          <div
            v-if="!editBasicInfo"
            class="drawer__content__section__header__icon"
            @click="editBasicInfo = true"
          >
            <Icon type="md-create" /><span
              class="drawer__content__section__header__icon__text"
              >编辑</span
            >
          </div>
        </div>
        <div v-if="!editBasicInfo" class="drawer__content__section__info">
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">
              模板名称
            </div>
            <div class="drawer__content__section__info__line__value">
              {{ templateInfo.name }}
            </div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">
              模板类型
            </div>
            <div class="drawer__content__section__info__line__value">
              {{ templateInfo.resTypeRender }}
            </div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">
              私有子网
            </div>
            <div class="drawer__content__section__info__line__value">
              {{ templateInfo.subnet_name }}
            </div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">
              私有网络
            </div>
            <div class="drawer__content__section__info__line__value">
              {{ templateInfo.vpc_name }}
            </div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">
              云区域
            </div>
            <div class="drawer__content__section__info__line__value">
              {{ templateInfo.cloud_region_id }}
            </div>
          </div>
          <div class="drawer__content__section__info__line">
            <div class="drawer__content__section__info__line__label">
              云厂商
            </div>
            <div class="drawer__content__section__info__line__value">
              {{ templateInfo.cloundAccountRender }}
            </div>
          </div>
        </div>
        <div v-else class="drawer__content__section__form">
          <Form
            ref="basicForm"
            :model="templateInfo"
            :label-width="100"
            :rules="formRules"
          >
            <div class="modal__content__section__form">
              <div class="modal__content__section__form__custom">
                <FormItem prop="name" label="模板名称">
                  <Input
                    v-model="templateInfo.name"
                    type="text"
                    placeholder="请输入模板名称"
                  />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="res_type" label="模板类型">
                  <Select
                    v-model="templateInfo.res_type"
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
                    v-model="templateInfo.subnet_id"
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
                  <Input v-model="templateInfo.vpc_name" type="text" disabled />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="cloud_region_id" label="云区域">
                  <Input
                    v-model="templateInfo.cloud_region_id"
                    type="text"
                    placeholder=""
                  />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="cloundAccountRender" label="云厂商">
                  <Input
                    v-model="templateInfo.cloundAccountRender"
                    type="text"
                    disabled
                    placeholder=""
                  />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="region" label="地域">
                  <Input
                    v-model="templateInfo.region"
                    type="text"
                    disabled
                    placeholder=""
                  />
                </FormItem>
              </div>
              <div class="modal__content__section__form__select">
                <FormItem prop="zone" label="可用区">
                  <Input
                    v-model="templateInfo.zone"
                    type="text"
                    placeholder=""
                  />
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div style="margin-top: 1em;"></div>
      <div class="modal__content__section__form__longer">
        <div class="drawer__content__section">
          <div class="drawer__content__section__header">
            <div class="drawer__content__section__header__title">TF配置</div>
            <div
              v-if="!editModelInfo"
              class="drawer__content__section__header__icon"
              @click="handleEditModelInfo"
            >
              <Icon type="md-create" /><span
                class="drawer__content__section__header__icon__text"
                >编辑</span
              >
            </div>
          </div>
          <div v-if="!editModelInfo" class="drawer__content__section__info">
            <div class="modal__content__section__form__longer">
              <codo-editor
                v-model="templateInfo.content"
                :lang="script_type"
                :read="read"
                :key="`${_uid}`"
              />
            </div>
          </div>
          <div v-else class="drawer__content__section__form">
            <Form
              ref="resTypeForm"
              :model="templateInfo"
              :label-width="100"
              :rules="formRules"
            >
              <div class="modal__content__section__form">
                <div class="modal__content__section__form__longer">
                  <codo-editor
                    v-model="templateInfo.content"
                    :lang="script_type"
                    :read="read"
                    :key="`${_uid}`"
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
        </div>
        <div style="margin-top: 1em;"></div>
        <div class="drawer__content__section">
          <div class="drawer__content__section__header">
            <div class="drawer__content__section__header__title">其他设置</div>
            <div
              v-if="!editOtherInfo"
              class="drawer__content__section__header__icon"
              @click="editOtherInfo = true"
            >
              <Icon type="md-create" /><span
                class="drawer__content__section__header__icon__text"
                >编辑</span
              >
            </div>
          </div>
          <div v-if="!editOtherInfo" class="drawer__content__section__info">
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">
                标签
              </div>
              <div class="drawer__content__section__info__line__value">
                {{ templateInfo.renderTags }}
              </div>
            </div>
            <div class="drawer__content__section__info__line">
              <div class="drawer__content__section__info__line__label">
                备注
              </div>
              <div class="drawer__content__section__info__line__value">
                {{ templateInfo.description }}
              </div>
            </div>
          </div>
          <div v-else>
            <Form
              ref="otherForm"
              :model="templateInfo"
              :label-width="100"
              :rules="formRules"
            >
              <div class="modal__content__section__form">
                <div class="modal__content__section__form__tags">
                  <div class="modal__content__section__form__tags__label">
                    标签
                  </div>
                  <div class="modal__content__section__form__tags__content">
                    <div
                      v-for="(item, index) in templateInfo.tagsValues"
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
                        v-if="index === templateInfo.tagsValues.length - 1"
                        size="20"
                        type="md-add"
                        @click="handleAddTag"
                      />
                      <Icon
                        v-if="templateInfo.tagsValues.length > 1"
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
                      v-model="templateInfo.description"
                      type="textarea"
                      placeholder="请输入备注"
                    />
                  </FormItem>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="editBasicInfo || editModelInfo || editOtherInfo"
      class="drawer__footer"
    >
      <Button type="primary" @click="handleUpdate">确认修改</Button>
    </div>
  </Drawer>
</template>
<!-- eslint-disable camelcase -->

<script>
import { debounce } from 'lodash';

import {
  modifyOrderTemplate,
  getTagList,
  getInsType,
} from '@/api/cmdb';

import { getVswitch } from '@/api/cloud/vswitch';

import { getFeFormInfo, getUniqueStr, getParams } from '../utils';
import codoEditor from '@/components/editor/editor-v3';

import {
  resTypeOptions,
  dataDiskTypeOptions,
  systemDiskTypeOptions,
  instanceChargeTypeOptions,
  internetChargeTypeOptions,
} from '../options';

// 实例配置查询间隔ms
const DEBOUNCE_INS_OPTIONS = 1000;

export default {
  components: { codoEditor },
  name: 'EditTemplate',
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
      script_type: 'sh',
      read: true,
      imageIdOptions: [],
      imageIdLoading: false,
      specialSplit: '',
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
        renderTags: '',
        vpc_id: '',
        vpc_name: '',
        content: '',
      },
      formRules: {
        name: [{ required: true, message: '模板名称必填', trigger: 'blur' }],
        res_type: [
          { required: true, message: '模板类型必选', trigger: 'blur' },
        ],
        subnet_id: [
          { required: true, message: '私有子网必选', trigger: 'change' },
        ],
        // cloud_region_id: [
        //   { required: true, message: '云区域不能为空', trigger: 'blur' },
        // ],
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
      showDrawer: false,
    };
  },
  computed: {
    insTypeParams() {
      const {
        account_id,
        vendor,
        res_type,
        region,
        zone,
        instance_type,
        content,
      } = this.templateInfo;
      return {
        account_id,
        vendor,
        res_type,
        region,
        zone,
        instance_type,
        isEdit: this.editModelInfo,
        content,
      };
    },
  },
  watch: {
    show(v) {
      if (v) {
        this.getSettings();
      }
      this.showDrawer = v;
    },
    row(v) {
      this.editBasicInfo = false;
      this.editModelInfo = false;
      this.editOtherInfo = false;
      this.templateInfo = getFeFormInfo(v, this);
    },
    insTypeParams: {
      async handler(val) {
        const {
          account_id,
          vendor,
          res_type,
          region,
          zone,
          instance_type,
          isEdit,
        } = val;
        if (
          !account_id ||
          !vendor ||
          !res_type ||
          !region ||
          !zone ||
          !instance_type ||
          !isEdit
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
    handleEditModelInfo() {
      this.editModelInfo = true;
      this.read = false;
    },
    getInsTypeOptions: debounce(async function () {
      try {
        const { account_id, vendor, res_type, region, zone, instance_type } =
          this.templateInfo;
        const { data } = await getInsType({
          account_id,
          vendor,
          res_type,
          region,
          zone,
          instance_type,
        });
        this.templateInfo.cpu = data.cpu;
        this.templateInfo.memory = data.memory;
      } catch (err) {
        this.templateInfo.cpu = '';
        this.templateInfo.memory = '';
      }
    }, DEBOUNCE_INS_OPTIONS),
    // getImageIdOptions: debounce(async function (params) {
    //   try {
    //     this.imageIdLoading = true;
    //     const { data } = await getImageIds(params);
    //     this.imageIdOptions = data.map((c) => ({
    //       label: `${c.instance_id} | ${c.name} | ${c.os_name}`,
    //       value: c.instance_id,
    //     }));
    //   } catch (err) {
    //     this.imageIdOptions = [];
    //   } finally {
    //     this.imageIdLoading = false;
    //   }
    // }, DEBOUNCE_IMAGE_ID),
    // tipFormat(val) {
    //   return val + 'Mbps';
    // },
    async handleUpdate() {
      try {
        const basicCheck = new Promise((resolve, reject) => {
          if (!this.editBasicInfo) {
            resolve();
          } else {
            this.$refs.basicForm.validate((v) => {
              if (!v) {
                reject(new Error('表单校验失败，请检查'));
              }
              resolve();
            });
          }
        });
        const resTypeCheck = new Promise((resolve, reject) => {
          if (!this.editModelInfo) {
            resolve();
          } else {
            this.$refs.resTypeForm.validate((v) => {
              if (!v) {
                reject(new Error('表单校验失败，请检查'));
              }
              resolve();
            });
          }
        });
        const otherCheck = new Promise((resolve, reject) => {
          if (!this.editOtherInfo) {
            resolve();
          } else {
            this.$refs.otherForm.validate((v) => {
              if (!v) {
                reject(new Error('表单校验失败，请检查'));
              }
              resolve();
            });
          }
        });
        await Promise.all([basicCheck, resTypeCheck, otherCheck]);
        const params = getParams(this.templateInfo, this);
        const res = await modifyOrderTemplate({
          id: this.templateInfo.id,
          ...params,
          description: params.description || '',
        });
        if (!res) {
          throw new Error('请求错误，请重试');
        }
        this.$emit('editSuccessCallback');
        this.showDrawer = false;
        this.$Message.success(res.msg);
      } catch (error) {
        console.log(error);
        this.$Message.error(error.message);
      }
    },
    handleInstanceChange(v) {
      const option = this.vswitchOptions.find((c) => c.instance_id === v);
      this.templateInfo = {
        ...this.templateInfo,
        subnet_name: `${option.instance_id} | ${option.name} | ${option.cidr_block_v4}`,
        vendor: option.cloud_name,
        account_id: option.account_id,
        cloundAccountRender: `${option.account_id} | ${option.cloud_name}`,
        vpc_id: option.vpc_id.replace(/[\r\n]/g, ''),
        vpc_name: `${option.vpc_id} | ${option.vpc_name}`,
        cloud_region_id: option.cloud_region_id,
        cloudRender: `${option.cloud_region_id}`,
        region: option.region,
        zone: option.zone,
      };
      // this.getSecurityGroupData({
      //   filter_map: {
      //     region: option.region,
      //     cloud_name: option.cloud_name,
      //   },
      // });
      // this.getImageIdOptions({
      //   filter_map: {
      //     region: option.region,
      //     cloud_name: option.cloud_name,
      //   },
      // });
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
      this.templateInfo.tagsValues.push({
        key: '',
        value: '',
      });
    },
    handleRemoveTag(index) {
      this.templateInfo.tagsValues = this.templateInfo.tagsValues.filter(
        (_, i) => i !== index
      );
    },
    onClose() {
      this.showDrawer = false;
      this.$emit('closeDrawer');
    },
  },
};
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
          color: #789efd;
          &__text {
            margin-left: 5px;
          }
        }
      }
      &__info {
        border-width: 1px 1px 0 1px;
        border-color: #f1f1f1;
        border-style: solid;
        &__line {
          display: flex;
          line-height: 32px;
          border-bottom: #f1f1f1 1px solid;
          box-sizing: border-box;
          &__label {
            display: flex;
            align-items: center;
            padding-left: 16px;
            width: 160px;
            flex-shrink: 0;
            font-size: 14px;
            background-color: #fafafa;
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
