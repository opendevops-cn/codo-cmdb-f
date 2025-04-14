<template>
  <div>
    <Alert show-icon>
      多云配置管理
      <Icon slot="icon" type="ios-bulb-outline" />
      <span slot="desc">通过这里配置云账户AccessID\AccessKey信息可以自动发现资产信息。<a @click="handCreate()">开始配置</a>
      </span>
    </Alert>
    <Row :gutter="12">
      <Spin v-if="spinShow" size="large" fix>
        <Icon type="ios-loading" size="18" class="spin-icon-load" />
        <div>资产导入中,请稍等一会...</div>
      </Spin>
      <i-col v-for="(item, index) in cloud_list" :key="index" :xxl="6" :lg="8" :md="12">
        <Card style="margin: 10px 2px 5px; text-align: center" dis-hover :bordered="false">
          <p slot="title" align="center">
            <template v-if="`${item.cloud_name}` === 'aliyun'">
              <img style="width: 65px" src="./logo/aliyun.png">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'qcloud'">
              <img style="width: 65px" src="./logo/qcloud.png">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'aws'">
              <img style="width: 65px" src="./logo/aws.png">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'volc'">
              <img style="width: 69px" src="./logo/volc.jpg">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'ucloud'">
              <img style="width: 65px" src="./logo/ucloud.png">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'cds'"> 
              <img style="width: 65px" src="./logo/cds.jpg">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'vmware'"> 
              <img style="width: 65px" src="./logo/vmware.jpg">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'huaweicloud'">
              <img style="width: 65px" src="./logo/huawei.png">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'gcp'">
              <img style="width: 65px" src="./logo/gcp.png">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'dnspod'">
              <img style="width: 65px" src="./logo/qcloud.png">
            </template>
            <template v-else-if="`${item.cloud_name}` === 'pve'">
              <img style="width: 40px" src="./logo/pve.png">
            </template>
          </p>
          <p align="center">{{ item.name }}</p>
          <p v-if="`${item.is_enable}` === 'true'" align="center">
            自动发现状态：<font color="green">启用</font>
          </p>
          <p v-else-if="`${item.is_enable}` === 'false'">
            自动发现状态：<font color="red">禁用</font>
          </p>
          <p v-else>
            自动发现状态：<font color="red">未知</font>
          </p>
          <p align="center">最后修改时间：{{ item.update_time }}</p>

          <ButtonGroup>
            <Tooltip content="编辑配置" placement="bottom">
              <Button style="margin: 3px" type="primary" @click="handlerEdit(item)">编辑</Button>
            </Tooltip>
            <Tooltip content="可以查看资产同步信息" placement="bottom">
              <Button style="margin: 3px" type="info" @click="handlerViewLog(item)">日志</Button>
            </Tooltip>
            <Tooltip content="手动触发资产导入" placement="bottom">
              <Button style="margin: 3px" type="success" @click="handlerAssetImport(item)">导入</Button>
            </Tooltip>

            <Tooltip content="删除,请谨慎操作！" placement="bottom">
              <Button style="margin: 3px" type="error" @click="handleDelete(item)">删除</Button>
            </Tooltip>
          </ButtonGroup>
        </Card>
      </i-col>
    </Row>
    <!-- 添加配置 -->
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading="true" :footer-hide="true" width="780">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="名称" prop="name">
          <template v-if="formValidate.id">
            <Input v-model="formValidate.name" :maxlength="120" disabled placeholder="请输入名称,不可重复" />
          </template>
          <template v-else>
            <Input v-model="formValidate.name" :maxlength="120" placeholder="请输入名称,不可重复" />
          </template>
        </FormItem>

        <FormItem label="云厂商" prop="cloud_name">
          <Select v-model="formValidate.cloud_name" placeholder="选择云厂商" @on-change="handlerChangeCloud">
            <Option value="aws">AWS</Option>
            <Option value="aliyun">阿里云</Option>
            <Option value="qcloud">腾讯云</Option>
            <Option value="volc">火山云</Option>
            <Option value="gcp">谷歌云</Option>
            <Option value="huaweicloud" disabled>华为云</Option>
            <Option value="ucloud" disabled>UCloud</Option>
            <Option value="cds">首都在线</Option>
            <Option value="dnspod">DNSPod</Option>
            <Option value="vmware">vmware vsphere</Option>
            <Option value="pve">Proxmox VE</Option>
          </Select>
        </FormItem>
        <!-- 特殊的云需要一些额外的东西 -->
        <template v-if="formValidate.cloud_name === 'ucloud' || formValidate.cloud_name === 'huaweicloud' ">
          <FormItem label="项目ID" prop="project_id">
            <Input v-model="formValidate.project_id" :maxlength="100" placeholder="项目ID, 云的凭证--项目ID，每个区域都有一个" />
          </FormItem>
        </template>

        <template v-if="formValidate.cloud_name === 'gcp'">
          <FormItem label="项目ID" prop="project_id">
            <Input v-model="formValidate.project_id" :maxlength="100" placeholder="项目ID，在 Google Cloud 中，是用来标识您的项目的唯一字符串" />
          </FormItem>

          <FormItem label="密钥文件" prop="account_file">
            <Input v-model="formValidate.account_file" :maxlength="5000"  type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" 
             placeholder="IAM account_file" />
          </FormItem>
        </template>

        <template v-else>
          <FormItem label="区域" prop="region"  v-if="formValidate.cloud_name != 'cds'">
            <Alert>
              云厂商区域ID 支持逗号分隔多个。 不使用接口遍历主要是某些厂商的接口太慢，会影响速度
              <p v-if="formValidate.cloud_name == 'vmware'"> Vmware 在此写入server地址，三段式，地址：端口：是否ssl。
                示例：192.168.66.66:443:ssl 或 192.168.66.66:443:nossl</p>
            </Alert>
            <Input v-model="formValidate.region" :maxlength="999" placeholder="云厂商区域ID,支持逗号分隔多个" />
          </FormItem>

          <FormItem label="AccessID" prop="access_id">
            <Input v-model="formValidate.access_id" :maxlength="200" placeholder="IAM SecretID/AccessID" />
          </FormItem>

          <FormItem label="AccessKey" prop="access_key">
            <Input v-model="formValidate.access_key" type="password" password :maxlength="200" placeholder="IAM SecretKey/AccessKey" />
          </FormItem>
        </template>

        <FormItem label="备注" prop="detail">
          <Input v-model="formValidate.detail" type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" :maxlength="50" placeholder="简单描述下吧" />
        </FormItem>

        <FormItem label="自动发现">
          <i-switch v-model="formValidate.is_enable" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
          <span style="margin-left: 150px">自动同步间隔时间：</span><InputNumber v-model="formValidate.interval" :max="10080" :min="1" :step="5"/> <span>分钟</span>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button style="margin-left: 8px" @click="handleReset('formValidate')">重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 同步资产 -->
    <Modal v-model="syncDialog" title="同步资产" :footer-hide="true" width="600">
      <Alert type="success">将指定云厂商对应类型的资产导入的本地</Alert>
      <Form ref="formValidateSync" :model="formValidateSync">
        <FormItem label="账号">
          <span>{{ formValidateSync.cloud_name }} / {{ formValidateSync.account_id }}</span>
        </FormItem>
        <FormItem label="类型">
          <CheckboxGroup v-model="formValidateSync.resources">
            <template v-for="item in supportResources">
              <Checkbox :key="item" :label="item" />
            </template>
          </CheckboxGroup>
        </FormItem>
        <FormItem>
          <div style="float: right">
            <Button type="primary" @click="handleSubmitSyncTask('formValidateSync')">提交</Button>
            <Button style="margin-left: 8px" @click="syncDialog = false">取消</Button>
          </div>
        </FormItem>
      </Form>
    </Modal>
    <Drawer v-model="viewDrawerbySyncLog" draggable :closable="false" width="1020" title="资产同步Log(50条)">
      <Table size="small" :columns="synclogColumns" :data="sync_log_list" />
    </Drawer>
  </div>
</template>

<script>
import {
  getCloudSettinglist,
  operationCloudSetting,
  getCloudSyncLog,
  getCloudSyncResources,
  cloudAssetImport,
} from '@/api/cmdb'

export default {
  data() {
    return {
      syncDialog: false,
      formValidateSync: {
        cloud_name: '',
        resources: [], // 已经确认的资源类型
      },
      supportResources: [], // 支持的资源类型
      spinShow: false, // 资产导入加载
      viewDrawerbySyncLog: false, // 显示同步日志抽屉
      modalMap: {
        loading: false,
        modalVisible: false,
        modalTitle: '添加配置',
      },
      method_data: null,
      formValidate: {
        name: null,
        cloud_name: null,
        region: null,
        access_id: null,
        access_key: null,
        ext_info: Object,
        is_enable: true,
        detail: null,
        interval: 5
      },
      ruleValidate: {
        name: [{ required: true, message: '名词不能为空', trigger: 'blur' }],
        cloud_name: [{ required: true, message: '选择云厂商', trigger: 'blur' }],
        region: [{ required: true, message: '云厂商的region', trigger: 'blur' }],
        access_id: [{  required: true, message: 'IAM角色 AccessID,需要有权限访问云主机', trigger: 'blur'}],
        access_key: [
          {
            required: true,
            message: 'IAM角色 AccessKey,需要有权限访问云主机',
            trigger: 'blur',
          },
        ],
      },
      cloud_list: [],
      sync_log_list: [], // 同步日志
      synclogColumns: [
        {
          title: '名称',
          minWidth: 100,
          key: 'name',
          align: 'center',
        },
        {
          title: '云服务商',
          width: 120,
          key: 'cloud_name',
          align: 'center',
        },
        {
          title: '同步类型',
          width: 120,
          key: 'sync_type',
          align: 'center',
        },
        {
          title: '同步区域',
          width: 150,
          key: 'sync_region',
          align: 'center',
        },
        {
          title: '同步状态',
          width: 100,
          key: 'sync_state',
          align: 'center',
          render: (h, params) => {
            const status = params.row.sync_state
            if (status === 'success') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'green' },
                  },
                  '成功',
                ),
              ])
            }
            return h('div', [
              h(
                'Tag',
                {
                  props: { color: 'red' },
                  nativeOn: {
                    click: () => {
                      this.$Modal.error({
                        title: 'Log信息',
                        content: params.row.loginfo,
                      })
                    },
                  },
                },
                '失败',
              ),
            ])
          },
        },
        {
          title: '同步耗时(s)',
          width: 120,
          key: 'sync_consum',
          align: 'center',
        },
        {
          title: '同步时间',
          width: 180,
          key: 'sync_time',
          align: 'center',
        },
      ],
    }
  },
  methods: {
    // 获取多云配置信息
    getViewDatabyCloudSetting() {
      getCloudSettinglist().then((res) => {
        if (res.code === 0) {
          this.cloud_list = res.data
        } else {
          this.$message.error(`${res.msg}`)
        }
      })
    },
    // 获取同步Log

    getCloudSyncLogTableData(accountID) {
      getCloudSyncLog(accountID).then((res) => {
        if (res.code === 0) {
          this.sync_log_list = res.data
        } else {
          this.$message.error(`${res.msg}`)
          this.viewDrawerbySyncLog = false
        }
      })
    },

    handCreate() {
      this.method_data = 'post'
      this.formValidate = {}
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = '新增配置'
    },
    handleSubmit(value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationCloudSetting(this.formValidate, this.method_data).then(
              (res) => {
                if (res.code === 0) {
                  this.$Message.success(`${res.msg}`)
                  this.getViewDatabyCloudSetting()
                  this.modalMap.modalVisible = false
                } else {
                  this.$Message.error(`${res.msg}`)
                }
              },
            )
          }, 1000)
          // this.$Message.success('Success!');
        } else {
          this.$Message.error('缺少必要参数')
        }
      })
    },
    handlerEdit(item) {
      this.method_data = 'put'
      this.formValidate = item
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = '编辑配置'
    },
    // 删除
    handleDelete(item) {
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (confirm(`确定要删除 ${item.name}`)) {
        operationCloudSetting( {id_list: [item.id]}, 'delete').then((res) => {
          if (res.code === 0) {
            this.$Message.success(`${res.msg}`)
            this.getViewDatabyCloudSetting()
          } else {
            this.$Message.error(`${res.msg}`)
          }
        })
      }
    },
    handlerChangeCloud(cloud_name){
      // console.info(cloud_name)
      // this.formValidate.cloud_name = cloud_name
    },
    // 日志
    handlerViewLog(item) {
      this.viewDrawerbySyncLog = true
      this.getCloudSyncLogTableData(item.account_id)
    },

    // 点击导入
    async handlerAssetImport(item) {
      this.formValidateSync = {
        cloud_name: '', resources: [],
      }
      // 先获取支持的类型
      const { data } = await getCloudSyncResources({ cloud_name: item.cloud_name })
      this.supportResources = data
      // 渲染Moda框
      this.syncDialog = true
      this.formValidateSync.cloud_name = item.cloud_name
      this.formValidateSync.account_id = item.account_id
    },

    // 资产同步任务
    // eslint-disable-next-line camelcase
    async handleSubmitSyncTask() {
      this.syncDialog = false
      this.spinShow = true
      try {
        const res = await cloudAssetImport(this.formValidateSync)
        this.$Message.success(`${res.msg}`)
      } finally {
        this.spinShow = false
      }
    },
    // 重置
    handleReset(name) {
      this.$refs[name].resetFields()
    },
  },
    mounted() {
    this.getViewDatabyCloudSetting()
  },
}
</script>
<style>
.cloud-style {
  padding: 0 5px 5px 6px;
}
.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
