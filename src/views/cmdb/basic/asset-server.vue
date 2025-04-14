<!-- eslint-disable max-len -->
<template>
  <div>
    <Card dis-hover :bordered="false">
      <Alert show-icon>
        已选择
        <span>{{ selectList.length }}</span> 项
        <a style="margin-left: 10px" @click="clearSelectAll">清空已选</a>
      </Alert>
      <div>
        <Input v-model="searchParams.searchVal" style="width: 300px; margin: 2px" search placeholder="输入关键字全局搜索" @on-search="handleSearch" />
        <Button @click="handleAdd" style="margin: 3px">添加</Button>

        <!-- <Button @click="handcustomView()" style="margin: 3px">列表属性</Button> -->
        <span style="margin-left: 20px">一键筛选：</span>
        <ButtonGroup>
          <Button v-if="searchParams.search_filter === 'is_normal'" type="primary" @click="handlefilter('is_normal')">未过期</Button>
          <Button v-else @click="handlefilter('is_normal')">未过期</Button>
          <Button v-if="searchParams.search_filter === 'is_expired'" type="primary" @click="handlefilter('is_expired')">已过期</Button>
          <Button v-else @click="handlefilter('is_expired')">已过期</Button>
          <Button v-if="searchParams.search_filter === 'is_showdown'" type="primary" @click="handlefilter('is_showdown')">已关机</Button>
          <Button v-else @click="handlefilter('is_showdown')">已关机</Button>
          <!-- <Button v-if="searchParams.search_filter === 'is_product'" type="primary" @click="handlefilter('is_product')">未分配</Button>
          <Button v-else @click="handlefilter('is_product')">未分配</Button> -->
        </ButtonGroup>
        <template v-if="selectList.length !== 0">
          <Button style="margin-left: 5px" @click="handleShowEditAddr">业务出口</Button>
          <Button type="error" style="margin: 5px" @click="handleDelete">一键删除</Button>
          <Button type="primary" class="search-btn" @click="exportData(2)">
            <Icon type="ios-download-outline" />导出数据
          </Button>
        </template>
        <template v-else>
          <Button type="primary" style="margin-left: 5px" disabled @click="handleShowEditAddr">业务出口</Button>
          <Button type="error" style="margin: 5px" disabled>一键删除</Button>
          <Button type="primary" class="search-btn" disabled >
            <Icon type="ios-download-outline" />导出数据
          </Button>
        </template>
        <div style="float: right;">
          <Button @click="handerSettingShow()">
            <Icon type="ios-settings" />字段配置
          </Button>
        </div>
      </div>

      <!-- 主机详情 -->
      <div v-if="serverData">
        <serverDetail :modal-data="modalData" :server-data="serverData" />
      </div>

      <div style="margin-top: 5px">
        <Table ref="selection" stripe size="small" :columns="tableColumns2" :data="tableData"
          @on-sort-change="handleSort" @on-selection-change="changeSelect" />
      </div>
      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left">
          <Page :total="pageTotal" :current="searchParams.page_number" :page-size="searchParams.page_size" :page-size-opts="[12, 35, 50, 100, 2000]" show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize" />
        </div>
      </div>
    </Card>

    <Modal v-model="modalAddrEdit" width="450" >
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>批量修改业务出口地址</span>
      </p>
      <div style="text-align:center">
        <p>地址出错会严重影响业务！</p>
        <p>当真要修改吗！</p>
      </div>

      <div style="padding: 10px 0 0 0;">
        <Input class="search-input" v-model="outer_biz_addr" clearable :maxlength='250' placeholder="输入当前的业务出口地址，一般是是EIP、LB、域名" />
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="btnLoading" @click="handleSaveAddr">提交</Button>
      </div>
    </Modal>

    <Drawer v-model="showDrawer" title="选择展示的字段" style="background-color: #f8f8f9" width="500">
      <Transfer filterable :list-style="listStyle" :titles="tranferTitles" :data="sourceField" :target-keys="targetField" @on-change="handleSettingChange" />
    </Drawer>

    <server-add :modal-data="modalAdd" @drawer-close="handleClose" @save-data="handleSaveData"/>

    <div style="position: relative">
      <Drawer v-model="showDrawerSecurity" :mask-closable="false" width="75%">
        <security-group :instance_id="instance_id" :sg_ids="sg_ids" />
      </Drawer>
    </div>

  </div>
</template>
<script>
import {
  getServerList,
  optServer,
  optBatchServer,
  getUserField,
  optrationUserField,
} from '@/api/cloud/server'

import serverDetail from '../components/server-detail.vue'
import serverAdd from '../components/server-add.vue'
import SecurityGroup from './security-group'

export default {
  components: {
    serverDetail,
    serverAdd,
    SecurityGroup
  },
  data() {
    return {
      showDrawer: false,
      btnLoading: false,
      sourceField: [
        { label: 'selection', key: 'selection', disabled: true },
        { label: 'ID', key: 'id', disabled: true },
        { label: '云厂商', key: 'cloud_name', disabled: true },
        { label: '实例ID', key: 'instance_id', disabled: true },
        { label: '实例名称', key: 'name', disabled: true },
        { label: '内网IP', key: 'inner_ip', disabled: true },
        { label: '外网IP', key: 'outer_ip'},
        { label: '运行状态', key: 'state', disabled: true },
        // { label: '最后更新时间', key: 'update_time', disabled: true },
        { label: '归属', key: 'ownership'},
        // {label: '标签', key: 'tags'},
        {label: '是否绑定主Agent', key: 'has_main_agent'},
        {label: 'Agent绑定状态', key: 'agent_bind_status'},

        //
        { label: '地区', key: 'region' },
        { label: '机房', key: 'zone' },
        { label: '是否过期', key: 'is_expired' },
        { label: 'Agent ID', key: 'agent_id' },
        { label: 'CPU', key: 'cpu' },
        { label: '内存', key: 'memory' },
        { label: '系统OS', key: 'os_name' },
        { label: '系统盘', key: 'system_disk' },
        { label: '数据盘', key: 'data_disk' },
        { label: '付费类型', key: 'charge_type' },
        { label: '网络类型', key: 'network_type' },
        { label: '实例类型', key: 'instance_type' },
        { label: '实例创建时间', key: 'instance_create_time' },
        { label: '线上使用', key: 'is_product' },
      ],
      targetField: [
        'selection',
        'id',
        'cloud_name',
        'instance_id',
        'name',
        'inner_ip',
        'show_security_group',
        // 'outer_ip',
        'state',
        'update_time',
      ],
      tranferTitles: ['所有字段', '收藏字段'],
      listStyle: {
        width: '200px',
        height: '750px',
      },
      // 详情
      modalData: {
        show: false,
        title: '主机详情',
      },
      // 添加
      modalAdd: {
        show: false,
        action: 'post',
        title: '添加主机',
      },
      // 业务出口
      modalAddrEdit: false,
      outer_biz_addr: null,
      serverData: {},
      selectOperation: 'more', // 选择xx
      // 自定义表格
      check_box_list: [],
      // 默认存在的
      tableColumnsChecked: [
        'selection',
        'name',
        // 'id',
        'cloud_name',
        'instance_id',
        'inner_ip',
        // 'outer_ip',
        'show_security_group',
        'agent_id',
        'state',
        'update_time',
        'agent_bind_status',
        // 'has_main_agent',
      ],

      // 添加
      modalMap: {
        loading: false,
        modalVisible: false,
        modalTitle: '添加',
      },

      selectList: [],
      searchVal: null, // 模糊查询
      pageTotal: null, // 总数
      method_data: null, // 请求方法
      formValidate: {},
      tableData: [],
      tableColumns2: [],
      ruleValidate: {},
      showDrawerSecurity: false,
      instance_id: null,
      sg_ids: [],
      searchParams: {
        page_number: 1,
        page_size: 12,
        search_filter: 'is_normal',
        order_by: "",      //排序字段
        order: "ascend", //排序 ascend descend
      },
    }
  },
  mounted() {
    this.getTableData() // 获取数据信息
    this.tableColumns2 = this.getTable2Columns() // 获取出来默认的表格Columns
    this.getUserFieldFavorites() //  从后端获取用户收藏
  },
  methods: {
    // 自定义tableCloumns
    getTable2Columns() {
      const table2ColumnList = {
        selection: {
          type: 'selection',
          title: 'selection',
          key: 'selection',
          width: 60,
          align: 'center',
        },
        id: {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 100,
          sortable: true,
        },

        cloud_name: {
          title: '厂商',
          key: 'cloud_name',
          align: 'center',
          width: 120,
          sortable: true,
          // eslint-disable-next-line consistent-return
          render: (h, params) => {
            const cloudName = params.row.cloud_name
            // const { cloud_name } = params.row
            if (cloudName === 'qcloud') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'geekblue' },
                  },
                  '腾讯云',
                ),
              ])
            } else if (cloudName === 'aliyun') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'blue' },
                  },
                  '阿里云',
                ),
              ])
            } else if (cloudName === 'cds') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'cyan' },
                  },
                  '首都云',
                ),
              ])
            } else if (cloudName === 'vmware') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'purple' },
                  },
                  'VMware',
                ),
              ])
            } else if (cloudName === 'volc') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'orange' },
                  },
                  '火山云',
                ),
              ])
           } else if (cloudName === 'gcp') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'green' },
                  },
                  '谷歌云',
                ),
              ])
            } else if (cloudName === 'aws') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'volcano' },
                  },
                  'AWS',
                ),
              ])
            } else {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'gold' },
                  },
                  cloudName,
                ),
              ])
            }
          },
        },
        region: {
          title: '地区',
          key: 'zone',
          align: 'center',
          width: 150,
          sortable: true,
        },
        zone: {
          title: '机房',
          key: 'zone',
          align: 'center',
          width: 150,
          sortable: true,
        },
        instance_id: {
          title: '实例ID',
          key: 'instance_id',
          minWidth: 190,
          align: 'center',
          render: (h, params) => h(
            'a',
            {
              on: {
                click: () => {
                  this.handleDetail(params.row)
                },
              },
            },
            params.row.instance_id,
          ),
        },
        name: {
          title: '实例名称',
          minWidth: 220,
          key: 'name',
          align: 'left',
          sortable: true,
          tooltip: true,
        },
        inner_ip: {
          title: '内网IP',
          key: 'inner_ip',
          align: 'center',
          width: 150,
          sortable: true,
        },
        outer_ip: {
          title: '外网IP',
          key: 'outer_ip',
          align: 'center',
          width: 150,
          sortable: true,
        },
        show_security_group: {
          title: '安全组',
          key: 'instance_id',
          align: 'center',
          minWidth: 90,
          render: (h, params) => {
            return h('a', [
              h('Icon', {
                  props: {
                      type: 'ios-eye'
                  },
                  nativeOn: {
                      click: () => {
                          this.handlerShowSecurity(params.row);
                      }
                  }
              }),
              h('a',{
                on: {
                  click: () => {
                      this.handlerShowSecurity(params.row)
                    }
                  }
                },'  ' + '查看'
              )
            ]);
          }
        },
        cpu: {
          title: 'CPU',
          key: 'cpu',
          align: 'center',
          width: 80,
          sortable: true,
        },
        memory: {
          title: '内存',
          key: 'memory',
          align: 'center',
          width: 80,
          sortable: true,
        },
        system_disk: {
          title: '系统盘(G)',
          key: 'system_disk',
          align: 'center',
          width: 120,
        },
        data_disk: {
          title: '数据盘(G)',
          key: 'data_disk',
          align: 'center',
          width: 120,
        },
        state: {
          title: '状态',
          key: 'state',
          align: 'center',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const { row } = params
            // eslint-disable-next-line no-nested-ternary
            const color = row.state === '运行中' ? 'success' : row.state === '关机' ? 'error' : row.state === '创建中' ? 'primary' : 'error'
            // eslint-disable-next-line no-nested-ternary
            const text = row.state === '运行中' ? '运行中' : row.state === '关机' ? '已关机' : row.state === '创建中' ? '创建中' : row.state === '未同步' ? '未同步' :'Fail'
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color,
                },
              },
              text,
            )
          },
        },
        os_name: {
          title: '系统',
          key: 'os_name',
          align: 'center',
          width: 150,
          sortable: true,
        },
        network_type: {
          title: '网络类型',
          key: 'network_type',
          align: 'center',
          width: 150,
          sortable: true,
          render: (h, params) => {
            if (params.row.network_type === '经典网络') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'cyan' },
                  },
                  '经典网络',
                ),
              ])
            } if (params.row.network_type === '专有网络') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'green' },
                  },
                  '专有网络',
                ),
              ])
            }
            return h('div', [
              h(
                'Tag',
                {
                  props: { color: 'error' },
                },
                '未知',
              ),
            ])
          },
        },
        charge_type: {
          title: '付费类型',
          key: 'charge_type',
          align: 'center',
          width: 120,
          sortable: true,
          render: (h, params) => {
            if (params.row.charge_type === '包年包月') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'blue' },
                  },
                  '包年包月',
                ),
              ])
            } if (params.row.charge_type === '按量付费') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'orange' },
                  },
                  '按量付费',
                ),
              ])
            }
            return h('div', [
              h(
                'Tag',
                {
                  props: { color: 'error' },
                },
                '未知',
              ),
            ])
          },
        },

        instance_type: {
          title: '实例类型',
          key: 'instance_type',
          align: 'center',
          width: 150,
          sortable: true,
        },
        is_expired: {
          title: '是否过期',
          key: 'is_expired',
          align: 'center',
          width: 120,
          sortable: true,
          render: (h, params) => {
            if (params.row.is_expired === true) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'error' },
                  },
                  '已过期',
                ),
              ])
            } if (params.row.is_expired === false) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'success' },
                  },
                  '正常',
                ),
              ])
            } return h('div', [
              h(
                'Tag',
                {
                  props: { color: 'error' },
                },
                '未知',
              ),
            ])
          },
        },
        instance_create_time: {
          title: '创建时间',
          key: 'instance_create_time',
          align: 'center',
          width: 190,
          sortable: true,
        },
        instance_expired_time: {
          title: '过期时间',
          key: 'instance_expired_time',
          align: 'center',
          width: 185,
          sortable: true,
        },
        update_time: {
          title: '数据更新时间',
          key: 'update_time',
          align: 'center',
          fixed: 'right',
          width: 180,
          sortable: true,
        },
        detail: {
          title: '备注',
          key: 'detail',
          align: 'center',
          width: 150,
          sortable: true,
        },
        agent_id: {
          title: 'Agent ID',
          key: 'agent_id',
          align: 'center',
          width: 150,
          sortable: true,
        },
        ownership: {
          title: '归属',
          key: 'ownership',
          align: 'center',
          width: 150,
          sortable: true,
        },
        agent_bind_status: {
          title: 'Agent绑定状态',
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
                    props: { color: '#ed3f14' },
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
        // has_main_agent: {
        //   title: '绑定主Agent',
        //   key: 'has_main_agent',
        //   align: 'center',
        //   width: 150,
        //   sortable: true,
        //   render: (h, params) => {
        //     const value = params.row.has_main_agent;

        //     // 处理 true 值 (或数值 1)
        //     if (value === true || value === 1) {
        //       return h('div', [
        //         h(
        //           'Tag',
        //           {
        //             props: { color: 'success' },
        //           },
        //           '是'
        //         )
        //       ]);
        //     }
        //     // 处理 false、null、undefined、0 等值
        //     else if (value === false || value === 0 || value === null || value === undefined) {
        //       return h('div', [
        //         h(
        //           'Tag',
        //           {
        //             props: { color: 'error' },
        //           },
        //           '否'
        //         )
        //       ]);
        //     }
        //     // 处理其他意外值
        //     else {
        //       return h('div', [
        //         h(
        //           'Tag',
        //           {
        //             props: { color: 'warning' },
        //           },
        //           '未知'
        //         )
        //       ]);
        //     }
        //   }
        // },
        // tags: {
        //   title: '标签',
        //   key: 'tags',
        //   align: 'center',
        //   width: 150,
        //   sortable: true,
        //   render: (h, params) => {
        //     return h('span', params.row.tags.join(','));
        //   },
        // },
        is_product: {
          title: '线上使用',
          key: 'is_product',
          align: 'center',
          width: 120,
          sortable: true,
          render: (h, params) => {
            if (params.row.is_product === 0) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'error' },
                  },
                  'False',
                ),
              ])
            } if (params.row.is_product === 1) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'success' },
                  },
                  'True',
                ),
              ])
            }
            return h('div', [
              h(
                'Tag',
                {
                  props: { color: 'error' },
                },
                '未知',
              ),
            ])
          },
        },
      }
      const data = []

      // 列表合并去重
      this.targetField.forEach((ele) => {
        if (this.tableColumnsChecked.indexOf(ele) === -1) {
          this.tableColumnsChecked.push(ele)
        }
      })

      this.tableColumnsChecked.forEach((col) => data.push(table2ColumnList[col]))

      return data
    },
    // 切换TableColums
    changeTableColumns() {
      this.tableColumns2 = this.getTable2Columns()
    },

    // get biz list
    async getTableData() {
      const res = await getServerList(this.searchParams)
      if (res.code === 0) {
        this.tableData = res.data
        this.pageTotal = res.count
      } else {
        this.$message.error(`${res.msg}`)
      }
    },

    handleClose () {
      this.modalData.show = false
      this.modalAdd.show = false
      this.modalAddrEdit = false
      this.getTableData()
    },
    // // view
    handleDetail(paramsRow) {
      this.serverData = paramsRow
      this.modalData.show = true
    },
    // 搜索
    handleSearch() {
      this.searchParams.page_number = 1
      // this.searchParams.search_filter = ''
      this.getTableData()
    },
    // 自定义展示
    handcustomView() {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = '列表显示属性配置'
    },
    handleAdd () {
      this.modalAdd.show = true
    },
    //保存 手动录入数据
    handleSaveData (saveData, action, next) {
      optServer(saveData, action).then(res => {
          if (res.code == 0) {
            this.$Message.success('成功')
            if (next) {
              this.getTableData()
            } else {
              this.handleClose()
            }
          } else {
            this.$Message.error(res.msg)
          }
        })
    },
    // 业务出口地址编辑
    handleShowEditAddr () {
      this.modalAddrEdit = true
      this.outer_biz_addr = null
    },
    handleSaveAddr () {
       if (!this.outer_biz_addr) {
         this.$Message.warning('地址数据不能为空~')
         return
       }
       this.$Modal.confirm({
        title: '二次确认',
        content: '确定修改已选中的数据?',
        onOk: () => {
          optBatchServer({ hosts: this.selectList, outer_biz_addr: this.outer_biz_addr }, 'patch').then(res => {
            if (res.code === 0) {
              this.$Message.success(res.msg)
              this.handleClose()
            } else {
             this.$Notice.error({ title: `${res.msg}` })
            }
            this.clearSelectAll()
          })
        },
        onCancel: () => {
          this.$Message.info('回头是岸~')
          this.clearSelectAll()
        },
      })
    },

    handlefilter(val) {
      this.searchParams.search_filter = val
      this.getTableData()
    },
    // 删除主机
    handleDelete() {
      this.$Modal.confirm({
        title: '二次确认',
        content: '确定删除已选中的数据? 只能删除与业务没有关联的主机',
        onOk: () => {
          optServer({ hosts: this.selectList }, 'delete').then(res => {
            if (res.code === 0) {
              this.$Message.success(res.msg)
              this.handleClose()
            } else {
             this.$Notice.error({ title: `${res.msg}` })
            }
            this.clearSelectAll()
          })
        },
        onCancel: () => {
          this.$Message.info('回头是岸~')
          this.clearSelectAll()
        },
      })
    },
    handerSelectOperation(val) {
      try {
        if (this.selectList.length === 0) {
          this.$Message.error('同学, 请至少选择一条数据.')
          // return;
        } else {
          this.$Message.info('你选择了（待开发）', val)
        }
      } finally {
        // 恢复到默认绑定数据更多
        this.selectOperation = 'more'
      }
    },
    // 导出数据、支持分页、过滤、搜索、排序后导出
    exportData(type) {
      if (type === 1) {
        this.$refs.selection.exportCsv({
          filename: 'codo_cmdb_original_data',
        })
      } else if (type === 2) {
        this.$refs.selection.exportCsv({
          filename: 'codo_cmdb_sorting_and_filtering_data',
          original: false,
        })
      }
      this.clearSelectAll()
    },
    // 安全组
    handlerShowSecurity (paramsRow) {
      this.instance_id = paramsRow.instance_id
      this.sg_ids = paramsRow.security_group_ids
      if (!paramsRow.security_group_ids) {
        this.$Notice.error({ title: "当前实例下没有安全组或者不支持查询" })
        return
      }
      this.showDrawerSecurity = !this.showDrawerSecurity
    },
    handleSort (column, key, order) {
      this.searchParams.order = column.order === "asc" ? 'ascend' : 'descend'
      this.searchParams.order_by = column.key
      this.getTableData()
    },
    // 切换分页
    changePage(val) {
      this.searchParams.page_number = val
      // this.pageNum = val;
      this.clearSelectAll()
      this.getTableData()
    },
    // 每页条数
    handlePageSize(val) {
      this.searchParams.page_size = val
      // this.pageSize = val;
      this.clearSelectAll()
      this.getTableData()
    },
    // table 选中的ID
    changeSelect(e) {
      this.selectList = e
    },

    // 清空table已选择
    clearSelectAll() {
      this.$refs.selection.selectAll(false)
    },
    // 重置
    handleReset(name) {
      this.$refs[name].resetFields()
    },

    handerSettingShow() {
      this.showDrawer = !this.showDrawer
    },
    handleSettingChange(newTargetKeys, direction, moveKeys) {
      console.log('最终提交上去的。', newTargetKeys) // 最终右侧
      console.log('向', direction)
      console.log('移动', moveKeys)
      this.targetField = newTargetKeys
      this.tableColumnsChecked = this.$options.data().tableColumnsChecked
      this.handlerUpdateFavorites()
      this.changeTableColumns()
    },
    async handlerUpdateFavorites() {
      const newArr = [...new Set(this.targetField)]
      // eslint-disable-next-line camelcase
      const user_fields = newArr.join(',')
      // console.log(user_fields);
      const data = {
        user_type: 'server',
        // eslint-disable-next-line camelcase
        user_fields,
      }
      const res = await optrationUserField(data)
      if (res.code === 0) {
        this.$Message.success(`${res.msg}`)
      } else {
        this.$Message.error(`${res.msg}`)
      }
    },
    // 从后端获取用户收藏
    getUserFieldFavorites() {
      getUserField({ user_type: 'server' }).then((res) => {
        if (res.code === 0 && res.data) {
          res.data.split(',').forEach((ele) => {
            this.targetField.push(ele)
          })
        }
        // console.log(this.targetField)
        this.changeTableColumns()
      })
    },
  },
}
</script>
