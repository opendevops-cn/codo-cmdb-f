<template>
   <div>
    <Card v-if="!showEdit" dis-hover :bordered="false">
      <Alert type="success" show-icon>
          使用说明：
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
          <template slot="desc">制定动态规则，根据规则把资源划分到对应的拓扑中。</template>
        </Alert>
      <div>
        <div class="search-con search-con-top">
          <Input class="search-input"  v-model="initPara.searchVal" search @on-search="handleSearch"  @keydown.enter.native="handleSearch" placeholder="输入关键字全局搜索" />
          <Button  @click="handleAdd" class="search-btn">添加动态规则</Button>
        </div>

        <Table size="small"  :columns="columns" :data="tableData" :loading="i.tableLoading"></Table>
        <!-- 分页 -->
        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
            <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
              :page-size-opts="[15, 50, 100]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
          </div>
        </div>
      </div>
      
    </Card>
    <rule-edit v-else :formData="theData"  @save-data="handleSaveData"  @edit-close="handleClose" />
    <pre-view-asset :modalData="modalData"  ref="preview" @preview-close="handleClose" @refresh="handleRefresh" @clean="handleClean"/>
  </div>
</template>

<script>
import { optDynamicRuleAsset, getDynamicRules, optDynamicRule} from "@/api/dynamic_rule";
import preViewAsset from "./components/preview-asset.vue";
import ruleEdit from './components/rule-edit.vue'

export default {
  components: {
    ruleEdit,
    preViewAsset,
    // VueJsonPretty,
  },
  data() {
    return {
      jsonData: {},
      modalVisible: false,
      delViewModal: false,
      treeData: [],
      tableData: [],
      columns: [
        {
          type: "selection",
          title: "selection",
          key: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "规则名称",
          key: "name",
          minWidth: 130,
          maxWidth: 300,
        },
        {
          title: "源类型",
          key: "asset_type",
          minWidth: 110,
          maxWidth: 140,
          align: "center",
        },
        {
          title: "规则",
          key: "condition_list",
          align: "center",
          minWidth: 300,
          render: (h, params) => {
            let condition_list = JSON.parse(JSON.stringify(params.row.condition_list))
            return h('div',[
            Object.values(condition_list).map((item)=>{
                return h('p', `资源${params.row.asset_type}的[${item.src_type}]字段 通过[${item.src_operator}] 匹配关键字[${item.src_content}] `)
              })
          ])
          },
        },
        {
          title: "动作",
          key: "des_data",
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            let des_data = params.row.des_data
            let msg 
            if ( des_data.length >= 1) {
              msg =  `划分到${params.row.asset_type} ${des_data[0]}`
            }
            if ( des_data.length >= 2) {
              msg =  `划分到${params.row.asset_type} ${des_data[0]} / ${des_data[1]} `
            }
            if ( des_data.length >= 3) {
              msg =  `划分到${params.row.asset_type} ${des_data[0]} / ${des_data[1]} / ${des_data[2]}`
            }
            if ( des_data.length >= 4) {
              msg = `划分到${params.row.asset_type} ${des_data[0]} / ${des_data[1]} / ${des_data[2]} / ${des_data[3]}`
            }
        
            return h("div", [
               h('div', {
                style: {
                  marginTop: '5px',
                  marginBottom: '3px'
                },
              }, msg
              ),
            ]);
          },
        },
        {
          title: "修改人",
          key: "modify_user",
          align: "center",
          minWidth: 120,
          maxWidth: 160,
        },
        {
          title: '更新时间',
          key: '',
          minWidth: 170,
          maxWidth: 220,
          render: (h, params) => {
            return h("div", [
              // h('div', {
              //   style: {
              //     marginTop: '3px'
              //   },
              // }, `创建：${params.row.create_time}`
              // ),
               h('div', {
                style: {
                  marginTop: '5px',
                  marginBottom: '3px'
                },
              }, `${params.row.update_time}`
              ),
            ]);
          },
        },
        {
          title: "操作",
          key: "handle",
          minWidth: 170,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.handlePreview(params.row);
                    },
                  },
                },
                "刷新"
              ),
              h(
                "a",
                {
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.handleClone(params.row)
                    },
                  },
                },
                "克隆"
              ),
              h(
                "a",
                {
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row)
                    },
                  },
                },
                "编辑"
              ),

              h(
                "a",
                {
                  style: {
                    color: 'red',
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.handleDel(params.row)
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      //
      modalData: {
        show: false,
        title: '刷新动态规则',
        id: null,
        name:'',
        action: 'put'
      },
      action: 'post',
      showEdit: false,
      selectList: [],
      theData: {},
      initForm: {
        des_type: '业务',
        des_data: null,
        interval: 'no',
        condition_list: {
          0: {
            src_type: 'name',  //源字段
            src_operator: '==',
            src_content: ''
          }
        },
      },
      initPara:{
        page_number: 1,
        page_size: 15,
        searchVal: null,
      },
      i:{
        pageTotal: 0, //总数
        tableLoading: false
      },
    };
  },
  methods: {
    // 获取
    async handleGetData() {
      const res = await getDynamicRules(this.initPara);
      if (res.code == 0) {
        this.tableData = res.data;
        this.i.pageTotal = res.count
      } else {
        this.$Message.error(res.msg)
      }
    },
    handleClose () {
      this.showEdit = false
      this.modalData.show = false
      this.handleGetData()
      this.selectList = []
    },
    handleAdd () {
      this.action = 'post'
      this.showEdit = true
      this.theData = Object.assign(this.$options.data().theData, this.initForm)
    },
    handleEdit (paramsRow) {
      this.action = 'put'
      this.showEdit = true
      this.theData = paramsRow
    },
    handleClone (paramsRow) {
      this.action = 'post'
      this.showEdit = true
      delete paramsRow.id
      paramsRow.name = `${paramsRow.name}-副本`
      this.theData = paramsRow
    },
    // 保存
    handleSaveData (saveData) {
      console.info(saveData)
      optDynamicRule(saveData, this.action).then(res => {
        console.info(res)
        if (res.code == 0) {
          this.$Message.success('成功')
          this.handleClose()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 删除
    handleDel(paramsRow) {
      this.$Modal.confirm({
        title: "提醒",
        content: `<p>确认要删除规则  ${paramsRow.name} 之后无法找回, 请谨慎操作!</p>`,
        // loading: true,
        onOk: () => {
          optDynamicRule({ id_list: [paramsRow.id] }, "delete").then((res) => {
            if (res.code === 0) {
              this.$Notice.success({ title: `${res.msg}` });
              this.handleGetData();
            } else {
              this.$Notice.error({ title: `${res.msg}` });
            }
          });
        },
        onCancel: () => {
          this.$Message.info("回头是岸~");
        },
      });
    },

    // 预览动态分组主机
    // handleClone(paramsRow) {
    // },
    async handlePreview(paramsRow) {
      this.modalData.show = true
      this.modalData.name = paramsRow.name
      this.modalData.id = paramsRow.id
      this.$refs.preview.handleGetData(paramsRow.id)
    },
    async handleRefresh(data) {
      let res = await optDynamicRuleAsset(data, 'put')
      if (res.code === 0) {
        this.$Notice.success({ title: `${res.msg}` });
        this.handleClose()
      } else {
        // @ts-ignore
        this.$Notice.error({ title: `${res.msg}` });
      }
    },
    //清理拓扑关系
    async handleClean(data){
      this.spinShow = true;

      try {
        let res =  await optDynamicRuleAsset(data, 'delete')
        // @ts-ignore
        if (res.code !== 0) {
          this.$Message.error(`${res.msg}`);
          return;
        }
        this.$Message.info(`${res.msg}`);
        this.handleClose()
      } catch (e) {
        this.$Message.error(e.toString());
      } finally {
        this.spinShow = false;
      }
    },
    handleSelect (val) {
      let selectIdList = []
      val.forEach(item => {
        selectIdList.push(item.id)
      })
      this.selectList = selectIdList
    },
    handleSearch(){
      this.initPara.page_number = 1
      this.handleGetData()
    },
    // 分页
    handlerChangePage (value) {
      this.initPara.page_number = value
      this.handleGetData()
    },
    handlePageSize (value) {
      this.initPara.page_number = 1
      this.initPara.page_size = value
      this.handleGetData()
    },
  },
  // computed: {
  //   ...mapState({
  //     theBusinessID: (state) => state.project.theBusinessID,
  //   }),
  // },
  watch: {

  },
  mounted() {
    this.handleGetData();
  },
};
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
      width: 400px;
      margin-left: 2px;
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
<style>
.demo-drawer-footer {
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
