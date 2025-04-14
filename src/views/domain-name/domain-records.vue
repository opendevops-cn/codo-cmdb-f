<template>
  <div>
    <div>

      <div style="padding: 10px 0 15px 0;">
        <h2>
          <b>
            <Icon style="cursor: pointer" type="ios-undo" @click="handlerGoDomain"></Icon> {{selectedDomain}}
          </b>
        </h2>
      </div>

      <Alert type="success" show-icon>修改域名解析属于高危操作，一定要谨慎行事！</Alert>

      <div class="search-con search-con-top">

        <Input class="search-input" v-model="initPara.searchVal" search :maxlength='50' @on-search="handleSearch"  placeholder="输入关键字搜索" />
        <ButtonGroup class="search-btn-right">
          <Button type="success" @click="handleAdd" :loading="btnLoading">添加记录</Button>
          <Button v-if="needPriority == 'true'" @click="">同步权重</Button>
          <Button v-if="needPriority == 'true'" @click="" >权重配置</Button>
          <Button @click="handleShowLog" :loading="btnLoading">日志</Button>
          <Button :loading="btnLoading" @click="handlerExportData()">批量导出</Button>
        </ButtonGroup>

      </div>

      <Table size="small" ref="selection" width="700px" :columns="columnsRecord" :data="tableData"  @on-sort-change="handleSort" @on-selection-change="handleSelect" ></Table>
      <div style="margin: 10px; overflow: hidden">

        <div style="float: left;">
          <ButtonGroup class="search-btn">
            <Button :loading="btnLoading" :disabled="btnDisabled" @click="handlerDomainPause">禁用</Button>
            <Button :loading="btnLoading" :disabled="btnDisabled" @click="handlerDomainEnable">启用</Button>
            <Button :loading="btnLoading" :disabled="btnDisabled" @click="handleDel">删除</Button>
            <Button :loading="btnLoading" :disabled="btnDisabled" @click="handlerShowChangeBiz">更换业务</Button>
          </ButtonGroup>
        </div>
        <div style="float: right;">
             <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
          :page-size-opts="[15, 50, 100, 1000]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
        </div>
      </div>
    </div>

    <Modal width="650px;" v-model="modalRemark.show" :title="modalRemark.title" :footer-hide=true>
      <Input type="text" v-model="modalRemark.remark" :maxlength='50' placeholder="请输入需要记录的备注信息"></Input>
      <Button type="success" style="margin-top: 10px;" :loading="btnLoading" @click="handlerChangeRemark" long>确定修改</Button>
    </Modal>


    <Modal v-model="modalDel" width="400" @on-cancel="handlerDelCancel">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除选中的域名解析记录</span>
      </p>
      <div style="text-align:center">
        <p>此删除会导致选中无法解析，请谨慎操作！</p>
        <p>当真要删除吗！</p>
      </div>

      <div style="padding: 10px 0 0 0;">
        <Input class="search-input" v-model="delRecordCheckValue" clearable :maxlength='250' placeholder="输入当前的根域名校验一下" />
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading" @click="handlerDelRecord">删除</Button>
      </div>
    </Modal>
    <record-edit ref="recordEdit" :modalData="modalData"  :cloud_name="cloud_name" @drawer-close="handleClose"></record-edit>
    <opt-log ref="optLog" :modalData="logModal"></opt-log>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getDomainRecords, optDomainRecords, recordsChangeRemark } from '@/api/domain/domain.js'
import recordEdit from './components/record-edit.vue'
import optLog from './components/opt-logs.vue'
export default {
  name: 'domainRecords',
  components: { recordEdit, optLog },
  props: {
    selectedDomain: {
      type: String,
      default: ''
    },
    needPriority: {
      type: String,
      default: 'false'
    },
    cloud_name: {
      type: String,
      default: 'aliyun'
    }
  },
  data () {
    return {
      delRecordCheckValue: '',
      modalDel: false,
      modalRemark: {
        show: false,
        title: '修改备注',
        remark: '',
        select_id: null
      },
      modalbiz: {
        show: false,
        title: '更换业务',
      },
      modalData: {
        show: false,
        action: 'post',
        title: '添加解析记录',
      },
      //
      logModal: {
        show: false,
        title: '操作日志',
      },
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
      selectBusinessId: null,
      btnDisabled: true,
      selectList: [],

      // 分页
      i: {
          pageTotal: 0,
          tableLoading: true
      },
      initPara: {
          page_number: 1,
          page_size: 15,
          searchVal: null,
          order_by: "",      //排序字段
          order: "ascend", //排序 ascend descend
      },
      tableData: [],
      columnsRecord: [
        {
          type: 'selection',
          key: '',
          width: 65,
          align: 'center'
        },
        {
          title: '主机记录',
          key: 'domain_rr',
          sortable: true,
          minWidth: 110
        },
        {
          title: '记录类型',
          key: 'domain_type',
          align: 'center',
          sortable: true,
          width: 110
        },
        {
          title: '线路',
          width: 100,
          key: 'line',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            let line = params.row.line
            if (line === 'default') {
              return h('span', {}, '默认')
            } else if (line === 'oversea') {
              return h('span', {}, '海外')
            } else { return h('span', {}, line) }
          }
        },
        {
          title: '记录值',
          key: 'domain_value',
          sortable: true,
          minWidth: 150,
          render: (h, params) => {
            let domain_mx = params.row.domain_mx
            if (params.row.domain_type === 'MX') {
              return h('span', {}, params.row.domain_value + ' | ' + domain_mx)
            } else { return h('span', {}, params.row.domain_value) }
          }
        },
        {
          title: 'TTL',
          key: 'domain_ttl',
          align: 'center',
          sortable: true,
          width: 100,
        },
        {
          title: '权重',
          key: 'weight',
          align: 'center',
          sortable: true,
          width: 100,
        },
        {
          title: '状态',
          key: 'state',
          width: 100,
          sortable: true,
          align: 'center',
          render: (h, params) => {
            let state = params.row.state
            if (state == 'ENABLE' || state == 'enable' || state == 'enabled') {
              return h('div', [
                h('Tag', { props: { color: 'green' } }, '正常')
              ])
            } else if (state == 'default') {
              return h('div', [
                h('Tag', { props: { color: 'blue' } }, '默认')
              ])
            } else if (state == 'DISABLE' || state == 'disable') {
              return h('div', [
                h('Tag', { props: { color: 'blue' } }, '暂停')
              ])
            } else { return h('div', [h('Tag', { props: { color: 'error' } }, state)]) }
          }
        },
        {
          title: '备注',
          key: 'remark',
          width: 150,
          
        //   render: (h, params) => {
        //     return h('Tooltip', {
        //       props: { placement: 'top' }
        //     }, [
        //       h('icon', {
        //         props: {
        //           type: 'ios-help-circle',
        //           // size: 'small'
        //         },
        //         style: {
        //           marginRight: '1px'
        //         }
        //       }),
        //       h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.remark)
        //     ])
        //   }
        },
        {
          title: '',
          key: '',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row)
                  }
                }
              }, '修改'
              ),
              h('a', {
                on: {
                  click: () => {
                    this.handlerShowChangeRemark(params.row)
                  }
                }
              }, '备注'
              )
            ])
          }
        },
      ],
      //
    }
  },
  methods: {
    handleGetData () {
      this.initPara['domain_name'] = this.selectedDomain
      getDomainRecords(this.initPara).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.i.pageTotal = res.count;
        } else {
          this.$Message.error(res.msg)
          this.tableData = []
        }
      })
    },
    //
    handleClose () {
      this.handleGetData()
      this.selectList = []
      this.modalData.show = false
      this.btnLoading = false
      this.modalDel = false
    },
    // 返回
    handlerGoDomain () {
      this.$emit('domain-show')
    },
    //
    handleSelect (val) {
      let selectIdList = []
      val.forEach(item => {
        selectIdList.push(item.id.toString())
      })
      this.selectList = selectIdList
    },
    // 添加记录弹出
    handleAdd () {
      // this.formInline = this.$options.data().formInline
      this.$refs.recordEdit.formInline = this.$options.data().formInline
      this.$refs.recordEdit.selectedDomain = this.selectedDomain
      this.modalData = {
        show: true,
        action: 'post',
        title: `添加 ${this.selectedDomain} 解析记录，有API的域名会生效，请谨慎操作！`,
      }
    },
    // 编辑记录 弹出
    handleEdit (paramsRow) {
      // this.formInline = paramsRow
      this.$refs.recordEdit.formInline = paramsRow
      this.$refs.recordEdit.selectedDomain = this.selectedDomain

      this.modalData = {
        show: true,
        action: 'put',
        title: `修改 ${this.selectedDomain} 解析记录，有API的域名会生效，请谨慎操作！`,
      }
    },
    //禁用
    handlerDomainPause () {
      if (this.selectList.length > 10) {
        this.$Message.error(`一次禁用不能超过十个`)
        return
      }
      //
      this.$Modal.confirm({
        title: '提醒',
        content: '<p>禁用相关的域名解析记录，禁用会导致选中无法解析，请谨慎操作！</p>',
        onOk: () => {
          setTimeout(() => {
            optDomainRecords({ id_list: this.selectList, action: 'disable', domain_name: this.selectedDomain }, 'patch').then(res => {
              if (res.code == 0) {
                this.$Message.success(res.msg)
                this.handleClose()
              } else {
                this.$Message.error(res.msg)
              }
            }).catch(error => {
              this.$Message.error({
                content: JSON.stringify(error.response),
                duration: 10
              })
            })
          }, 1000);
        },
        onCancel: () => {
          this.$Message.info('回头是岸~');
        }
      });
      //

    },
    handlerDomainEnable () {
      if (this.selectList.length > 10) {
        this.$Message.error(`一次启用不能超过十个`)
        return
      }
      //
      this.$Modal.confirm({
        title: '提醒',
        content: '<p>启用相关的域名解析记录，会导致禁用的域名可以解析，请谨慎操作！</p>',
        onOk: () => {
          setTimeout(() => {
            optDomainRecords({ id_list: this.selectList, action: 'enable', domain_name: this.selectedDomain }, 'patch').then(res => {
              if (res.code == 0) {
                this.$Message.success(res.msg)
                this.handleClose()
              } else {
                this.$Message.error({
                  content: JSON.stringify(res.msg),
                  duration: 5
                })
              }
            })
          }, 1000);
        },
        onCancel: () => {
          this.$Message.info('回头是岸~');
        }
      });
      //
    },
    handlerDelCancel () {
      this.$Message.info('回头是岸~');
    },
    handlerDelRecord () {
      if (this.delRecordCheckValue !== this.selectedDomain) {
        this.$Message.error(`请输入正确的根域名，谢谢！`)
        return
      }
      this.btnLoading = true
      setTimeout(() => {
        optDomainRecords({ id_list: this.selectList, domain_name: this.selectedDomain }, 'delete').then(res => {
          if (res.code == 0) {
            this.$Message.success(res.msg)
            this.handleClose()
          } else {
            this.btnLoading = false
            this.$Message.error({
              content: res.msg,
              duration: 5
            })
          }
        }).catch(error => {
          this.btnLoading = false
          this.$Message.error({
            content: JSON.stringify(error.response),
            duration: 10
          })
        })
        this.btnLoading = false
        this.modalDel = false
      }, 1000);
    },
    handleDel () {
      if (this.selectList.length > 5) {
        this.$Message.error(`一次删除不能超过五个`)
        return
      }
      this.modalDel = true
    },
    handlerShowChangeBiz () {
      this.$Message.error(`暂未实现`)
      // this.modalbiz.show = true
      // this.selectBusinessId = null
    },
    handlerChangeBiz () {
      if (!this.selectBusinessId) {
        this.$Message.info('请选择一个业务吧');
        return
      }
      let theData = { id_list: this.selectList, business_id: this.selectBusinessId, domain_name: this.selectedDomain }
      this.btnLoading = true
      setTimeout(() => {
        optDomainRecords(theData).then(res => {
          if (res.code == 0) {
            this.$Message.success(res.msg)
            this.handleGetData()
            this.selectList = []
            this.modalbiz.show = false
            this.btnLoading = false
          } else {
            this.$Message.error(res.msg)
          }
        })
        this.btnLoading = false
      }, 1000);
      //
    },
    handlerShowChangeRemark (paramsRow) {
      this.modalRemark = {
        show: true,
        title: '修改备注',
        select_id: paramsRow.id,
        remark: paramsRow.remark
      }
    },
    handlerChangeRemark () {
      this.btnLoading = true
      setTimeout(() => {
        let theData = { id: this.modalRemark.select_id, remark: this.modalRemark.remark }
        recordsChangeRemark(theData).then(res => {
          if (res.code == 0) {
            this.$Message.success(res.msg)
            this.handleGetData()
            this.modalRemark = this.$options.data().modalRemark
            this.btnLoading = false
          } else {
            this.$Message.error(res.msg)
          }
        })
        this.btnLoading = false
      }, 1000);
    },
    handleShowLog () {
      this.$refs.optLog.initPara.domain_name= this.selectedDomain
      this.logModal.show = true
      this.$refs.optLog.handleGetData()
    },
    handlerExportData () {
      let nowTime = Date.parse(new Date())
      // let tableDataTemp = this.tableDataRecord.filter((data, index) => {
      //   // data['show_account'] = data.show_account['value']
      // })
      this.$refs.selection.exportCsv({
        filename: `DNS信息-${nowTime}`,
        // data: tableDataTemp,
        column: this.columnsRecord
      });
      this.handleGetData()
    },
     handleSearch() {
        this.initPara.page_number = 1;
        this.handleGetData();
    },
    handleSort (column, key, order) {
        this.initPara.order = column.order === "asc" ? 'ascend' : 'descend'
        this.initPara.order_by = column.key
        this.handleGetData()
      },
    // 分页
    handlerChangePage(value) {
        this.initPara.page_number = value;
        this.handleGetData();
    },
    handlePageSize(value) {
        this.initPara.page_number = 1;
        this.initPara.page_size = value;
        this.handleGetData();
    },
  },
  watch: {
    selectList (val) {
      if (this.selectList.length > 0) {
        this.btnDisabled = false
      } else {
        this.btnDisabled = true
      }
    },
    cloud_name (val) {
      if (val == 'qcloud' || val == 'dnspod') {
          if (this.formInline.line == 'default') {
          this.formInline.line == '默认'
        }
      }
    },
  },
  computed: {
    ...mapState({
      rules: state => state.user.rules,
    })
  },
  mounted () {
    this.handleGetData()
  }

}
</script>

<style lang="less" scoped>
.top,
.bottom {
  text-align: center;
}
.center {
  width: 300px;
  margin: 10px auto;
  overflow: hidden;
}
.center-left {
  float: left;
}
.center-right {
  float: right;
}

.search-con {
  padding: 5px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 350px;
      margin-left: 2px;
    }
    &-btn {
      margin-right: 0px;
      // float: right;
    }
    &-btn-right {
      margin-right: 0px;
      float: right;
    }
  }
}
</style>
