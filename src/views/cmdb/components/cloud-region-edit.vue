<template>
  <Card :bordered="false" dis-hover>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-colon='true' label-position="right"
          :label-width="200">
      <Row>
        <Col span="12" offset="4">
          <Divider>基础配置</Divider>
          <FormItem label="云区域名称" prop="name" v-if="formData.id">
            <Input v-model="formValidate.name" maxlength="50" type="text" disabled
                   placeholder="请输入规则名称..."></Input>
          </FormItem>
          <FormItem label="云区域名称" prop="name" v-else>
            <Input v-model="formValidate.name" maxlength="50" type="text" placeholder="请输入规则名称..."></Input>
          </FormItem>
          <FormItem label="云区域ID" prop="cloud_region_id">
            <Input v-model="formValidate.cloud_region_id" maxlength="10" type="text"
                   placeholder="云区域ID、代理ID..."></Input>
          </FormItem>
          <FormItem label="代理地址" prop="proxy_ip">
            <Input v-model="formValidate.proxy_ip" maxlength="100" type="text"
                   placeholder="连接代理节点IP地址或域名地址，一般为内网LB或者内网域名"></Input>
            <!--                  <Select v-model="formValidate.proxy_ips" filterable multiple suffix allow-create-->
            <!--                          placeholder="请输入代理节点IP地址或域名" @on-create="handleCreate">-->
            <!--                    <Option v-for="item in formValidate.proxy_ips" :key="item" :value="item">{{ item }}</Option>-->
            <!--                  </Select>-->
          </FormItem>
          <FormItem label="SSH" prop="ssh_user">
            <Row :gutter="6">
              <Col span="8">
                <Input v-model="formValidate.ssh_user" maxlength="25" type="text" placeholder="用户名...">
                  <span slot="prepend">ssh</span>
                </Input>
              </Col>
              <Col span="8">
                <Input v-model="formValidate.ssh_ip" maxlength="100" type="text" placeholder="主机/ip...">
                  <span slot="prepend">@</span>
                </Input>
              </Col>
              <Col span="8">
                <Input v-model="formValidate.ssh_port" maxlength="10" type="text" placeholder="端口...">
                  <span slot="prepend">-p</span>
                </Input>
              </Col>
            </Row>
          </FormItem>
          <template v-for="items, i in formValidate.asset_group_rules" class="alert-c">
            <FormItem label="关联主机"
                      v-if="formValidate.asset_group_rules && formValidate.asset_group_rules.length !== 0">
              <Alert show-icon v-if="i === 0" style="width: 100%; margin-bottom: 8px;">
                通过关联vpc把一组vpc下的主机资产划分到云区域，vpc之间的的条件关系为或。
              </Alert>
              <Row :gutter="20">
                <Col>
                  <Card v-if="items.length > 0" style="margin-bottom: 0px;" dis-hover>
                    <FormItem v-for="(item, index) in items" v-if="item.status" :key="index + _uid">
                      <div class="alert-con" style="margin-bottom: 10px;">
                            <span style="margin-right: 5px; min-width: 30px; display: inline-block;">
                                {{ index + 1 }} -
                            </span>
                        <Cascader :data="vpcOptions" v-model="item.query_value"
                                  style="width:700px;margin-left: 10px;"></Cascader>
                        <Button shape="circle" type="text" icon="md-add" class="rule-btn-add"
                                @click="handleAddRules(i)"></Button>
                        <Button v-if="items.length !== 1" shape="circle" type="text" icon="md-close"
                                class="rule-btn-del" @click="handleRemoveRules(i, index)"></Button>
                      </div>
                    </FormItem>
                  </Card>
                  <p v-if="formValidate.asset_group_rules.length > 1 && i != 2" style="padding-top: 15px">或</p>
                </Col>
                <Col span="2">
                  <a v-if="formValidate.asset_group_rules.length !== 1" @click.prevent="handleRemoveCard(i)"> 删除</a>
                </Col>
              </Row>
            </FormItem>
          </template>
          <!--          <Row>-->
          <!--          <Tooltip trigger="hover" placement="right-start" content="选择是会自动更新关联主机的云区域ID">-->
          <!-- <FormItem prop="auto_update_agent_id" style="width: 100%">
            <template #label>
              自动修改AgentID
              <Tooltip placement="top-start" max-width="400">
                <template #content>
                  <p>如果选择是：会自动把当前云区域ID通过VPC和主机关联，设置主机AgentID为主机IP:云区域ID</p>
                </template>
                <Icon type="ios-help-circle-outline" />
                :
              </Tooltip>
            </template>
            <RadioGroup v-model="formValidate.auto_update_agent_id">
              <Radio label="yes">是</Radio>
              <Radio label="no">否</Radio>
            </RadioGroup>
          </FormItem> -->
          <Divider dashed>堡垒机配置</Divider>
          <FormItem prop="jms_org_id">
            <template #label>
              组织ID
              <Tooltip placement="top-start" max-width="400">
                <template #content>
                  <p>关联堡垒机组织，社区版不支持组织管理，只有默认Default组织，企业版支持多组织管理</p>
                  <p>堡垒机查看组织ID方法：堡垒机资产管理-->网域列表-->点击网域查看ID</p>
                </template>
                <Icon type="ios-help-circle-outline" />
                :
              </Tooltip>
            </template>

            <Input v-model="formValidate.jms_org_id" maxlength="100" type="text"
                   placeholder="堡垒机组织ID..."></Input>
          </FormItem>

          <FormItem prop="jms_domain_id">
            <template #label>
              网域ID
              <Tooltip placement="top-start" max-width="400">
                <template #content>
                  <p>关联堡垒机网域，指定云区域下的主机属于哪个网域，理论上一个区域的主机归属于同一个网域</p>
                  <p>堡垒机查看网域ID方法：堡垒机资产管理-->网域列表-->点击网域查看ID</p>
                </template>
                <Icon type="ios-help-circle-outline" />
                :
              </Tooltip>
            </template>
            <Input v-model="formValidate.jms_domain_id" maxlength="100" type="text"
                   placeholder="堡垒机网域ID..."></Input>
          </FormItem>
          <FormItem label="" prop="jms_account_template">
            <template #label>
              特权账号模版ID
              <Tooltip placement="top-start" max-width="400">
                <template #content>
                  <p>关联堡垒机特权账户模板，创建主机时需指定特权账号，用户推送创建非特权账号到服务器</p>
                  <p>堡垒机特权账号模版ID方法：堡垒机账号管理-->账号模板-->点击特权账号查看ID</p>
                </template>
                <Icon type="ios-help-circle-outline" />
                :
              </Tooltip>
            </template>
            <Input v-model="formValidate.jms_account_template" maxlength="100" type="text"
                   placeholder="堡垒机特权账户模板ID..."></Input>
          </FormItem>
        </Col>
        <Col span="12" offset="4">
          <template v-for="(item, index) in formValidate.accounts">
            <FormItem v-if="item.status" :key="index" :label="'账户模板ID ' + (index + 1)"
                      :prop="'accounts.' + index + '.value'">
              <template #label>
                账户模板ID
                <Tooltip placement="top-start" max-width="400">
                  <template #content>
                    <p>关联堡垒机特权账户模板，需指定普通账号模板ID和特权账户模板ID，分别用于创建普通用户和特权账户, 如模板不存在则需在堡垒机创建并录入</p>
                    <p>查看堡垒机账号模版ID方法：堡垒机账号管理-->账号模板-->点击特权查看ID</p>
                  </template>
                  <Icon type="ios-help-circle-outline" />
                  :
                </Tooltip>
              </template>
              <Row>
                <Select v-model="item.account_type" placeholder="选择账户类型"
                        style="margin-right: 1px;margin-left: 1px; max-width: 100px">
                  <Option value="dev">普通账户</Option>
                  <Option value="ops">特权账户</Option>
                </Select>
                <Input style="max-width: 500px" v-model="item.jms_account_template_id"
                       placeholder="请输入待创建账号模板ID"></Input>
                <Icon v-on:click="handleRemove(index)" type="ios-backspace" style="margin-top: 8px; margin-left: 4px"/>
              </Row>
            </FormItem>
          </template>
          <FormItem>
            <Row>
              <Col span="12">
                <Tooltip trigger="hover" placement="top-start" content="只允许添加两个不同类型的账户">
                  <Button type="dashed" long @click="handleAdd(account_type)" icon="md-add">添加账户</Button>
                </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col span="12" offset="4">
          <FormItem label="网域密钥">
            <Input v-model="formValidate.ssh_key" type="textarea" maxlength="65500"
                   :autosize="{minRows: 6,maxRows: 15}"
                   placeholder="当前云区域网域私钥..." />
          </FormItem>
        </Col>
        <Col span="12" offset="4">
          <FormItem label="网域公钥">
            <Input v-model="formValidate.ssh_pub_key" type="textarea" maxlength="65500"
                   :autosize="{minRows: 3,maxRows: 15}" placeholder="当前云区域网域公钥..." />
          </FormItem>
        </Col>

        <Col span="12" offset="4">
          <FormItem label="备注信息">
            <Input v-model="formValidate.detail" type="textarea" maxlength="65500" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="备注信息..." />
          </FormItem>
        </Col>
        <Col span="12" offset="4">
          <FormItem>
            <Button type="primary" :loading="btnLoading" @click="handleSubmit('formValidate')">确定</Button>
            <Button @click="handleCancel" style="margin-left: 15px">返回</Button>
          </FormItem>

        </Col>
      </Row>
    </Form>

  </Card>
</template>
<script>
import { getCloudSettinglist } from '@/api/cmdb';
import { getVPC } from '@/api/cloud/vpc.js';

export default {
  components: {},
  name: 'cloudRegionEdit',
  props: {
    formData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      btnLoading: false,
      cloudList: [],
      index: 1,
      vpcList: [],
      vpcOptions: [],
      vendorMap: {},
      account_type: 'dev',
      ruleValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        cloud_region_id: [{ required: true, message: '不能为空', trigger: 'blur' }],
        ssh_user: [{ required: true, message: '不能为空', trigger: 'blur' }],
        proxy_ip: [{ required: true, message: '不能为空', trigger: 'blur' }],
        detail: [{ type: 'string', max: 300, message: '备注也不能太长吧', trigger: 'blur' }],
        // auto_update_agent_id: [{ type: 'string', max: 10, message: '不能为空', trigger: 'blur', required: true }],
        asset_group_rules: [{ type: 'array', max: 10, message: '不能为空', trigger: 'blur', required: true }],
        jms_domain_id: [{ message: '不能为空', trigger: 'blur', required: true, max: 100 }],
        jms_account_template: [{ message: '不能为空', trigger: 'blur', required: true, max: 100 }],
        jms_org_id: [{ required: true, message: '组织ID为空', trigger: 'blur', max: 100 }]
      }
    };
  },
  filters: {
    testF(value, location) {
      if (location === 1) {
        return '资产 B';
      } else if (location === 2) {
        return '资产 C';
      } else if (location === 0) {
        return '资产 A';
      }
    }
  },
  methods: {
    // 添加条件
    handleAdd() {
      this.index++;
      if (this.index > 2) {
        this.$Notice.warning({
          title: '条件超出最大限制'
        });
        this.index--;
        return;
      }
      // 条件默认配置
      this.formValidate.accounts.push({
        account_type: 'dev',
        jms_account_template_id: '',
        index: this.index,
        status: 1
      });
    },
    // 移除条件
    handleRemove(index) {
      this.index--;
      this.formValidate.accounts.splice(index, 1);
    },

    transformData(data) {
      data.forEach(item => {
        if (!item.cloud_zh_name) {
          return;
        }
        if (!this.vendorMap[item.cloud_zh_name]) {
          this.vendorMap[item.cloud_zh_name] = {};
        }
        if (!this.vendorMap[item.cloud_zh_name][item.region]) {
          this.vendorMap[item.cloud_zh_name][item.region] = [];
        }
        this.vendorMap[item.cloud_zh_name][item.region].push({
          label: item.vpc_name,
          value: item.instance_id
        });
      });

      return Object.keys(this.vendorMap).map(vendor => ({
        label: vendor,
        value: vendor,
        children: Object.keys(this.vendorMap[vendor]).map(region => ({
          label: region,
          value: region,
          children: this.vendorMap[vendor][region]
        }))
      }));
    },

    async getCloudSettingList() {
      const res = await getCloudSettinglist();
      if (res.code === 0) {
        this.cloudList = res.data;
      } else {
        this.$message.error(`${res.msg}`);
      }
    },
    getVpcCloudName(accountID) {
      const cloud = this.cloudList.find(vpc => vpc.account_id === accountID);
      return cloud ? cloud.name : '';
    },
    getVpcRegion(vpcName) {
      const vpc = this.vpcList.find(vpc => vpc.vpc_name === vpcName);
      return vpc ? vpc.region : '';
    },
    async getVpcList() {
      const params = {
        page_number: 1,
        page_size: 300
      };
      const res = await getVPC(params);
      if (res.code === 0) {
        this.vpcList = res.data;
        for (const vpc of this.vpcList) {
          if (vpc.cidr_block_v4) {
            vpc.vpc_name = vpc.vpc_name + '(' + vpc.cidr_block_v4 + ')';
          }
          vpc.cloud_zh_name = this.getVpcCloudName(vpc.account_id);
        }
        // 转换成级联选择器的数据格式
        this.vpcOptions = this.transformData(this.vpcList);
      } else {
        this.$message.error(`${res.msg}`);
      }
    },
    handleAddRules(i) {
      this.index++;
      if (this.formValidate.asset_group_rules[i].length > 14) {
        this.$Notice.warning({
          title: '限制提示',
          desc: '添加指标的个数不能超过十五个',
          duration: 10
        });
        return;
      }
      this.formValidate.asset_group_rules[i].push({
        index: this.index,
        query_name: 'vpc',
        query_conditions: '=', //条件 like = !=
        query_value: [], //值
        status: 1
      });
    },
    handleRemoveRules(i, index) {
      this.formValidate.asset_group_rules[i].splice(index, 1);
    },
    handleRemoveCard(i) {
      this.formValidate.asset_group_rules.splice(i, 1);
    },
    handleCancel() {
      if (JSON.stringify(this.formValidate) != JSON.stringify(this.formData)) {
        this.$Modal.confirm({
          content: `<p>编辑还没有保存，确定要离开？</p>`,
          onOk: () => {
            this.$emit('edit-close');
          },
          onCancel: () => {
            this.$Message.info('回头是岸');
          }
        });
      } else {
        this.$emit('edit-close');
      }
    },

    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const accountTypes = new Set();
          let duplicateFound = false;
          if (this.formValidate.accounts) {
            for (const account of this.formValidate.accounts) {
              if (account.status === 1 && (account.jms_account_template_id === '' || !account.jms_account_template_id)) {
                this.$Notice.warning({ title: '账号模板ID存在空值！' });
                return;
              }
              if (accountTypes.has(account.account_type)) {
                duplicateFound = true;
                break;
              }
              accountTypes.add(account.account_type);
            }
          }
          if (duplicateFound) {
            this.$Notice.warning({
              title: '账号类型重复，请检查！'
            });
            return;
          }
          if (this.formValidate.asset_group_rules) {
            for (const rules of this.formValidate.asset_group_rules) {
              for (const rule of rules) {
                if (rule.status === 1 && (Array.isArray(rule.query_value) && rule.query_value.length < 2)) {
                  this.$Notice.warning({ title: '查询条件存在空值！' });
                  return;
                }
                // vpc_id不能为空
                if (!rule.query_value[rule.query_value.length - 1]) {
                  this.$Notice.warning({ title: 'VPC存在空值！' });
                  return;
                }
              }
            }
          }
          this.btnLoading = true;
          this.formValidate.name = this.formValidate.name.trim();
          setTimeout(() => {
            this.$emit('save-data', this.formValidate);
            this.btnLoading = false;
          }, 1000);
        } else {
          this.$Message.error('表单校验不通过!');
        }
      });
    }


  },
  watch: {
    formValidate(value) {
    }
  },
  computed: {
    formValidate: function() {
      return this.formData;
    }
  },
  //
  mounted() {
    this.getCloudSettingList();
    this.getVpcList();
  }
};
</script>

<style scoped>
.alert-con {
  display: flex;
  align-items: center;
}
.rule-btn-add,
.rule-btn-del {
  margin-left: 10px; /* 根据需要调整间距 */
}
</style>