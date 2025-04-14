<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <!-- 添加 -->
    <Modal v-model="modalData.show" :title="modalData.title" :loading="true" :footer-hide="true" width="750" @on-cancel="handleCancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="名称" prop="name">
          <Input v-model="formValidate.name" :maxlength="120" placeholder="请输入名称、虚拟交换机、虚拟子网"></Input>
        </FormItem>
        
        <div v-show="false">
         <FormItem label="厂商" prop="cloud_name">
            <Select v-model="formValidate.cloud_name">
              <Option value="neiwang">内网</Option>
            </Select>
        </FormItem>
        </div>

        <FormItem label="局域网名" prop="vpc_name">
          <Input v-model="formValidate.vpc_name" :maxlength="120" placeholder="请输入局域网名 VPC"></Input>
        </FormItem>

        <FormItem label="网段V4" prop="cidr_block_v4">
          <Input v-model="formValidate.cidr_block_v4" :maxlength="120" placeholder="请输入网段 IPv4"></Input>
        </FormItem>
        
        <FormItem label="网段V6" prop="cidr_block_v6">
          <Input v-model="formValidate.cidr_block_v6" :maxlength="250" placeholder="请输入网段 IPv6"></Input>
        </FormItem>

        <FormItem label="网关地址" prop="route">
          <Input v-model="formValidate.route" :maxlength="120" placeholder="请输入网关地址"></Input>
        </FormItem>

        <FormItem label="详情备注" prop="description">
          <Input v-model="formValidate.description" :maxlength="250" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入详情备注..."></Input>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'vswitchAdd',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
    // formData: {
    //   type: Object | Array,
    //   default: {}
    // },
  },
  data () {
    return {
      btnLoading: false,
      ruleValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        vpc_name: [{ required: true, message: '虚拟局域网名不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
      },
      formValidate: {
        cloud_name: 'neiwang'
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
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          setTimeout(() => {
            this.$emit('save-data',this.formValidate, this.modalData.action)
            this.btnLoading = false
          }, 1000)
        } else {
          this.$Message.error('表单校验不通过!')
        }
      })
    }
  },
  watch: {
    // formData (value) {
    //   this.formValidate = JSON.parse(JSON.stringify(value))
    // }
  },
  computed: {
  },
  //
  mounted () {
  }
  //
}
</script>
