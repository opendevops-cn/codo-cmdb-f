<template>
  <Card :bordered="false" dis-hover>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-colon='true' label-position="top">
      <Row>
        <Col span="21" offset="2" style="padding: 15px 5px">
        <span style="color: #464c5b; font-size: 16px; font-weight: bold;">基础信息</span>
        </Col>

        <Col span="13" offset="4">
          <Row :gutter="30">
            <Col span="12">
              <FormItem label="规则名称" prop="name" >
                <Input v-model="formValidate.name" maxlength="80" type="text" placeholder="请输入规则名称..."></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="源类型">
                <Select v-model="formValidate.asset_type" class="rule-select" filterable placeholder="请选择资源类型">
                  <Option v-for="item in assetList" :value="item.value" :key="item.value" :label="item.label"></Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
                
        <FormItem label="定时刷新">
          <RadioGroup v-model="formValidate.interval" type="button">
            <Radio label="yes" disabled>启用</Radio>
            <Radio label="no">禁用</Radio>
          </RadioGroup>
        </FormItem>

        <Alert show-icon>
          <p>挂载到上级会自动挂载到下级, 资源类的应都是挂载到服务或者模块</p>
            后续会根据不通的资源进行禁用</Alert>
        <FormItem label="目标拓扑">
          <Cascader  :data="treeData" v-model="formValidate.des_data" change-on-select></Cascader>
        </FormItem>
        </Col>

        <Col span="21" offset="2" style="padding: 15px 5px">
        <span style="color: #464c5b; font-size: 16px; font-weight: bold;">规则条件</span>
        </Col>

        <Col span="19" offset="4" style="padding-right: 20px">
          <p style="padding-bottom: 5px;">下列条件之间的关系为且(and)</p>
          <FormItem  v-for="(item, index) in formValidate.condition_list"  :key="index + _uid">
            <div class="alert-con">
              <Select v-model="item.src_type" class="rule-select" filterable>
                <Option v-for="item in columnTypeList" :value="item.value" :key="item.value" :label="item.label"  placeholder="类型">
                </Option>
              </Select>

              <Select v-model="item.src_operator" class="rule-select1" filterable>
                <Option v-for="item in operatorList" :value="item.value" :key="item.value" :label="item.label">
                </Option>
              </Select>

              <Input class="rule-input1" v-model="item.src_content" clearable :maxlength='90' placeholder="值" />
              <Button  shape="circle" type="text" icon="md-add" class="rule-btn-add"  @click="handleAdd(index)"></Button>
              <Button v-if="mapLen !== 1" shape="circle" type="text" icon="md-close" class="rule-btn-del"
                @click="handleRemove(index)"></Button>

            </div>
          </FormItem>
        </Col>

        <Col span="19" offset="4">
        <FormItem style="padding: 0px 0px;">
          <div style="padding-top: 12px;">
            <Button type="primary" :loading="btnLoading" @click="handleSubmit('formValidate')">确定</Button>
            <Button type="success" ghost style="margin-left: 15px"  @click="handlePreview">预览规则</Button>
            <Button @click="handleCancel" style="margin-left: 15px">返回</Button>
          </div>
        </FormItem>

        </Col>
      </Row>
    </Form>

  </Card>
</template>
<script>
import { assetList, operatorList, columnTypeList } from '@/api/const'
import { getServiceTreelist } from '@/api/service-tree'
export default {
  components: {},
  name: 'ruleEdit',
  props: {
    formData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      btnLoading: false,
      assetList,
      // channalList: [],
      operatorList,
      columnTypeList,
      mapLen: null,
      treeData: [],
      ruleValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '不能为空', trigger: 'change' }],
        channel_name: [{ required: true, type: 'number', message: '不能为空', trigger: 'change' }],
      }
    }
  },
  filters: {
  },
  methods: {
    handleCancel () {
      if (JSON.stringify(this.formValidate) != JSON.stringify(this.formData)) {
        this.$Modal.confirm({
          content: `<p>编辑还没有保存，确定要离开？</p>`,
          onOk: () => {
            this.$emit('edit-close')
          },
          onCancel: () => { this.$Message.info('回头是岸'); }
        });
      } else {
        this.$emit('edit-close')
      }
    },
    async handleGetData() {
      const res = await getServiceTreelist();
      if (res.code == 0) {
        this.treeData = res.data
        this.changeId2(this.treeData ,'title','label','value')
      } else {
        this.$Message.error(res.msg)
      }
    },
    changeId2(objAry, key, newkey, newkey2) {
      if (objAry != null) {
        // objAry.splice(0,1) // 删除所有项目
        objAry.forEach((item) => {
          Object.assign(item, {
            [newkey]:  item[key],
            [newkey2]: item[key],
          });
          // delete item[key];
          this.changeId2(item.children, key, newkey, newkey2);
        });
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.formValidate.name = this.formValidate.name.trim()
          setTimeout(() => {
            this.$emit('save-data', this.formValidate)
            this.btnLoading = false
          }, 1000)
        } else {
          this.$Message.error('表单校验不通过!');
        }
      })
    },
    //
    handleAdd (i) {
      let mapLen = Object.keys(this.formValidate.condition_list).length
      console.info(typeof(mapLen))
      if (mapLen > 4) {
        this.$Notice.warning({
          title: '限制提示',
          desc: '添加规则的个数不能超过五个',
          duration: 5
        });
        return
      }

      this.formValidate.condition_list[mapLen] = {
        src_type: 'name',  //源字段
        src_operator: '==',
        src_content: ''
      }
      console.info( this.formValidate.condition_list)
      this.formValidate.condition_list = JSON.parse(JSON.stringify(this.formValidate.condition_list))
    },
    handleRemove (i) {
      delete this.formValidate.condition_list[i]
      this.formValidate.condition_list = JSON.parse(JSON.stringify(this.formValidate.condition_list))
    },
    handlePreview(){
      this.$Notice.warning({
          title: '限制提示',
          desc: '请到列表处, 点击刷新可以预览数据',
          duration: 5
        });
    },
 

  },
  watch: {
    formValidate (value) {
    },

  'formValidate.condition_list': {
    handler(newValue, oldValue) {
      this.mapLen = Object.keys(this.formValidate.condition_list).length
      console.log('正在被侦听',this.mapLen)
    },
    deep: true,
    // immediate: true
    }
  },
  computed: {
    formValidate: function () {
      return this.formData
    }
  },
  //
  mounted () {
    this.handleGetData()
  }
}
</script>

<style lang="less" scoped>

.alert-con {
  padding: 0px 0px 0px;

  .rule {
    &-col {
      display: inline-block;
      margin-left: 15px;
      // margin-right: 2px;
      width: 15px;
    }

    // 第一个 无偏移
    &-input1 {
      display: inline-block;
      margin-left: 5px;
      width: 260px;
    }

    &-select {
      display: inline-block;
      width: 180px;
      margin-left: 0px;
    }

    &-select1 {
      display: inline-block;
      width: 110px;
      margin-left: 3px;
    }
    &-btn-del {
      display: inline-block;
      margin-left: 10px;
      margin-top: 3px;
      margin-right: 5px;
    }

    &-btn-add {
      display: inline-block;
      margin-left: 10px;
      margin-top: 2px;
      margin-right: 5px;
    }
  }
}
</style>
