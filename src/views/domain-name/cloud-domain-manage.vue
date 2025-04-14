<template>
  <Card>
    <div v-if="!selectedDomain">
      <Alert type="success">
          <h3>【提醒通知】：</h3>
      </Alert>

      <div class="search-con search-con-top">
        <Input class="search-input" v-model="initPara.searchVal" search :maxlength='80' @on-search="handleSearch"  placeholder="输入关键字搜索"/>
        <ButtonGroup class="search-btn">
          <template v-if="selectList.length == 0">
            <Button disabled >暂停</Button>
            <Button disabled >启用</Button>
            <Button disabled >删除</Button>
          </template>
          <template v-else>
            <Button @click="handlerDomainPause">暂停</Button>
            <Button @click="handlerDomainEnable">启用</Button>
            <Button @click="handlerDomainDel">删除</Button>
          </template>
          <Button type="success" class="search-btn" @click="handlerDomainAdd">添加域名</Button>
          <Button @click="handlerDomainSync">同步</Button>
          <Button @click="handlerDomainDoc">说明文档</Button>
        </ButtonGroup>
      

        <Table ref="selection"  :columns="columnsDomain" :data="tableData"  @on-sort-change="handleSort" 
          @on-selection-change="handleSelectChange"></Table>
      </div>

      <template>
         <domain-detail :modalData="modalData" :domainData="domainData"></domain-detail>
      </template>

      <template>
         <domain-edit  :modalEditData="modalEditData" :domainData="domainData" @modal-close="handlerModalClose"></domain-edit>
      </template>
      </div>

      <template v-else>
         <domain-records ref="domainRecords" :selectedDomain="selectedDomain" :cloud_name="cloud_name" :needPriority="needPriority"
          @domain-show="handlerShowDomains" ></domain-records>
      </template>

  </Card>
</template>

<script>
import {getDomain, optDomain, syncDomain} from '@/api/domain/domain.js'
import domainDetail from './components/domain-detail'
import domainEdit from './components/domain-edit'
import domainRecords from './domain-records'
export default {
  components: { domainDetail, domainEdit, domainRecords},
  data() {
   return {
    //设置/编辑
    modalEditData: {
      show: false,
      title: '域名设置',
      action: 'put'
    },
    //详情
    modalData: {
      show: false,
      title: '域名详情'
    },
    domainData: {},
    //
    cloud_name:'',
    selectedDomain: '', //选中的域名
    selectList: [],
    needPriority: 'false',
    // searchValue: '', //域名查找
    initPara: {
      page_number: 1,
      page_size: 300,
      searchVal: null,
      order_by: "star_mark",      //排序字段
      order: "descend", //排序 ascend descend
    },
    //
    showAll: false,

    tableData: [],
    columnsDomain: [
      {
        type: 'selection',
        key: '',
        width: 65,
        align: 'center'
      },
      {
      title: '域名',
      key: 'domain_name',
      sortable: true,
        render: (h, params) => {
            const fav = params.row.star_mark
            const style = !fav ? { cursor: 'pointer' } : { cursor: 'pointer', color: '#f50'}

            return h('div', [
                h('Icon', {
                    style: style,
                    props: {
                        type: !fav ? 'ios-star-outline' : 'ios-star'
                    },
                    nativeOn: {
                        click: () => {
                            this.handlerStarMark(params.row, params.index);
                        }
                    }
                }),
                h('a',{
                on: {
                  click: () => {
                      this.handlerCheckDomain(params.row)
                    }
                  }
                },'  ' +params.row.domain_name
              )
            ]);
        }
      },
      {
        title: '记录数',
        key: 'record_count',
        align: 'center',
        sortable: true,
        width: 120,
      },
      {
        title: 'DNS状态',
        key: 'state',
        width: 100,
        align: 'center',
        render: (h, params) => {
            let state = params.row.domain_state
            if (state == '正常' ) {
              return h('div', [
                h('Tag', { props: { color: 'green' } }, state)
              ])
            } else if (state == '手动' ) {
              return h('div', [
                h('Tag', { props: { color: 'blue' } }, state)
            ])
            }else{ return h('div', [ h('Tag', { props: { color: 'error' } }, state)]) }
          }
      },
      {
        title: '厂商',
        key: 'cloud_name',
        width: 100
      },
      {
        title: '版本',
        key: 'version',
        sortable: true,
        tooltip: true,
        width: 130
      },
      {
        title: '',
        key: '',
        width: 110,
        render: (h, params) => {
          return h('div', [
            h('a',{
              style: {
                  marginRight: '5px'
              },
              on: {
                click: () => {
                    this. handlerDomainDetail(params.row)
                  }
                }
              },'详情'
            ),
            h('a',{
              on: {
                click: () => {
                    this. handlerDomainEdit(params.row)
                  }
                }
              },'设置'
            )
          ])
        }
      },
    ]
   }
  },
  methods: {
    async handleGetData() {
      const res = await getDomain(this.initPara);
      if (res.code == 0) {
        this.tableData = res.data;
      } else {
        this.$Message.error(res.msg)
      }
    },
    //
    handlerDomainPause() {
       this.$Message.error('这么危险的功能还是不开放了')
    },
    handlerDomainEnable() {
       this.$Message.error('这么危险的功能还是不开放了')
    },
    handlerDomainDoc() {
       this.$Message.info('要啥子自行车')
    },
    handlerShowDomains() {
      this.selectedDomain = null
    },

    handlerDomainDel() {
      this.$Modal.confirm({
        title: '提醒',
        content: '<p>是否要删除选择的域名，本删除仅为平台删除记录。</p>',
        onOk: () => {
            optDomain( {id_list: this.selectList}, 'delete' ).then(res => {
              if (res.code == 0) {
                this.handleGetData()
                this.selectList = []
              } else {
                this.$Message.error( res.msg )
            }})            
          },
          onCancel: () => {
            this.$Message.info('回头是岸');
          }                       
        });
    },
    //
    handleSelectChange (val) {
      let selectIdList = []
      val.forEach(item => {
        selectIdList.push(item.id.toString())
      })
      this.selectList = selectIdList
    },
    // 选中域名
    handlerCheckDomain (paramsRow) {
      this.selectedDomain = paramsRow.domain_name
      this.cloud_name = paramsRow.cloud_name
      this.needPriority = paramsRow.version == 'Alibaba Cloud DNS' ? 'true' : 'false'
    },
    // 星标
    handlerStarMark (paramsRow, index) {
      let star_mark = !this.tableData[index].star_mark
      //
      optDomain({"star_mark": star_mark, "id": paramsRow.id}, 'patch').then(res => {
        if (res.code == 0) {
          this.handleGetData()
        } else {
           this.$Message.error( res.msg )
        }})
        //
    },
    // 查看详细信息
    handlerDomainDetail(paramsRow) {
      this.domainData = paramsRow
      this.modalData.show = true
    },
    // 设置详细信息
    handlerDomainEdit(paramsRow) {
      this.domainData = paramsRow
      this.modalEditData.show = true
      this.modalEditData.action = 'put'
    },
    //当厂商没有API的时候使用，仅记录
    handlerDomainAdd() {
      this.domainData.is_used = true
      this.modalEditData = {
        show: true,
        title: '当厂商没有API的时候用来记录，本身不提供解析功能',
        action: 'post'
      }
    },
    handlerDomainSync() {
      this.$Modal.confirm({
        title: '提醒',
        content: '<p>手动触发获取厂商相关信息更新到域名管理系统，</p>\
                  <p>点击确认进行拉取，请耐心稍等一下，不要重复点击，详细信息可查看同步日志</p>',
        onOk: () => {
          this.$Spin.show();
            setTimeout(() => {
              syncDomain().then( res => {
                if (res.code == 0) {
                  this.handleGetData()
                  this.$Message.success(res.msg)
                } else {
                  this.$Message.error( res.msg )
                }
                this.$Spin.hide();
              }).catch(error => {
                this.$Spin.hide();
                this.$Message.error({
                  content: '同步结束',
                  duration: 10
                })
              })             
            }, 3000);
          },
          onCancel: () => {
            this.$Message.info('回头是岸');
          }                       
        });
    },
    handlerChangeShow() {
      this.showAll = !this.showAll
    },
    handlerModalClose(){
      this.handleGetData()
    },
    handleSort (column, key, order) {
    this.initPara.order = column.order === "asc" ? 'ascend' : 'descend'
    this.initPara.order_by = column.key
    this.handleGetData()
    },
    handleSearch () {
       this.handleGetData()
    },
  },
  watch: {
  },
  
  mounted() {
    this.handleGetData()
  }
}
</script>


<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
    }
    &-col-1 {
      display: inline-block;
      margin-left: 5px;
    }
    &-input {
      display: inline-block;
      width: 300px;
      margin-left: 0px;
    }
    &-btn {
      margin-left: 10px;
    }
    &-add-btn {
      margin-right: 10px;
    }
  }
}
</style>