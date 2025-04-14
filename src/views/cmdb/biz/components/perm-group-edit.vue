<template>
  <div>
    <Drawer
      :title="modalData.title"
      v-model="modalData.show"
      width="800"
      draggable
      :mask-closable="false"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="90"
        style="width: 750px"
      >
        <FormItem
          label="分组名称"
          prop="perm_group_name"
          style="padding-top: 10px"
        >
          <Input
            v-model="formValidate.perm_group_name"
            :maxlength="50"
            placeholder="请输入分组名称"
          ></Input>
        </FormItem>
        <template>
          <Row :gutter="5">
            <FormItem>
              <Alert type="success" show-icon closable>
                根据业务拓扑信息创建动态分组
                <template slot="desc">
                  <p>
                    下列条件的关系为且
                    业务为必填项，集群和模块为可以输入多个，以半角逗号或者空格来分隔。
                  </p>
                  <p>当前类型查询条件不支持通配符，全部为精确查询。</p>
                </template>
              </Alert>
            </FormItem>
            <Col span="12">
              <FormItem label="选择业务" prop="biz_id">
                <Select
                  v-model="formValidate.biz_id"
                  filterable
                  placeholder="请选择业务..."
                  @on-select="handleChangeBiz"
                >
                  <Option
                    v-for="item in bizList"
                    :key="item.biz_id"
                    :value="item.biz_id"
                    :label="item.biz_cn_name"
                  />
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="" prop="env_name">
                <Select
                  v-model="formValidate.env_name"
                  filterable
                  placeholder="请选择环境.."
                >
                  <Option
                    v-for="item in envList"
                    :value="item"
                    :key="item"
                    :label="item"
                  ></Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="集群名称" prop="region_name">
                <Input
                  v-model="formValidate.region_name"
                  :maxlength="500"
                  placeholder="输入集群、区服名称，多个以半角逗号或者空格区分"
                ></Input>
              </FormItem>
            </Col>
            <!-- <Col span="24">
              <FormItem label="集群名称" prop="region_name">
                <Select
                  v-model="formValidate.region_name"
                  filterable
                  multiple
                  placeholder="请选择集群..."
                >
                  <Option
                    v-for="item in regionList"
                    :key="item.id"
                    :value="item.value"
                    :label="item.value"
                  />
                </Select>
              </FormItem>
            </Col> -->
            <Col span="24">
              <FormItem label="模块名称" prop="module_name">
                <Input
                  v-model="formValidate.module_name"
                  :maxlength="500"
                  placeholder="输入模块、服务名称，多个以半角逗号或者空格区分"
                ></Input>
              </FormItem>
            </Col>
          </Row>
        </template>

        <FormItem label="堡垒机组织" prop="jms_org_id">
          <Select
            v-model="formValidate.jms_org_id"
            filterable
            placeholder="请选择组织"
          >
            <Option
              v-for="item in jmsOrgs"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </Select>
        </FormItem>

        <Col span="24">
          <FormItem label="权限开始时间" prop="perm_start_time">
          <Row>
              <DatePicker type="datetime" placeholder="开始时间" v-model="formValidate.perm_start_time"
                          format="yyyy-MM-dd HH:mm:ss" style="width: 700px" @on-change="handleStartDateChange"></DatePicker>
          </Row>
          </FormItem>
        </Col>
      <template>
        <Col span="24">
          <FormItem label="权限结束时间" prop="perm_end_time">
            <Row>
                <DatePicker type="datetime" placeholder="结束时间" v-model="formValidate.perm_end_time"
                            format="yyyy-MM-dd HH:mm:ss" style="width: 700px" @on-change="handleEndDateChange"></DatePicker>
            </Row>
          </FormItem>
        </Col>

        <FormItem label="用户组" prop="user_group">
          <Select
            v-model="formValidate.user_group"
            filterable
            placeholder="请选择用户组"
            multiple
          >
            <Option
              v-for="item in roleList"
              :key="item.id"
              :value="item.role_name"
              :label="item.role_name"
            />
          </Select>
        </FormItem>
  </template>

        <FormItem label="账号类型" prop="perm_type">
          <RadioGroup v-model="formValidate.perm_type">
            <Radio label="dev">普通用户</Radio>
            <Radio label="ops">特权用户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="备注信息" prop="perm_group_detail">
          <Input
            v-model="formValidate.perm_group_detail"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <div class="drawer-footer">
          <Button
            style="margin-right: 8px"
            @click="handleCancel('formValidate')"
            >取消</Button
          >
          <Button type="primary" @click="handleSubmit('formValidate')"
            >提交</Button
          >
        </div>
      </Form>
    </Drawer>
  </div>
</template>

<script>
import { getBizEnv } from '@/api/service-tree';
import { getRoleInfoList, getJMSOrgList } from '@/api/cmdb';

export default {
  name: 'permGroupEdit',
  props: {
    modalData: {
      type: Object,
      default: {},
    },
    bizList: {
      type: Object | Array,
      default: [],
    },
  },
  data() {
    return {
      index: 1,
      btnLoading: false,
      envList: [],
      roleList: [],
      regionList: [],
      jmsOrgs: [],
      jmssAccounts: [],
      formValidate: {
        user_group: [],
        biz_id: null,
        // env_name: null,
        // perm_group_name: '',
        // perm_group_type: '',
      },
      ruleValidate: {
        perm_group_name: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' },
        ],
        perm_type: [
          { required: true, message: '请选择角色类型', trigger: 'blur' },
        ],
        jms_org_id: [
          {required: true, message: '请选择堡垒机组织', trigger: 'blur'}
        ],
        perm_start_time: [
          {required: true, message: '请选择堡垒机授权开始时间', trigger: 'blur'}
        ],
        perm_end_time: [
          {required: true, message: '请选择堡垒机授权结束时间', trigger: 'blur'},
          { validator: this.validateEndTime, trigger: 'blur' }
        ],
        user_group: [
          {
            required: true,
            message: '请选择用户组',
            trigger: 'blur',
            type: 'array',
          },
        ],
      },
    };
  },
  watch: {
    'formValidate.biz_id': {
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          this.handleGetEnv();
        }
      },
      // immediate: true,
      deep: true,
    },
    //   'formValidate.env_name': {
    //     handler(newValue, oldValue) {
    //       if (newValue && newValue !== oldValue) {
    //         this.handleGetSet();
    //       }
    //     },
    //     immediate: true,
    //     deep: true,
    //   },
  },
  methods: {
    validateEndTime(rule, value, callback) {
      if (this.formValidate.perm_end_time && this.formValidate.perm_start_time
        && new Date(this.formValidate.perm_end_time) <= new Date(this.formValidate.perm_start_time)) {
        callback(new Error('结束时间必须大于开始时间'));
      }else {
        callback()
      }
    },

    handleStartDateChange(date) {
      this.formValidate.perm_start_time = this.formatDate(date);
    },
    handleEndDateChange(date) {
      this.formValidate.perm_end_time = this.formatDate(date);
    },

    formatDate(date) {
      if (!date) return '';
      if (!(date instanceof Date)) {
        return date;
      }
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    async handleGetEnv() {
      const res = await getBizEnv({ biz_id: this.formValidate.biz_id });
      if (res.code === 0) {
        this.envList = res.data.env_list;
      } else {
        this.$Message.error(res.msg);
      }
    },
    handleCancel(name) {
      this.$refs[name].resetFields();
      this.$emit('drawer-close');
    },
    handleRoleInfoList() {
      getRoleInfoList().then((res) => {
        if (res.code === 0) {
          this.roleList = res.data;
        } else {
          this.$Message.error(`${res.msg}`);
        }
      });
    },
    handleJmsOrgList() {
      getJMSOrgList().then((res) => {
        if (res.code === 0) {
          this.jmsOrgs = res.data;
        } else {
          this.$Message.error(`${res.msg}`);
        }
      });
    },
    handleChange() {
      this.formValidate.biz_id = null;
      this.formValidate.env_name = null;
    },
    handleChangeBiz() {
      this.formValidate.env_name = null;
      this.regionList = [];
      this.envList = [];
      this.formValidate.region_name = null;
    },
    async handleSubmit(name) {
      this.formValidate.perm_start_time = this.formatDate(this.formValidate.perm_start_time)
      this.formValidate.perm_end_time = this.formatDate(this.formValidate.perm_end_time)
      // 表单验证
      const valid = await this.$refs[name].validate();
      if (!valid) {
        this.$Notice.error({ title: '表单验证失败' });
        return;
      }

      // 验证条件
      setTimeout(() => {
        this.$emit('save-data', this.formValidate, this.modalData.action);
      }, 200);
    },
  },
  //
  mounted() {
    this.handleRoleInfoList();
    this.handleJmsOrgList()
  },
  //
};
</script>
<style>
.drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
