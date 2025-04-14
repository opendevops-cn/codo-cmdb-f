<!-- eslint-disable max-len -->
<template>
  <Card dis-hover :bordered="false">
    <Tabs :animated="false" :value="theTabName" @on-click="handleTabsChange">
      <template>
        <div class="search-con search-con-top">
          <template v-if="theTabName !=='attr'">
            <Input class="search-input" v-model="searchParams.search_val" clearable placeholder="输入name搜索" @keydown.enter.native="handeSerach" />
            <ButtonGroup>
              <Button icon="ios-search" :disabled="handTree ? false : true"  style="margin: 3px" @click="handeSerach">搜索</Button>
              <Button  v-if="treeNodeType === 2 || treeNodeType === 3" type="success" style="margin: 3px" @click="handleAdd(treeNodeType)"> 添加资源</Button>
              <Button v-if="selectList.length" type="primary" style="margin: 3px" @click="showCopyDialog">复制列</Button>
            </ButtonGroup>
          </template>
        </div>
      </template>
      <template v-if="selectList !=0">
        <Button type="error" style="margin: 3px" @click="changeStatus(0)">下线资源</Button>
        <Button type="success" style="margin: 3px" @click="changeStatus(1)">上线资源</Button>
      </template>
      <!-- 用户切换Tabs -->
      <TabPane name="server" label="主机" icon="logo-tux">
        <Table ref="selection" :loading="loading" stripe :columns="serverColumns" :data="tableData" @on-selection-change="changeSelect" />
      </TabPane>
      <TabPane name="mysql" label="MySQL" icon="ios-photos">
        <Table ref="selection" :loading="loading" stripe :columns="mysqlColumns" :data="tableData" @on-selection-change="changeSelect" />
      </TabPane>
      <TabPane name="redis" label="Redis" icon="logo-buffer">
        <Table ref="selection" :loading="loading" stripe :columns="redisColumns" :data="tableData" @on-selection-change="changeSelect" />
      </TabPane>
       <TabPane name="lb" label="LB" icon="ios-git-network">
        <Table ref="selection" :loading="loading" stripe :columns="lbColumns" :data="tableData" @on-selection-change="changeSelect" />
      </TabPane>
      <TabPane name="attr" label="属性" icon="ios-settings-outline">
        <Row  :gutter="20" >
            <i-col :md="8" :lg="6" class="custom-col" v-for="(attrV, attrK) in treeAttr" :key="attrK">
            <span class="attr-key" >{{ attrK }}</span><br>
            <span v-if="editShowKey != attrK"  class="attr-value" @click="handleEditAttr(attrK, attrV)">{{ attrV }}<Icon type="ios-create-outline" /></span>
            <Input v-else type="text" v-model="attrVlue" > <Button slot="append" @click="handleSaveAttr">保存</Button></Input>
          </i-col>
        </Row >
      </TabPane>
    </Tabs>
    <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden" v-if="theTabName !=='attr'">
      <div style="text-align:center;">
        <Page :total="pageTotal" :page-size="searchParams.page_size" show-total show-sizer :page-size-opts="[10, 30, 50, 100,300]" @on-page-size-change="changePageSize" @on-change="handlerChangepage" />
      </div>
    </div>
    <!-- 更改状态 -->
    <ChangeStatus :dialog="changeStatusDialog" :data="changeStatusData" @e-close="changeStatusDialog.show = false" @e-update="getTableData" />
    <!-- 添加资产 -->
    <AssetAdd ref="AssetAdd" :dialog="addDialog" :form="addForm" @e-close="addDialog.show = false" @e-update="getTableData" />
    <!-- 扩展字段 -->
    <AssetMore :dialog="moreDialog" :data="moreData" />
    <!-- 删除主机 -->
    <AssetDelete :dialog="deleteDialog" :data="deleteData" @e-close="deleteDialog.show = false" @e-update="getTableData" />
    <!-- 关系 -->
    <Modal v-model="relationDialog.show" :title="relationDialog.title" :footer-hide="true" width="860" :mask-closable="false">
      <template v-if="relationDialog.show">
        <chart-tree :title="relationDialog.title" :data="relationData" style="height: 600px;" />
      </template>
    </Modal>
    <Modal v-model="copyDialog.show" :title="'选择要复制去重的列'" :footer-hide="true" width="500">
      <template v-if="copyDialog.show">
        <CheckboxGroup v-model="selectedColumns">
          <Checkbox v-for="col in currentColumns" :label="col.title" :key="col.key">{{ col.title }}</Checkbox>
        </CheckboxGroup>
        <div style="text-align: right; margin-top: 20px;">
          <Button type="primary" @click="copySelectedColumns">复制</Button>
        </div>
      </template>
    </Modal>
  </Card>
</template>
<script>
// eslint-disable-next-line import/no-unresolved
import { ChartTree } from '_c/charts'
import { getTreeAsset, getRelation, operationTree } from '@/api/service-tree'
import AssetAdd from './asset-add.vue'
import AssetMore from './asset-more.vue'
import ChangeStatus from './change-status.vue'
import AssetDelete from './asset-delete.vue'

export default {
  name: 'TreeAssetIndex',
  components: {
    ChartTree,
    ChangeStatus,
    AssetAdd,
    AssetMore,
    AssetDelete,
  },
  props: {
    treeNodeData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectedColumns: [],
      copyDialog: {
        show: false,
      },
      attrVlue: null,
      editShowKey: null,
      treeID: null,
      //
      loading: true,
      // 扩展信息
      moreDialog: {
        show: false,
        title: '扩展信息',
      },
      moreData: {},
      // 删除主机
      deleteDialog: {
        show: false,
        title: '删除主机',
      },
      deleteData: {},
      // 更改状态
      changeStatusDialog: {
        show: false,
        title: '更改状态',
      },
      changeStatusData: {},
      // 关系
      relationName: '',
      relationData: {},
      relationDialog: {
        show: false,
        title: '关系',
      },
      theBusinessID: '',
      // 添加资源
      addDialog: {
        show: false,
        title: '添加资源',
      },
      addForm: {
        asset_type: 'server',
        asset_ids: [],
        is_enable: true,
        biz_id: '',
        env_name: '',
        region_name: '',
        module_name: '',
        ext_info: {},
      },
      serverColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        // {
        //   title: 'id',
        //   key: 'id',
        //   width: 80,
        // },
        {
          title: '上线状态',
          key: 'is_enable',
          // align: 'center',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const isEnable = params.row.is_enable
            if (isEnable === 0) {
              return h('div', [
                h('Badge', {
                  props: { status: 'error', text: '已下线' },
                }),
              ])
            } if (isEnable === 1) {
              return h('div', [
                h('Badge', {
                  props: { status: 'success', text: '已上线' },
                }),
              ])
            }
            return h('div', [
              h('Badge', {
                props: { status: 'warning', text: '未知' },
              }),
            ])
          },
        },
        {
          title: '环境',
          key: 'env_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '集群',
          key: 'region_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '模块',
          key: 'module_name',
          align: 'left',
          minWidth: 120,
          maxWidth: 180,
          sortable: true,
        },
        {
          title: '资源名称',
          key: 'name',
          align: 'left',
          minWidth: 200,
          sortable: true,
        },
        {
          title: '内网IP',
          key: 'inner_ip',
          align: 'left',
          width: 170,
          sortable: true,
        },
        {
          title: '外网IP',
          key: 'outer_ip',
          align: 'left',
          width: 170,
          sortable: true,
        },
        {
          title: '业务出口',
          key: 'outer_biz_addr',
          align: 'left',
          width: 170,
          sortable: true,
        },
        {
          title: '操作',
          key: 'handle',
          width: 220,
          align: 'center',
          render: (h, params) => h('div', [
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleViewRelation(params.row)
                  },
                },
              },
              '拓扑',
            ),
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleMoreInfo(params.row)
                  },
                },
              },
              '扩展信息',
            ),
            h(
              'a',
              {
                style: {
                  color: 'red',
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row)
                  },
                },
              },
              '删除',
            ),
          ]),
        },
      ],
      mysqlColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '上线状态',
          key: 'is_enable',
          align: 'center',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const isEnable = params.row.is_enable
            if (isEnable === 0) {
              return h('div', [
                h('Badge', {
                  props: { status: 'error', text: '已下线' },
                }),
              ])
            } if (isEnable === 1) {
              return h('div', [
                h('Badge', {
                  props: { status: 'success', text: '已上线' },
                }),
              ])
            }
            return h('div', [
              h('Badge', {
                props: { status: 'warning', text: '未知' },
              }),
            ])
          },
        },
        {
          title: '环境',
          key: 'env_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '集群',
          key: 'region_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '模块',
          key: 'module_name',
          align: 'left',
          sortable: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 200,
          sortable: true,
          tooltip: true,
        },
        {
          title: '可用区',
          key: 'zone',
          width: 150,
          tooltip: true,
        },
        {
          title: '引擎',
          key: 'db_engine',
          align: 'left',
          width: 130,
          sortable: true,
        },
        {
          title: '版本',
          key: 'db_version',
          align: 'left',
          width: 120,
          sortable: true,
          tooltip: true,
        },
        {
          title: '操作',
          key: 'handle',
          width: 220,
          align: 'center',
          render: (h, params) => h('div', [
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleViewRelation(params.row)
                  },
                },
              },
              '拓扑',
            ),
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleMoreInfo(params.row)
                  },
                },
              },
              '扩展信息',
            ),
            h(
              'a',
              {
                style: {
                  color: 'red',
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row)
                  },
                },
              },
              '删除',
            ),
          ]),
        },
      ],
      redisColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '上线状态',
          key: 'is_enable',
          align: 'center',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const isEnable = params.row.is_enable
            if (isEnable === 0) {
              return h('div', [
                h('Badge', {
                  props: { status: 'error', text: '已下线' },
                }),
              ])
            } if (isEnable === 1) {
              return h('div', [
                h('Badge', {
                  props: { status: 'success', text: '已上线' },
                }),
              ])
            }
            return h('div', [
              h('Badge', {
                props: { status: 'warning', text: '未知' },
              }),
            ])
          },
        },
        {
          title: '环境',
          key: 'env_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '集群',
          key: 'region_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '模块',
          key: 'module_name',
          align: 'left',
          sortable: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 200,
          sortable: true,
          tooltip: true,
        },
        {
          title: '可用区',
          key: 'zone',
          width: 150,
          tooltip: true,
        },
        {
          title: '架构',
          key: 'instance_arch',
          align: 'left',
          width: 130,
          sortable: true,
        },
        {
          title: '版本',
          key: 'instance_version',
          align: 'left',
          width: 120,
          sortable: true,
          tooltip: true,
        },
        {
          title: '操作',
          key: 'handle',
          width: 220,
          align: 'center',
          render: (h, params) => h('div', [
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleViewRelation(params.row)
                  },
                },
              },
              '拓扑',
            ),
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleMoreInfo(params.row)
                  },
                },
              },
              '扩展信息',
            ),
            h(
              'a',
              {
                style: {
                  color: 'red',
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row)
                  },
                },
              },
              '删除',
            ),
          ]),
        },
      ],
      //
      lbColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '上线状态',
          key: 'is_enable',
          align: 'center',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const isEnable = params.row.is_enable
            if (isEnable === 0) {
              return h('div', [
                h('Badge', {
                  props: { status: 'error', text: '已下线' },
                }),
              ])
            } if (isEnable === 1) {
              return h('div', [
                h('Badge', {
                  props: { status: 'success', text: '已上线' },
                }),
              ])
            }
            return h('div', [
              h('Badge', {
                props: { status: 'warning', text: '未知' },
              }),
            ])
          },
        },
        {
          title: '环境',
          key: 'env_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '集群',
          key: 'region_name',
          align: 'left',
          sortable: true,
          tooltip: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '模块',
          key: 'module_name',
          align: 'left',
          sortable: true,
          minWidth: 120,
          maxWidth: 180,
        },
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 200,
          sortable: true,
          tooltip: true,
        },
        {
          title: '可用区',
          key: 'zone',
          width: 150,
          tooltip: true,
        },
        {
          title: '网络',
          align: 'center',
          width: 100,
          key: 'endpoint_type',
        },
        {
          title: '地址',
          key: 'lb_vip',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            let addr = params.row.dns_name ? params.row.dns_name: params.row.lb_vip
            return h('div', [
              h(
                'p',
                addr,
              ),
            ])
          },
        },
        {
          title: '操作',
          key: 'handle',
          width: 220,
          align: 'center',
          render: (h, params) => h('div', [
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleViewRelation(params.row)
                  },
                },
              },
              '拓扑',
            ),
            h(
              'a',
              {
                style: {
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleMoreInfo(params.row)
                  },
                },
              },
              '扩展信息',
            ),
            h(
              'a',
              {
                style: {
                  color: 'red',
                  marginRight: '10px',
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row)
                  },
                },
              },
              '删除',
            ),
          ]),
        },
      ],
      //
      attrColumns:[
        {
          title: '数据',
          key: 'dict_label',
          minWidth: 120
        }, {
          title: '值',
          key: 'dict_value',
          minWidth: 120,
        }, {
          title: '类型',
          key: 'data_type',
          minWidth: 120,
        }
      ],
      treeNodeType: 0,
      handTree: null,
      pageTotal: 0,
      searchParams: {},
      selectList: [],
      selectData: [],
      tableData: [],
      treeAttr:{},
      theTabName: 'server',

    }
  },
  filters: {
    attrFormat: function (val) {
      return JSON.stringify(val)
    }
  },
  computed: {
    currentColumns() {
      let columns;
      switch (this.theTabName) {
      case 'server':
        columns = this.serverColumns;
        break;
      case 'mysql':
        columns = this.mysqlColumns;
        break;
      case 'redis':
        columns = this.redisColumns;
        break;
      case 'lb':
        columns = this.lbColumns;
        break;
      default:
        columns = [];
      }
      return columns.filter(col => col.title && col.title !== '操作');
    }
  },
  watch: {
    treeNodeData() {
      this.flushTableData()
    },
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    showCopyDialog() {
      this.copyDialog.show = true
    },
    copySelectedColumns() {
      if (!this.selectData.length || !this.selectedColumns.length) return
      const columnKeys = this.currentColumns.filter(col => this.selectedColumns.includes(col.title)).map(col => col.key)

      const uniqueData = new Set(); // 使用Set进行去重
      this.selectData.forEach(item => {
        const rowValues = columnKeys.map(key => item[key]).join('\t');
        uniqueData.add(rowValues);
      });
      const copiedText = Array.from(uniqueData).join('\n'); // 将Set转换为数组
      this.copyToClipboard(copiedText)
      this.copyDialog.show = false
    },
    copyToClipboard(text) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      // 复制成功后清空textarea的值
      textarea.value = '';
      // 将textarea元素从body中移除
      document.body.removeChild(textarea);
      this.$Message.success('复制成功')
    },
    // 获取表格数据
    async getTableData() {
      try {
        this.searchParams.asset_type = this.theTabName
        this.searchParams.biz_id = localStorage.getItem('selectBusinessID')
        const res = await getTreeAsset(this.searchParams)
        this.tableData = []
        this.tableData = res.data
        this.pageTotal = res.count
        this.clearSelectAll()
      } finally {
        this.loading = false
      }
    },
    //
    async getTreeAttr() {
      try {
        this.searchParams.asset_type = this.theTabName
        const res = await getTreeAsset(this.searchParams)
        this.treeAttr = {}
        this.treeAttr = res.data
        // this.clearSelectAll()
      } finally {
        this.loading = false
      }
    },
    // 切换Tab
    handleTabsChange (name) {
      this.loading = true
      this.theTabName = name
      this.addForm.asset_type = name
      this.addForm.asset_ids = []
      this.searchParams.page_number = 1
      this.searchParams.page_size = 10
      if (name == 'attr') {
        this.getTreeAttr()
        return
      }
      this.getTableData()
    },
    // 切换状态
    changeStatus(val) {
      if (this.selectList === 0) {
        this.$Message.error('请先选择资源')
        return
      }
      this.changeStatusData = {
        asset_type: this.theTabName,
        select_ids: this.selectList,
        is_enable: val,
      }
      let title
      if (val === 0) {
        title = '下线资源'
      } else {
        title = '上线资源'
      }
      this.changeStatusDialog = { show: true, title }
    },
    handleAdd(nodeType) {
      this.addDialog.show = true
      this.$refs.AssetAdd.handleRefresh(nodeType) // 刷新数据
    },
    // 删除
    handleDelete(paramsRow) {
      this.deleteData = paramsRow
      this.deleteDialog = {
        show: true,
        name: paramsRow.name
      }
    },
    // 扩展字段
    handleMoreInfo(paramsRow) {
      this.moreData = paramsRow.ext_info
      this.moreDialog.show = true
    },
    handleEditAttr (key, val) {
      if (Object.prototype.toString.call(val) == '[object Object]') {
        this.$Message.error('当前类型无法友好展示，请直接编辑节点的扩展字段')
        return
        // this.attrVlue = JSON.parse(JSON.stringify(val))
      } else if (Object.prototype.toString.call(val) == '[object Array]') {
        this.$Message.error('当前类型无法友好展示，请直接编辑节点的扩展字段')
        return
      } else {
        this.attrVlue = val
      }
      this.editShowKey = key
    },
    async handleSaveAttr(){
      try {
        const res = await operationTree({tree_id: this.treeID, attr_key: this.editShowKey , attr_val : this.attrVlue}, 'patch')
        this.$Message.success(res.msg)
      } finally {
        this.getTreeAttr()
      }
      this.editShowKey = null
    },
    // 搜索
    handeSerach() {
      if (!this.handTree) {
        return
      }
      this.getTableData()
    },
    // 切换分页
    handlerChangepage(index) {
      this.searchParams.page_number = index
      this.getTableData()
    },
    // 切换单页数量
    changePageSize(index) {
      this.searchParams.page_size = index
      this.getTableData()
    },
    // table 选中的ID
    changeSelect(e) {
      this.selectList = []
      this.selectData = []
      e.forEach((item) => {
        this.selectList.push(item.id)
        this.selectData.push(item)
      })
    },
    // 清空table已选择
    clearSelectAll() {
      this.$refs.selection.selectAll(false)
    },
    // 关系
    async handleViewRelation(paramsRow) {
      const res = await getRelation({
        biz_id: paramsRow.biz_id,
        asset_id: paramsRow.asset_id,
        asset_type: paramsRow.asset_type,
      })
      if (res.code === 0) {
        this.relationData = res.data
        this.relationDialog = {
          show: true,
          title: paramsRow.name,
        }
      } else {
        this.$Notice.error({ title: `${res.msg}` })
      }
    },
    flushTableData() {
      this.loading = true
      const data = this.treeNodeData
      this.treeNodeType = data.node_type
      this.handTree = data.title
      this.theBusinessID = data.biz_id
      this.treeID = data.id
      this.treeAttr = data.ext_info
      switch (this.treeNodeType) {
      case 0:
        this.searchParams = {
          biz_id: data.biz_id,
        }
        this.addForm.biz_id = data.biz_id
        break
      case 1:
        this.searchParams = {
          biz_id: data.biz_id,
          env_name: data.title,
        }
        this.addForm.biz_id = data.biz_id
        this.addForm.env_name = data.title
        break
      case 2:
        this.searchParams = {
          biz_id: data.biz_id,
          env_name: data.parent_node,
          region_name: data.title,
        }
        this.addForm.biz_id = data.biz_id
        this.addForm.env_name = data.parent_node
        this.addForm.region_name = data.title
        break
      case 3:
        this.searchParams = {
          biz_id: data.biz_id,
          region_name: data.parent_node,
          env_name: data.grand_node,
          module_name: data.title,
        }
        this.addForm.biz_id = data.biz_id
        this.addForm.env_name = data.grand_node
        this.addForm.region_name = data.parent_node
        this.addForm.module_name = data.title
        break
      default:
        console.log(`Sorry, we are out of ${data.node_type}.`)
      }
      if (this.theTabName == 'attr') {
        this.editShowKey = null
        this.getTreeAttr()
        return
      }
      this.getTableData()
    },
  },
}
</script>
<style lang="less" scoped>
.custom-col {
    padding: 5px 50px 20px 45px;
}

.attr-key {
  font-size: 13px;
  font-weight: bold;
    color: rgb(70, 76, 91);
}

.attr-value {
    font-size: 12px;
    font-weight: normal;
    color: #9ea7b4;
}
.search-con {
  padding: 8px 0;
  .search {
    &-input {
      display: inline-block;
      width: 350px;
      margin-left: 2px;
    }
    &-btn {
      margin-right: 0px;
      float: right;
    }
  }
}
</style>