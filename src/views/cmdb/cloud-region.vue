<template>
   <div>
    <Card v-if="!showEdit" dis-hover :bordered="false">
      <Alert type="success" show-icon>
          使用说明：
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
          <template slot="desc">
            <p>云区域是主机内网的逻辑区域划分，跨云区域之间的主机不可以通过内网直接互相访问，默认主机属于直连区域。</p>
            <p>云区域关联云主机使用vpc自动添加，同一组云区域vpc不能超十五个。</p>
            <p>云区域同步关联的主机到堡垒机，需要指定堡垒机组织【Default组织ID】、网域、账号模板信息，普通、特权账号分别对应开发、运维账号。</p>
            <p>创建云区域后，需要在云区域节点上部署 agent proxy，并同步云区域信息到节点管理，用于agent自动部署。</p>
            <p>实例只能存在于一个云区域内</p>
          </template>
        </Alert>
      <div>
        <div class="search-con search-con-top">
          <Input class="search-input"  v-model="initPara.searchVal" search :maxlength="50" @on-search="handleSearch"  placeholder="输入关键字全局搜索" />
           <ButtonGroup class="search-btn">
            <Button  @click="handleAdd">添加云区域</Button>
            <!-- <Button type="" @click="handleAdd">部署Agent代理</Button> -->
            <Button @click="" :disabled="selectList.length !== 0 ? false : true" >同步至节点管理</Button>
          </ButtonGroup>
        </div>

        <Table size="small"  :columns="columns" :data="tableData" :loading="i.tableLoading"  
          @on-sort-change="handleSort"  @on-selection-change="handleSelect"></Table>

        <!-- 分页 -->
        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
            <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
              :page-size-opts="[15, 50, 100]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
          </div>
        </div>
      </div>
      
    </Card>
    <cloud-region-edit v-else :formData="theData"  @save-data="handleSaveData"  @edit-close="handleClose" />
    <template v-if="modalData.name">
      <region-asset :modalData="modalData" @close="handleClose" @relevance="handleRelevance" />
    </template>
    <region-asset-preview  :modalData="modalPreview"  ref="assetPreview" @close="handleClose" @relevance="handleRelevance" @del="handleReDel" />
  </div>
</template>

<script>
import { optCloudRegion, getCloudRegion, optCloudRegionPro } from "@/api/cloud-region.js";
import cloudRegionEdit from './components/cloud-region-edit.vue'
import regionAsset from './components/region-asset.vue'
import regionAssetPreview from './components/region-asset-preview.vue'
import { getCloudSettinglist } from '@/api/cmdb';

export default {
  components: {
    cloudRegionEdit,
    regionAsset,
    regionAssetPreview
  },
  data() {
    return {
      modalPreview: {
        show: false,
        title: '预览云区域主机',
        name: ''
      },
      modalData: {
        show: false,
        title: '添加主机到当前云区域',
        id: null,
        name:'',
        action: 'put'
      },
      action: 'post',
      showEdit: false,
      selectList: [],
      cloudList: [],
      theData: {},
      initForm: {
        asset_group_rules: [
          [{
            query_name: "vpc",
            query_conditions: "=", //条件 like = !=
            query_value: [], //值
            index: 1,
            status: 1
          }]],
        accounts: [
          {account_type: "dev",
            jms_account_template_id: "",
            index: 1,
            status: 1
          }],
        auto_update_agent_id: "no",
      },
      initPara:{
        page_number: 1,
        page_size: 50,
        searchVal: null,
        order_by: "name",      //排序字段
        order: "ascend", //排序 ascend descend
      },
      i:{
        pageTotal: 0, //总数
        tableLoading: true
      },
      tableData: [],
      columns: [
        {
          type: "selection",
          key: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "云区域ID",
          key: "cloud_region_id",
          minWidth: 110,
          maxWidth: 140,
          sortable: true,
        },
        {
          title: "云区域名称",
          key: "name",
          minWidth: 170,
          maxWidth: 300,
          sortable: true,
          // render: (h, params) => {
          //   return h(
          //     "a",
          //     {
          //       on: {
          //         click: () => {
          //           this.$Message.success('这是设计agent节点管理的地方')
          //         },
          //       },
          //     },
          //     params.row.name
          //   );
          // },
        },
        {
          title: "代理IP",
          key: "proxy_ip",
          minWidth: 130,
          maxWidth: 180,
          align: "center",
          sortable: true,
        },
          {
          title: "SSH IP",
          key: "ssh_ip",
          minWidth: 130,
          maxWidth: 180,
          align: "center",
          sortable: true,
        },
        {
          title: "状态",
          key: "state",
          minWidth: 110,
          maxWidth: 140,
          align: "center",
          sortable: true,
        },
        {
          title: "备注",
          key: "detail",
          minWidth: 200,
          tooltip: true
        },
        {
          title: '更新时间',
          key: "update_time",
          minWidth: 170,
          maxWidth: 210,
          sortable: true,
        },
        {
          title: "操作",
          key: "handle",
          minWidth: 230,
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
                      this.handlePreview(params.row)
                    },
                  },
                },
                "预览"
              ),
              // h(
              //   "a",
              //   {
              //     style: {
              //       marginRight: "10px",
              //     },
              //     on: {
              //       click: () => {
              //         this.handleAddAsset(params.row)
              //       },
              //     },
              //   },
              //   "添加主机"
              // ),
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
    };
  },
  methods: {
    // 获取
    async handleGetData() {
      const res = await getCloudRegion(this.initPara);
      if (res.code == 0) {
        this.tableData = res.data;
        this.i.pageTotal = res.count
      } else {
        this.$Message.error(res.msg)
      }
      this.i.tableLoading = false
    },
    handleClose () {
      this.showEdit = false
      this.modalData.show = false
      this.modalPreview.show = false
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
      // 兼容一下历史数据
      if (!paramsRow.asset_group_rules) {
        paramsRow.asset_group_rules = this.initForm.asset_group_rules
      }
      if (!paramsRow.accounts) {
        paramsRow.accounts = this.initForm.accounts
      }
      this.theData = paramsRow
    },
    handleClone (paramsRow) {
      this.action = 'post'
      this.showEdit = true
      delete paramsRow.id
      paramsRow.name = `${paramsRow.name}-副本`
      // 兼容一下历史数据
      if (!paramsRow.asset_group_rules) {
        paramsRow.asset_group_rules = this.initForm.asset_group_rules
      }
      this.theData = paramsRow
    },
    // 保存
    handleSaveData (saveData) {
      optCloudRegion(saveData, this.action).then(res => {
        if (res.code == 0) {
          this.$Notice.success({ title: `${res.msg}` });
          this.handleClose()
        } else {
          this.$Notice.error({ title: `${res.msg}` });
        }
      })
    },
    // 删除
    handleDel(paramsRow) {
      this.$Modal.confirm({
        title: "提醒",
        content: `<p>确认要删除云区域 《${paramsRow.name}》 之后无法找回, 请谨慎操作!</p>`,
        onOk: () => {
          optCloudRegion({ id_list: [paramsRow.id] }, "delete").then((res) => {
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
    handleAddAsset (paramsRow) {
      this.modalData.show = true
      this.modalData.name = paramsRow.name
      this.modalData.id = paramsRow.id
    },
    // 预览动态分组主机
    async handlePreview(paramsRow) {
      this.modalPreview.show = true
      this.modalPreview.region_id = paramsRow.id

      this.$refs.assetPreview.handleGetData()
    },
    // 关联
    async handleRelevance(data) {
      let res = await optCloudRegion(data, 'patch')
      if (res.code === 0) {
        this.$Notice.success({ title: `${res.msg}` });
        this.handleClose()
      } else {
        this.$Notice.error({ title: `${res.msg}` });
      }
    },
    handleReDel (data) {
      this.$Modal.confirm({
      title: "提醒",
      content: `<p>确认要解除关联？, 请谨慎操作!</p>`,
      onOk: () => {
        optCloudRegionPro(data, "delete").then((res) => {
          if (res.code === 0) {
            this.$Notice.success({ title: `${res.msg}` });
            this.$refs.assetPreview.handleGetData()
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
    handleSort (column, key, order) {
      this.initPara.order = column.order === "asc" ? 'ascend' : 'descend'
      this.initPara.order_by = column.key
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
      width: 300px;
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