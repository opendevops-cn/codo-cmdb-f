<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <!-- 添加 -->
    <Drawer v-model="modalData.show" @on-close='handleCancel' :before-close='handleClose' :title="modalData.title" width="50%" 
      draggable :mask-closable='false' :footer-hide='true'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="实例名称" prop="name">
          <Input v-model="formValidate.name" :maxlength="120" placeholder="请输入实例名称"></Input>
        </FormItem>
        
        <FormItem label="厂商信息" prop="cloud_name">
           <Input v-model="formValidate.cloud_name" :maxlength="120" placeholder="请输入厂商名称"></Input>
        </FormItem>

        <FormItem label="版本" prop="db_version">
          <Input v-model="formValidate.db_version" :maxlength="120" placeholder="请输入"></Input>
        </FormItem>
        
        <FormItem label="引擎" prop="db_engine">
          <Input v-model="formValidate.db_engine" :maxlength="120" placeholder="请输入"></Input>
        </FormItem>

        <FormItem label="实例ID" prop="instance_id">
          <Input v-model="formValidate.instance_id" :maxlength="120" placeholder="请输入实例ID，如果不填则随机生成"></Input>
        </FormItem>
        
        <FormItem label="数据库地址">
          <vue-json-editor  v-model="formValidate.db_address" :show-btns="false"  :mode="'code'" lang="zh" ></vue-json-editor>
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
  name: 'mysqlAdd',
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
        cloud_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      formValidate: {
        cloud_name: 'qcloud',
        db_engine: 'MySQL',
        db_version: '5.7',
        db_address: {
          "items": [
            {
              "ip": "10.0.70.145",
              "port": 3306,
              "type": "private",
              "domain": "",
              "endpoint_type": "Primary"
            },
            {
              "ip": "",
              "port": 0,
              "type": "public",
              "domain": "",
              "endpoint_type": "Primary"
            }
          ]
        },
        ext_info: {"account_id": "3jcaSEJREKqaVLKSDdFCEt", "region": "ap-singapore", "zone": "ap-singapore-3", "state": "运行中", "db_class": "4C/8G/200G", "charge_type": "按量付费", "create_time": "2023-03-27 09:52:09"}
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
