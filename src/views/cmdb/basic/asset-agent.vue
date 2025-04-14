<template>
  <div>
    <div class="search-con search-con-top">
      <!-- 左侧：搜索框 + 筛选按钮 -->
      <div class="search-left">
        <Input class="search-input" v-model="initPara.searchVal" search :maxlength='50' @on-search="handleSearch"
          placeholder="输入关键字搜索" />
        <span style="margin-left: 20px">一键筛选：</span>
        <ButtonGroup>
          <Button v-if="initPara.search_filter === 'no'" type="primary" @click="handlefilter('no')">未绑定</Button>
          <Button v-else @click="handlefilter('no')">未绑定</Button>
          <Button v-if="initPara.search_filter === 'yes'" type="primary" @click="handlefilter('yes')">已绑定</Button>
          <Button v-else @click="handlefilter('yes')">已绑定</Button>
          <Button v-if="initPara.search_filter === ''" type="primary" @click="handlefilter('')">全部</Button>
          <Button v-else @click="handlefilter('')">全部</Button>
        </ButtonGroup>
        <h4 v-if="instance_id" class="search-col">实例：{{ instance_id }}</h4>
      </div>
      <!-- 右侧按钮 -->
      <div class="search-right">
        <Button v-if="!instance_id" type="primary" class="search-add-btn" @click="handleBatchAddServer"
          :disabled="selectList.length !== 0 ? false : true">生成主机
        </Button>
        <Button v-if="!instance_id" type="error" class="search-add-btn" @click="handleDel"
          :disabled="selectList.length !== 0 ? false : true">批量删除
        </Button>
      </div>
    </div>

    <Table ref="selection" size="small" :columns="tableColumns" :data="tableData" :loading="i.tableLoading"
      @on-sort-change="handleSort" @on-selection-change="handleSelect"></Table>

    <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
        <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
          :page-size-opts="[15, 50, 100, 1000]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
      </div>
    </div>
    <!-- 预览 -->
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中，请稍等一会...</div>
    </Spin>
    <BindServer ref="BindHost" :dialog="dialog"></BindServer>
    <!-- <server-modal ref="serverModal" :modal-data="modalDataServer" @save-data="handleUpData"></server-modal> -->
  </div>
</template>

<script>
import { getAgentlist, optAgent, batchAddServerByAgent } from '@/api/cloud/agent.js'
import { getServerList, optServer } from '@/api/cloud/server.js'
import serverModal from '../components/set-server.vue'
import BindServer from '../components/bind-host.vue'
export default {
  name: 'Agent',
  components: {serverModal, BindServer},
  props: {
    instance_id: {
      type: String,
      default: null
    },
    sg_ids: {
      type: Object | Array,
      default: null
    }
  },
  data () {
    return {
      // Detail
      modalData: {
        show: false,
        title: 'Nat详情',
      },
      dialog: {
        show: false,
        title: "预览主机",
      },
      spinShow: false,
      selectAgentId: null,
      tableColumns: [
        {
          type: "selection",
          key: "selection",
          width: 60,
          align: "center",
        },
        {
          title: '主机名',
          key: 'hostname',
          tooltip: true,
          sortable: true,
          minWidth: 100
        },
        {
          title: '内网IP',
          key: 'ip',
          ellipsis: true,
          tooltip: true,
          minWidth: 100,
        },
        {
          title: 'proxy_id',
          key: 'proxy_id',
          align: 'center',
          minWidth: 60
        },
        {
          title: 'AgentID',
          key: 'agent_id',
          minWidth: 120
        },
        {
          title: '版本',
          key: 'version',
          minWidth: 20
        },
        {
          title: '状态',
          key: 'agent_bind_status',
          align: 'center',
          width: 150,
          sortable: true,
          render: (h, params) => {
            const status = params.row.agent_bind_status
            if (status === 0) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: '#ed3f14'},
                  },
                  '暂未绑定',
                ),
              ])
            } else if (status === 1) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: '#2d8cf0' },
                  },
                  '自动绑定',
                ),
              ])
            } else if (status === 2) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: '#19be6b' },
                  },
                  '手动绑定',
                ),
              ])
            }
          },
        },
        {
          title: 'workspace',
          key: 'workspace',
          minWidth: 90
        },
        {
          title: '备注',
          key: 'description',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '更新时间',
          key: 'update_time',
          sortable: true,
          width: 170
        },
        {
          title: "操作",
          key: "handle",
          align: "center",
          width: 200,
          render: (h, params) => {
            // 获取绑定状态
            const isBound = params.row.agent_bind_status === 1 || params.row.agent_bind_status === 2;

            return h("div", [
              h(
                "a",
                {
                  props: {
                    type: "primary", // 根据状态使用不同类型
                    size: "small",
                  },
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      // 根据状态调用不同方法
                      if (isBound) {
                        this.handleViewServer(params.row);
                      } else {
                        this.handlePreview(params.row);
                      }
                    },
                  },
                },
                isBound ? "查看主机" : "绑定主机"
              ),
              h(
                "a",
                {
                  style: {
                    marginRight: "10px",
                  },
                  props: {
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.handleAddServer([params.row.id]);
                    },
                  },
                },
                "生成主机"
              ),
            ]);
          },
        },

      ],
      modalDataServer: {
        show: false,
        title: '选择主机',
        action: 'put'
      },
      tableData: [],
      i:{
        pageTotal: 0, //总数
        tableLoading: true
      },
      initPara:{
        page_number: 1,
        page_size: 15,
        searchVal: null,
        sg_ids: [],
        order_by: "",      //排序字段
        order: "ascend", //排序 ascend descend
        search_filter: 'no'
      },
      searchParams: {
        page_number: 1,
        page_size: 12,
        search_filter: 'no',
        order_by: "",      //排序字段
        order: "ascend", //排序 ascend descend
      },
      selectList: [],
    }
  },
  methods: {
    // 获取
    async handleGetData() {
      const res = await getAgentlist(this.initPara);
      if (res.code == 0) {
        this.tableData = res.data;
        this.i.pageTotal = res.count
      } else {
        this.$Message.error(res.msg)
      }
      this.i.tableLoading = false
    },
    /**
 * 查看已绑定的主机
 * @param {Object} row Agent行数据
 * @returns {Promise<void>}
 */
    // 在 asset-agent.vue 中
    async handleViewServer(row) {
      this.spinShow = true;
      try {
        // 获取所有主机列表
        let searchParams = {
          page_number: 1,
          page_size: 300,
          search_filter: 'is_normal',
          order_by: 'id',
          order: 'ascend'
        };

        const allServersRes = await getServerList(searchParams);
        if (allServersRes.code !== 0) {
          this.$Message.error(`获取主机列表失败: ${allServersRes.msg}`);
          this.spinShow = false;
          return;
        }

        // 调用 BindHost 组件的方法处理数据
        this.$refs.BindHost.loadServerData(allServersRes.data, row.agent_id, row.id);

        // 设置标题
        this.dialog.title = `查看已绑定主机 (${row.agent_id})`;

        // 显示弹窗
        this.dialog.show = true;
      } catch (e) {
        this.$Message.error(e.toString());
      } finally {
        this.spinShow = false;
      }
    },
    async handlePreview(data) {
      this.spinShow = true;

      try {
        let res = await getServerList();

        if (res.code !== 0) {
          this.$Message.error(`${res.msg}`);
          return;
        }
        this.$refs.BindHost.serverList = res.data
        this.$refs.BindHost.agentInstanceId = data.id;
        this.dialog.show = true;
        // 监听绑定完成事件
        this.$refs.BindHost.$once('bind-complete', () => {
          this.handleGetData(); // 刷新当前页面数据
          this.dialog.show = false; // 关闭对话框
        });
      } catch (e) {
        this.$Message.error(e.toString());
      } finally {
        this.spinShow = false;
      }
    },
    //生成主机
    handleAddServer(data) {
      this.$Modal.confirm({
        title: '二次确认',
        content: '确定生成主机？',
        onOk: () => {
          let id_list = []
          if (data) {
            id_list = data;
          } else {
            id_list = this.selectList;
          }
          batchAddServerByAgent({ id_list: data }, 'post').then(res => {
            if (res.code === 0) {
              this.$Message.success(res.msg)
              this.selectList = []
              this.handleGetData()
            } else {
              this.$Notice.error({ title: `${res.msg}` })
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('回头是岸~')
        },
      })
    },
    handleBatchAddServer() {
      this.$Modal.confirm({
        title: '二次确认',
        content: '确定生成主机？',
        onOk: () => {
          batchAddServerByAgent({ id_list: this.selectList }, 'post').then(res => {
            if (res.code === 0) {
              this.$Message.success(res.msg)
              this.selectList = []
              this.handleGetData()
            } else {
              this.$Notice.error({ title: `${res.msg}` })
            }
          })
        },
        onCancel: () => {
          this.$Message.info('回头是岸~')
        },
      })
    },
    handlefilter(val) {
      this.initPara.search_filter = val
      this.handleGetData()
    },
    // 删除
    handleDel() {
      this.$Modal.confirm({
        title: '二次确认',
        content: '确定删除已选中的数据？',
        onOk: () => {
          optAgent({ id_list: this.selectList }, 'delete').then(res => {
            if (res.code === 0) {
              this.$Message.success(res.msg)
              this.selectList = []
              this.handleGetData()
            } else {
             this.$Notice.error({ title: `${res.msg}` })
            }
          })
        },
        onCancel: () => {
          this.$Message.info('回头是岸~')
        },
      })
    },
    handleShowServer (paramsRow) {
      this.modalDataServer.show = true;
      this.$refs.serverModal.asset_server_id = paramsRow.asset_server_id;
      this.modalDataServer.title = `选择主机 【${paramsRow.agent_id}】`
      this.modalDataServer.id = paramsRow.id;
    },

    handleUpData (upData) {
      optAgent(upData, 'patch').then(res => {
      if (res.code == 0) {
      this.$Message.success('成功')
      this.handleClose()
      } else {
        this.$Message.error(res.msg)
        }
      })
    },
    // 详细信息
    handleDetail(paramsRow) {
      this.natData = paramsRow
      this.modalData.show = true
    },
    handleClose() {
      // this.modalAdd.show = false
      // this.modalData.show = false
      this.modalDataServer.show = false
      this.handleGetData()
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
    searchValue (val) {
      this.pageNum = 1
      this.handleGetData()
    },
    instance_id (val) {
      this.pageNum = 1
      this.securityInfoList = []
      this.handleGetData()
    },
    sg_ids (val) {
      this.initPara['sg_ids'] = JSON.stringify(this.sg_ids)
      this.pageNum = 1
      this.securityInfoList = []
      this.handleGetData()
    },
  },
  computed: {
  },
  mounted () {
    this.handleGetData()
  }
}
</script>
<style lang="less" scoped>
.search-con {
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  /* 左右对齐 */
  align-items: center;
  /* 垂直居中 */
  flex-wrap: wrap;

  /* 如果宽度不够，换行 */
  .search {
    &-col {
      display: inline-block;
      margin-left: 10px;
      width: 400px;
    }

    &-input {
      display: inline-block;
      width: 350px;
      margin-left: 2px;
    }

    &-add-btn {
      margin-left: 2px;
      margin-right: 3px;
    }
  }
}

.search-left {
  display: flex;
  align-items: center;
  gap: 10px;
  /* 控制间距 */
}

.search-right {
  display: flex;
  gap: 10px;
  /* 按钮间距 */
  margin-right: 20px;
}
</style>
