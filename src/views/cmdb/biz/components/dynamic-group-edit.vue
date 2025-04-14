<template>
  <div >
      <Drawer :title="modalData.title" v-model="modalData.show" width="800"  draggable :mask-closable='false'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90" style="width: 750px" >

        <FormItem label="分组名称" prop="dynamic_group_name" style="padding-top: 10px">
          <Input v-model="formValidate.dynamic_group_name" :maxlength="50" placeholder="请输入分组名称"></Input>
        </FormItem>

        <FormItem label="分组类型"  prop="dynamic_group_type">
          <RadioGroup v-model="formValidate.dynamic_group_type" @on-change="handleChange">
              <Radio label="normal">通用类型</Radio>
              <Radio label="biz">业务类型</Radio>
          </RadioGroup>
        </FormItem>

        <template v-if="formValidate.dynamic_group_type === 'normal'">
          <FormItem label="选择业务" prop="biz_id" >
            <Select v-model="formValidate.biz_id"  disabled placeholder="请选择业务..." >
              <Option v-for="item in bizList" :key="item.biz_id" :value="item.biz_id" :label="item.biz_cn_name" />
            </Select>
          </FormItem>

        <template v-for="items, i in formValidate.dynamic_group_rules" class="alert-c">
          <FormItem :label="i | testF(i)" :label-width="85"
                    v-if="formValidate.dynamic_group_rules && formValidate.dynamic_group_rules.length !== 0">
            <Alert show-icon v-if="i == 0" style="min-width:500px;max-width: 704px;  margin-bottom: 8px;">
              卡片之间关系为或，卡片内的条件关系为且。</Alert>
            <Row :gutter="20">
              <Col span="22">
                <Card v-if="items.length > 0" style="min-width:500px; margin-bottom: 0px;" dis-hover>
                  <FormItem v-for="(item, index) in items" v-if="item.status" :key="index + _uid">
                    <div class="alert-con">
                      {{ index + 1 }} -

                      <Select v-model="item.query_name" placeholder="选择名称" style="max-width: 90px">
                        <Option value="name">资源名称</Option>
                        <Option value="cloud_name">云厂商</Option>
                        <Option value="inner_ip">内网IP</Option>
                        <Option value="region">地域</Option>
                        <Option value="state">运行状态</Option>
                      </Select>
                      <Select v-model="item.query_conditions" placeholder="选择条件" style="margin-right: 1px;margin-left: 1px; max-width: 90px">
                        <Option value="like">前缀匹配</Option>
                        <Option value="=">等于</Option>
                        <Option value="!=">不等于</Option>
                      </Select>
                      <Input style="max-width: 300px" v-model="item.query_value" placeholder=""></Input>
                      <Button shape="circle" type="text" icon="md-add" class="rule-btn-add"
                              @click="handleAdd(i)"></Button>
                      <Button v-if="items.length !== 1" shape="circle" type="text" icon="md-close" class="rule-btn-del"
                              @click="handleRemove(i, index)"></Button>

                    </div>
                  </FormItem>
                </Card>
                <p v-if="formValidate.dynamic_group_rules.length > 1 && i != 2" style="padding-top: 15px">或</p>
              </Col>
              <Col span="2">
                <a v-if="formValidate.dynamic_group_rules.length !== 1" @click.prevent="handleRemoveCard(i)"> 删除</a>
<!--                <Icon v-if="formValidate.dynamic_group_rules.length !== 1" v-on:click="handleRemoveCard(index)" type="md-trash" />-->
              </Col>
            </Row>
          </FormItem>
        </template>
          <Col span="19" offset="4">
            <FormItem :label-width="85" style="padding: 0px 0px;">
              <Row :gutter="10">
                <Col span="12">
                  <Button type="dashed" long @click="handleAddCard" icon="md-add">新增条件</Button>
                </Col>
                <Col v-if="formValidate.dynamic_group_rules" span="11" style="margin-left: 0px;">
                  <template>还可以添加{{ 3 - formValidate.dynamic_group_rules.length }}个条件</template>
                </Col>
              </Row>
            </FormItem>
          </Col>

<!--          <template v-for="(item, index) in formValidate.dynamic_group_rules">-->
<!--          <FormItem  v-if="item.status" :key="index" label="查询条件" :prop="'dynamic_group_rules.' + index + '.value'">-->
<!--            <Row>-->
<!--              <Col span="20">-->
<!--              <Select v-model="item.query_name" placeholder="选择名称" style="max-width: 110px">-->
<!--                <Option value="name">资源名称</Option>-->
<!--                <Option value="cloud_name">云厂商</Option>-->
<!--                <Option value="inner_ip">内网IP</Option>-->
<!--                <Option value="region">地域</Option>-->
<!--                <Option value="state">运行状态</Option>-->
<!--              </Select>-->
<!--              <Select v-model="item.query_conditions" placeholder="选择条件" style="margin-right: 1px;margin-left: 1px; max-width: 70px">-->
<!--                <Option value="like">包含</Option>-->
<!--                <Option value="=">等于</Option>-->
<!--                <Option value="!=">不等于</Option>-->
<!--              </Select>-->
<!--              <Input style="max-width: 350px" v-model="item.query_value" placeholder=""></Input>-->
<!--              </Col>-->
<!--              <Col span="3">-->
<!--              <Icon v-on:click="handleRemove(index)" type="md-trash" />-->
<!--              </Col>-->
<!--            </Row>-->
<!--          </FormItem>-->
<!--          </template>-->
<!--          <FormItem>-->
<!--            <Row>-->
<!--              <Col span="18">-->
<!--              <Tooltip trigger="hover" placement="top-start" content="多条件是or的关系">-->
<!--                <Button type="dashed" long @click="handleAdd" icon="md-add">添加条件</Button>-->
<!--              </Tooltip>-->
<!--              </Col>-->
<!--            </Row>-->
<!--          </FormItem>-->
        </template>

        <template v-else>
          <Row :gutter="5">
            <FormItem >
              <Alert type="success" show-icon closable>
                  根据业务拓扑信息创建动态分组
                  <template slot="desc">
                    <p>下列条件的关系为且 业务为必填项，集群和模块为可以输入多个，以半角逗号或者空格来分隔。</p>
                    <p>当前类型查询条件不支持通配符，全部为精确查询。</p>
                  </template>
              </Alert>
            </FormItem>
            <Col span="12">
              <FormItem label="选择业务" prop="biz_id" >
                <Select v-model="formValidate.biz_id"  filterable placeholder="请选择业务..." @on-change="handleChangeBiz">
                  <Option v-for="item in bizList" :key="item.biz_id" :value="item.biz_id" :label="item.biz_cn_name" />
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label=""  prop="env_name" >
                  <Select v-model="formValidate.env_name" filterable placeholder="请选择环境..">
                    <Option v-for="item in envList" :value="item" :key="item" :label="item"></Option>
                  </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="集群名称"  prop="region_name" >
                  <Input v-model="formValidate.region_name" :maxlength="500" placeholder="输入集群、区服名称，多个以半角逗号或者空格区分"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="模块名称"  prop="module_name" >
                  <Input v-model="formValidate.module_name" :maxlength="500" placeholder="输入模块、服务名称，多个以半角逗号或者空格区分"></Input>
              </FormItem>
            </Col>
          </Row>
        </template>

        <FormItem label="备注信息" prop="dynamic_group_detail">
           <Input v-model="formValidate.dynamic_group_detail" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="handleCancel">取消</Button>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
        </div>
      </Form>
    </Drawer>
  </div>
</template>

<script>
import { getBizEnv } from '@/api/service-tree'
import dynamicRules from '@/views/cmdb/biz/dynamic-rules.vue';
export default {
  name: 'dynamicGroupEdit',
  props: {
    modalData: {
        type :Object,
        default: {}
    },
    bizList: {
        type :Object | Array,
        default: []
    },
  },
  data () {
    return {
      index: 1,
      btnLoading: false,
      envList: [],
      formValidate: {
        dynamic_group_rules: [
          [{
            query_name: "name",
            query_conditions: "like", //条件 like = !=
            query_value: "", //值
            index: 1,
            status: 1
          }]
      ]},
      ruleValidate: {
        dynamic_group_name: [{ required: true, message: '动态分组名称不能为空', trigger: 'blur' }],
        dynamic_group_type: [{ required: true, message: '请选择动态分组类型', trigger: 'change' }],
        biz_id: [{ required: true, message: '业务类型的业务为必须', trigger: 'change' }],
      }
    }
  },
  filters: {
    testF (value, location) {
      if (location === 1) {
        return '条件 B'
      } else if (location === 2) {
        return '条件 C'
      } else if (location === 0) {
        return '条件 A'
      }
    },
  },
  methods: {
    async handleGetEnv() {
      const res = await getBizEnv({biz_id: this.formValidate.biz_id});
      if (res.code === 0) {
        this.envList = res.data.env_list
      } else {
        this.$Message.error(res.msg)
      }
    },
    handleCancel () {
      this.$emit('drawer-close')
    },
    handleChange () {
      if (this.formValidate.dynamic_group_type === 'normal') {
        this.formValidate.biz_id = '504'
      } else {
        this.formValidate.biz_id = null
        this.formValidate.env_name = null
      }
    },
    handleChangeBiz () {
      this.formValidate.env_name = null
    },
    // 添加条件
    handleAdd (i) {
      this.index++;
      if (this.formValidate.dynamic_group_rules[i].length > 4) {
        this.$Notice.warning({
          title: '限制提示',
          desc: '添加指标的个数不能超过五个',
          duration: 5
        });
        return
      }
      this.formValidate.dynamic_group_rules[i].push({
        index: this.index,
        query_name: "name",
        query_conditions: "like", //条件 like = !=
        query_value: "", //值
        status: 1
      });
    },
    handleRemove (i, index) {
      this.formValidate.dynamic_group_rules[i].splice(index, 1)
    },
    handleRemoveCard (i) {
      this.formValidate.dynamic_group_rules.splice(i, 1)
    },
    handleAddCard () {
      if (this.formValidate.dynamic_group_rules.length > 2) {
        this.$Notice.warning({
          title: '限制提示',
          desc: '条件组不能超过三个',
          duration: 5
        });
        return
      }
      this.formValidate.dynamic_group_rules.push([{
        query_name: "name",
        query_conditions: "like", //条件 like = !=
        query_value: "", //值
        index: 1,
        status: 1
      }])
    },
    // handleAdd () {
    //   this.index++;
    //   if (this.index > 6) {
    //     this.$Notice.warning({
    //       title: "条件超出最大限制",
    //     });
    //     return;
    //   }
    //   // 条件默认配置
    //   this.formValidate.dynamic_group_rules.push({
    //     query_name: "name",
    //     query_conditions: "like",
    //     query_value: "",
    //     index: this.index,
    //     status: 1,
    //   });
    // },
        // 移除条件
    // handleRemove(index) {
    //   this.index--;
    //   this.formValidate.dynamic_group_rules[index].status = 0;
    // },
    async handleSubmit (name) {
      // 表单验证
      const valid = await this.$refs[name].validate();
      if (!valid) {
        this.$Notice.error({ title: "表单验证失败" });
        return;
      }
      if (this.formValidate.dynamic_group_type === 'normal') {
        for (const rules of this.formValidate.dynamic_group_rules) {
            for (const rule of rules){
              if (rule.status === 1 && (rule.query_value === "" || !rule.query_value)) {
                this.$Notice.warning({ title: "查询条件存在空值！" });
                return;
              }
              // 移除条件中所有空格
              rule.query_value = rule.query_value.replace(/\s/g, "")
            }
        }
      } else {

      }

      // 验证条件
      //  if (this.formValidate.dynamic_group_type === 'normal') {
      //     for (var _index in this.formValidate.dynamic_group_rules) {
      //       let query_value =
      //       this.formValidate.dynamic_group_rules[_index]["query_value"];
      //       let status = this.formValidate.dynamic_group_rules[_index]["status"];
      //       if (status === 1) {
      //         if (query_value === "" || !query_value) {
      //           this.$Notice.warning({ title: "查询条件存在空值！" });
      //           return;
      //         }
      //       }
      //     }
      //  } else {
      //
      //  }

      setTimeout(() => {
        this.$emit('save-data', this.formValidate, this.modalData.action)
      }, 200)
    },
  },
  //
  watch: {
    // formData (value) {
    //   this.formValidate = JSON.parse(JSON.stringify(value))
    // },
    'formValidate.biz_id': {
      handler (newValue, oldValue) {
        if (newValue && newValue != oldValue ) {
             this.handleGetEnv()
        }
      },
        deep: true
      }
  },
  //
  mounted () {
  }
  //
}
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