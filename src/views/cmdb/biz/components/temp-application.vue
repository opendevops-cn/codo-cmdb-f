<template>
   <Drawer v-model="modalData.show" @on-close='handleCancel' :title="modalData.title" width="50%" draggable :mask-closable='false' >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-colon='true' :label-width="100">
        <FormItem label="选择业务" prop="biz_id" >
          <Select v-model="formValidate.biz_id"  filterable placeholder="请选择业务...">
            <Option v-for="item in bizList" :key="item.biz_id" :value="item.biz_id" :label="item.biz_cn_name" />
          </Select>
        </FormItem>
          <FormItem label="选择环境"  prop="env_name" >
            <Select v-model="formValidate.env_name"  filterable placeholder="请选择环境..">
              <Option v-for="item in envList" :value="item" :key="item" :label="item"></Option>
            </Select>
        </FormItem>
      
          <FormItem label="应用模式">
          <RadioGroup v-model="formValidate.app_way">
              <Radio label="model1">模式1</Radio>
              <Radio label="model2">模式2</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem >
          <Alert type="success" show-icon closable>
              批量创建集群
              <template slot="desc">
                <p>模式1例：填写  测试集群1 测试集群2 测试集群3 测试集群4  以空格或者半角逗号分隔集群。</p>
                <p>模式2例：填写  测试集群，连接符号 _ ， 范围1,100， 据使用当前模板创建测试集群1  -  测试集群99 一共一百个集群。</p>
              </template>
          </Alert>
        </FormItem>

        <FormItem label="集群列表"  prop="set_list" v-if="formValidate.app_way == 'model1'">
          <Input v-model="formValidate.set_list"  type="textarea" maxlength="65500" :autosize="{minRows: 8,maxRows: 15}" placeholder="输入集群..." />
        </FormItem>

        <template v-else>
        <Row :gutter="30">
          <Col span="8">
            <FormItem label="集群名称"  prop="set_name">
              <Input v-model="formValidate.set_name" maxlength="20" type="text" placeholder="测试"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="编号范围" prop="num_range">
              <Input v-model="formValidate.num_range" maxlength="80" type="text" placeholder="例如1-100"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="分隔符" prop="delimiter">
              <Input v-model="formValidate.delimiter" maxlength="5" type="text" placeholder="默认下划线"></Input>
            </FormItem>
          </Col>
        </Row>
        </template>
        <FormItem >
            <Button type="primary" :loading="btnLoading" @click="handleSubmit('formValidate')">确定</Button>
             <Button @click="handleCancel" style="margin-left: 15px">取消</Button>
        </FormItem>

      </Form>
  </Drawer>
</template>
<script>
import { getBizEnv } from '@/api/service-tree'
import { getBusinesslist } from '@/api/cmdb'
export default {
  components: {},
  name: 'tempApp',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      btnLoading: false,
      bizList: [],
      envList: [],
      formValidate: {
        biz_id: null,
        app_way:'model1',
        num_range: '1,5',
        delimiter: '_'
          
      },
      ruleValidate: {
        biz_id: [{ required: true, message: '业务不能为空', trigger: 'blur' }],
        env_name: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
        set_list: [{ required: true, message: '集群不能为空', trigger: 'blur' }],
        set_name: [{ required: true, message: '集群不能为空', trigger: 'blur' }],
        num_range: [{ required: true, message: '范围不能为空', trigger: 'blur' }],
        delimiter: [{ required: true, message: '集群不能为空', trigger: 'blur' }],
      }
    }
  },
  methods: {
    handleCancel () {
     this.formValidate = this.$options.data().formValidate
     this.formValidate.biz_id = localStorage.getItem('selectBusinessID')
     this.$emit('drawer-close')
    },
    async handleGetEnv() {
      const res = await getBizEnv({biz_id: this.formValidate.biz_id});
      if (res.code == 0) {
        this.envList = res.data.env_list
        let that =this
        that.formValidate.env_name = null
      } else {
        this.$Message.error(res.msg)
      }
    },
    async getBizList() {
      const res = await getBusinesslist()
      this.bizList = res.data
    },

    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.formValidate['temp_id'] = this.modalData.temp_id
          setTimeout(() => {
            this.$emit('save-data', this.formValidate)
            this.btnLoading = false
          }, 1000)
        } else {
          this.$Message.error('表单校验不通过!');
        }
      })
    },

  },
  watch: {
    'formValidate.biz_id': {
      handler (newValue, oldValue) {
        if (newValue && newValue !=oldValue ) {
             this.handleGetEnv()
        }
      },
        deep: true
      }
  },
  computed: {
  },
  //
  mounted () {
    this.getBizList()
    this.formValidate.biz_id = localStorage.getItem('selectBusinessID')
    // this.handleGetEnv()
  }
}
</script>
