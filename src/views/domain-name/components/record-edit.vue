<template>
  <div>
    <Modal width="680px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true>
      <Form ref="formInline" :model="formInline" :rules="formRule" :label-width="100" :label-colon=true>
        <FormItem label="记录类型" prop="domain_type">
          <Row>
            <Col span='22'>
            <Select v-model="formInline.domain_type" placeholder="记录类型">
              <Option v-for="item, index in typeList" :value="item.value" :key="item.value" :label="item.lable"></Option>
            </Select>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="主机记录" prop="domain_rr">
          <Row>
            <Col span='16'>
            <Input type="text" v-model="formInline.domain_rr" :maxlength='80' placeholder="目前不支持二级泛域名证书，请勿使用三级域名" />
            </Col>
            <Col span='6'> .{{selectedDomain}}</Col>

            <Col span='1' offset='1'>
              <Poptip trigger="hover" width="330" placement="left">
                <div slot="content" style="white-space: normal;">
                  <b>主机记录就是域名前缀，常见用法有：</b>
                  <p style="font-size: 2px;">
                    <b>www：</b>解析后的域名为www.a.com。
                  </p>
                  <p style="font-size: 2px;">
                    <b>@： </b>直接解析主域名 a.com。
                  </p>
                <p style="font-size: 2px;">
                    <b>*： </b>泛解析，匹配其他所有域名 *.a.com。
                  </p>
                  <p style="font-size: 2px;">
                    <b>二级域名：</b>如：abc.a.com，填写abc。
                  </p>
                  <p style="font-size: 2px;">
                  <b>手机网站：</b>如：m.a.com，填写m。
                  </p>
                </div>
                <Icon type="ios-help-circle" />
              </Poptip>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="解析线路" prop="line">
          <Row>
            <Col span='22' v-if="cloud_name =='qcloud' || cloud_name =='dnspod'">
              <Select v-model="formInline.line">
                <Option v-for="value, key  in qlineList" :value="value" :key="value" :label="key"></Option>
              </Select>
            </Col>
            <Col span='22' v-else>
              <Select v-model="formInline.line">
                <Option v-for="value, key  in lineList" :value="value" :key="value">{{ key }}</Option>
              </Select>
            </Col>

            <Col span='1' offset='1'>
            <Poptip trigger="hover" width="450" placement="left">
              <div slot="content" style="white-space: normal;">
                <b>如果只有一个IP地址或CNAME域名，请务必选择【默认】</b>
                 <p style="font-size: 2px;">
                 <b>默认：</b>必填！未匹配到智能解析线路时，返回【默认】线路设置。
                </p>
                 <p style="font-size: 2px;">
                  <b>境外：</b>向除中国大陆以外的其他国家和地区，返回设置的记录值。
                </p>
                <p style="font-size: 2px;">
                  <b>搜索引擎：</b>向搜索引擎爬虫的DNS，返回设置的记录值
                </p>
                <p style="font-size: 2px;">
                 <b>其他线路：</b>一般用来做智能解析
                </p>
              </div>
              <Icon type="ios-help-circle" />
            </Poptip>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="记录值" prop="domain_value">
          <Row>
            <Col span='22'>
            <Input type="text" v-model="formInline.domain_value" :maxlength='255' placeholder="记录值"></Input>
            </Col>
          </Row>
        </FormItem>
        
        <FormItem label="权重" prop="weight">
          <Row>
            <Col span='22'>
            <Input type="text" v-model="formInline.weight" :maxlength='125' placeholder="权重设置范围为 0 - 100 ，数值越大表示权重越高，腾讯企业版功能"></Input>
            </Col>
            <Col span='1' offset='1'>
              <Poptip trigger="hover" width="450" placement="left">
                <div slot="content" style="white-space: normal;">
                  <b>同一条线路下的多条记录，可按照指定权重比例返回，支持 A 与 CNAME 记录</b>
                  <p style="font-size: 2px;">
                    1、权重设置范围为 0 - 100 ，数值越大表示权重越高
                  </p>
                  <p style="font-size: 2px;">
                    2、解析到某条记录的比例为：该条记录权重 ÷ 该线路所有记录权重之和
                  </p>
                  <p style="font-size: 2px;">
                    3、当某个线路下的某条记录的权重设为 0 时，表示关闭该线路下所有记录的权重
                  </p>
                  <p style="font-size: 2px;">
                    4、当某条线路已经包含一条或多条已设权重的记录，修改或新增一条未设权重的记录时，则该条记录的权重为该线路下其他已有记录的权重平均值
                  </p>
                </div>
                <Icon type="ios-help-circle" />
              </Poptip>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="MX优先级" prop="domain_mx" v-if="formInline.domain_type === 'MX'">
          <Row>
            <Col span='22'>
            <Input type="text" v-model="formInline.domain_mx" :maxlength='2' placeholder="MX"></Input>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="TTL" prop="domain_ttl">
          <Row>
            <Col span='22'>
            <Select v-model="formInline.domain_ttl" placeholder="记录类型">
              <Option v-for="item, index in TTLList" :value="item.value" :key="item.value" :label="item.lable"></Option>
            </Select>
            </Col>
            <Col span='1' offset='1'>
              <Poptip trigger="hover" width="450" placement="left">
                <div slot="content" style="white-space: normal;">
                  <b>TTL 指解析记录在 DNS 服务器缓存的生存时间，数值越小则生效越快</b>
                  <p style="font-size: 2px;">
                    一般默认值，如不了解请保留 600 秒即可
                  </p>
                  <p style="font-size: 2px;">
                    当记录值较少变动时，建议选择 3600 秒，有利于提升解析速度
                  </p>
                  <p style="font-size: 2px;">
                    当记录值频繁变动，可选择 60 秒，但解析速度可能略受影响
                  </p>
                </div>
                <Icon type="ios-help-circle" />
              </Poptip>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="备注" prop="remark">
          <Row>
            <Col span='22'>
            <Input type="text" v-model="formInline.remark" :maxlength='255' placeholder="备注"></Input>
            </Col>
          </Row>
        </FormItem>

        <!-- <FormItem label="所属业务" prop="the_business"  v-if="modalData.action === 'post'">
              <Row>
                <Col span='22'>
                  <Select v-model="formInline.the_business" filterable clearable placeholder="请选择所属业务">
                    <template v-for="item in businessList">
                        <Option :value="item.id" >{{item.resources_name}}</Option>
                    </template>
                </Select>
                </Col>
              </Row>
            </FormItem> -->

        <FormItem>
          <template v-if="modalData.action === 'put'">
            <Button type="primary" @click="handlerSubmitRecordEdit('formInline')" :loading="btnLoading">提交</Button>
          </template>
          <template v-else>
            <Button type="primary" @click="handlerSubmitRecord('formInline')" :loading="btnLoading">提交</Button>
          </template>
          <Button style="margin-left: 8px" @click="handlerReset('formInline')">重置</Button>
        </FormItem>
        <!-- </Row> -->
      </Form>
    </Modal>

  </div>
</template>

<script>
import { optDomainRecords } from '@/api/domain/domain.js'
export default {
  name: 'recordEdit',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
    cloud_name: {
      type: String,
      default: 'aliyun'
    },
  },
  data () {
    //  const validateIsNotCn = (rule, value, callback) => {
    //     let regex = /\p{Unified_Ideograph}/u
    //     if (regex.test(value)) {
    //         return callback(new Error('主机记录不能包含汉字'))
    //     } else {
    //         callback()
    //     }
    //  };
    return {
      selectedDomain:'',
      logModal: false,
      //
      btnLoading: false,
      //
      formInline: {
        domain_rr: '',
        line: 'default',
        domain_type: 'A',
        domain_ttl: 600,
        domain_mx: 1,
        domain_value: '',
        weight: 10,
        the_business: null,
        remark: ""
      },
      formRule: {
        domain_type: [{ required: true, message: '记录类型不能为空', trigger: 'change' }],
        domain_rr: [{ required: true, message: '主机记录不能为空', trigger: 'blur' }],
        line: [{ required: true, message: '线路不能为空', trigger: 'change' }],
        domain_mx: [{ required: true, message: '不能为空', trigger: 'blur' }],
        domain_value: [{ required: true, message: '记录值不能为空', trigger: 'blur' }],
        // domain_ttl: [{ required: true,  message: 'TTL值不能为空', trigger: 'blur' }],
        // the_business: [{ required: true,  type: 'number', message: '业务不能为空', trigger: 'blur' }],
      },
      typeList: [
        { "lable": "A- 将域名指向一个IPv4地址（如：8.8.8.8）", "value": "A" },
        { "lable": "CNAME- 将域名指向另外一个域名", "value": "CNAME" },
        { "lable": "AAAA- 将域名指向一个IPv6地址", "value": "AAAA" },
        { "lable": "NS- 将子域名指向其他DNS服务器解析", "value": "NS" },
        { "lable": "MX- 将域名指向邮件服务器地址", "value": "MX" },
        { "lable": "TXT- 通常做SPF记录（反垃圾邮件）", "value": "TXT" },
        { "lable": "SRV- 记录特定的服务的服务器", "value": "SRV" },
        { "lable": "CAA- CA证书机构颁发授权校验", "value": "CAA" },
        { "lable": "显性URL- 将域名重定向到另外一个地址", "value": "REDIRECT_URL" },
        { "lable": "隐性URL- 与显性URL相似，但会隐藏真实目标地址", "value": "FORWARD_URL" },
      ],
      TTLList: [
        { "lable": "10分钟（600）", "value": 600 },
        { "lable": "30分钟（1800）", "value": 1800 },
        { "lable": "1秒（1），企业版支持", "value": 1 },
        { "lable": "10秒（10），企业版支持", "value": 10 },
        { "lable": "1分钟（60），企业版支持", "value": 60 },
        { "lable": "2分钟（120），企业版支持", "value": 120 },
        { "lable": "1小时（3600）", "value": 3600 },
        { "lable": "12小时（43200）", "value": 43200 },
        { "lable": "1天（86400）", "value": 86400 },
      ],
      lineList: { '默认': 'default', '境外': 'oversea' },
      qlineList: { '默认': '默认', '境外': '境外','中国香港': '中国香港','中国澳门': '中国澳门','中国台湾': '中国台湾' },
      //
      btnDisabled: true,
    }
  },
  methods: {
    handleCancel () {
       this.$emit('drawer-close')
    },

    //
    SubmitRecord () {
      setTimeout(() => {
        optDomainRecords(this.formInline, 'post').then(res => {
          if (res.code == 0) {
            this.$Message.success(res.msg)
            this.handleCancel()
          } else {
            this.$Notice.error(
              {
                title: '添加出错',
                desc: res.msg,
                duration: 5
              }
            )
          }
          this.btnLoading = false
        }).catch(error => {
            this.btnLoading = false
            this.$Message.error('请求数据出错')
          })
      }, 2000)
    },
    handlerSubmitRecord (name) {
      this.btnLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formInline['domain_name'] = this.selectedDomain
          if (this.formInline.domain_rr.indexOf(".") !== -1) {
            this.$Modal.confirm({
              title: '提醒',
              content: '<p>请注意你使用了三级以上的域名，证书可能不支持</p>',
              onOk: () => {
                this.SubmitRecord()
              },
              onCancel: () => {
                this.btnLoading = false
                this.$Message.info('回头是岸~');
              }
            });
          } else {
            this.SubmitRecord()
          }
        } else {
          this.btnLoading = false
          this.$Message.error('表单校验不通过!');
        }
      })
    },
    recordEdit () {
      setTimeout(() => {
        this.formInline['domain_name'] = this.selectedDomain
        optDomainRecords(this.formInline, 'put').then(res => {
          if (res.code == 0) {
            this.$Message.success(res.msg)
            this.handleCancel()
          } else {
              this.$Notice.error(
              {
                  title: '修改出错',
                  desc: res.msg,
                  duration: 5
              }
            )
          }
          this.btnLoading = false
        })
      }, 2000)
    },
    handlerSubmitRecordEdit (name) {
      this.btnLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formInline['domain_name'] = this.selectedDomain
          if (this.formInline.domain_rr.indexOf(".") !== -1) {
            this.$Modal.confirm({
              title: '提醒',
              content: '<p>请注意你使用了三级以上的域名，证书可能不支持</p>',
              onOk: () => {
                this.recordEdit()
              },
              onCancel: () => {
                this.btnLoading = false
                this.$Message.info('回头是岸~');
              }
            });
          } else {
            this.recordEdit()
          }
        } else {
          this.btnLoading = false
          this.$Message.error('表单校验不通过!');
        }
      })
    },
    handlerReset () {
      this.btnLoading = false
      this.formInline = this.$options.data().formInline
    },
  },
  watch: {
    cloud_name (val) {
      if (val == 'qcloud' || val == 'dnspod') {
          if (this.formInline.line == 'default') {
          this.formInline.line == '默认'
        }
      }
    },
  },
  computed: {
  },
  mounted () {
  }

}
</script>

