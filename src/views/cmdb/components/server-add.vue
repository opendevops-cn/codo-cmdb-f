<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <!-- 添加 -->
    <!-- <Drawer v-model="modalData.show" :title="modalData.title" :loading="true" :footer-hide="true" width="750" @on-cancel="handleCancel"> -->
    <Drawer v-model="modalData.show" @on-close='handleCancel' :before-close='handleClose' :title="modalData.title" width="50%" 
      draggable :mask-closable='false' :footer-hide='true'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="实例名称" prop="name">
          <Input v-model="formValidate.name" :maxlength="120" placeholder="请输入实例名称"></Input>
        </FormItem>
        
        <FormItem label="厂商信息" prop="cloud_name">
           <Input v-model="formValidate.cloud_name" :maxlength="120" placeholder="请输入厂商名称"></Input>
        </FormItem>

        <FormItem label="归属" prop="ownership">
          <Input v-model="formValidate.ownership" :maxlength="120" placeholder="请输入"></Input>
        </FormItem>

        <FormItem label="内网IP" prop="inner_ip">
          <Input v-model="formValidate.inner_ip" :maxlength="120" placeholder="请输入内网IP"></Input>
        </FormItem>
        
        <FormItem label="外网IP" prop="outer_ip">
          <Input v-model="formValidate.outer_ip" :maxlength="120" placeholder="请输入"></Input>
        </FormItem>

        <FormItem label="实例ID" prop="instance_id">
          <Input v-model="formValidate.instance_id" :maxlength="120" placeholder="请输入实例ID，如果不填则随机生成"></Input>
        </FormItem>
        
        <FormItem label="Agent ID" prop="agent_id">
          <Input v-model="formValidate.agent_id" :maxlength="120" placeholder="请输入，如果不填默认"></Input>
        </FormItem>
        
          <FormItem label="扩展字段">
          <vue-json-editor v-model="formValidate.ext_info" :show-btns="false" :mode="'code'" lang="zh" @json-change="onJsonChange" @json-save="onJsonSave" @has-error="onError" />
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate', false)">保存</Button>
          <Button @click="handleSubmit('formValidate', true)" style="margin-left: 8px">保存并继续</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Drawer>
  </div>
</template>
<script>
import vueJsonEditor from 'vue-json-editor'
export default {
  name: 'serverAdd',
  components: {
    vueJsonEditor,
  },
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      btnLoading: false,
      ruleValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        cloud_name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        inner_ip: [{ required: true, message: '内网IP不能为空', trigger: 'blur' }],
        ownership: [{ required: true, message: '主机归属不能为空', trigger: 'blur' }],
      },
      formValidate: {
        cloud_name: 'qcloud',
        ext_info:{"cpu": 4, "zone": "ap-shanghai-5", "state": "运行中", "memory": 8, "region": "ap-shanghai", "vpc_id": "vpc-66666666666", "os_name": "CentOS 7.5 64位", "inner_ip": "", "outer_ip": "", "data_disk": 100, "charge_type": "包年包月", "instance_id": "", "system_disk": 50, "network_type": "vpc", "instance_type": "TS4.LARGE8", "security_group_ids": [], "instance_create_time": "2093-04-23T18:40:53Z", "instance_expired_time": "2093-07-23T18:40:53Z"}
      }
    }
  },
  methods: {
    handleCancel () {
      this.$emit('drawer-close')
    },
    handleClose () {
     this.$emit('drawer-close')
    },
    handleSubmit (name, next) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.$emit('save-data',this.formValidate, this.modalData.action, next)
            this.btnLoading = false
          }, 1000)
        } else {
          this.$Message.error('表单校验不通过!')
        }
      })
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
  watch: {
  },
  computed: {
  },
  //
  mounted () {
  }
  //
}
</script>
