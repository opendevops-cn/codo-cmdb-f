<!-- eslint-disable max-len -->
<template>
  <Card dis-hover :bordered="false">
    <div>
      <Alert show-icon>
        已选择
        <span>{{ selectList.length }}</span> 项
        <a style="margin-left: 10px" @click="clearSelectAll">清空已选</a>
      </Alert>
      <Select v-model="serachType" style="width:100px" @on-change="handleSerachChangge">
        <Option v-for="item in serachTypeList" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
      <template v-if="serachType === 'address'">
        <Input v-model="initPara.search_address" style="width: 300px; margin: 2px" clearable placeholder="输入地址模糊查询"
          @on-change="handleClear" @keydown.enter.native="handleSearch" />
      </template>
      <template v-else>
        <Input v-model="initPara.searchVal" style="width: 300px; margin: 2px" clearable placeholder="输入关键字模糊搜索"
          @on-change="handleClear" @keydown.enter.native="handleSearch" />
      </template>

      <Button style="margin: 3px" @click="handleSearch()">搜索</Button>
      <Button @click="handleAdd" style="margin: 3px">添加</Button>
      <span style="margin-left: 20px">一键筛选：</span>
      <ButtonGroup>
        <Button v-if="initPara.search_filter === 'is_normal'" type="primary"
          @click="handlefilter('is_normal')">未过期</Button>
        <Button v-else @click="handlefilter('is_normal')">未过期</Button>
        <Button v-if="initPara.search_filter === 'is_expired'" type="primary"
          @click="handlefilter('is_expired')">已过期</Button>
        <Button v-else @click="handlefilter('is_expired')">已过期</Button>
        <Button v-if="initPara.search_filter === 'is_showdown'" type="primary"
          @click="handlefilter('is_showdown')">已关机</Button>
        <Button v-else @click="handlefilter('is_showdown')">已关机</Button>
      </ButtonGroup>
      <template v-if="selectList.length !== 0">
        <Button type="error" style="margin: 6px" @click="handleDel">一键删除</Button>
        <Button type="primary" class="search-btn" @click="exportData(2)">
          <Icon type="ios-download-outline" />导出数据
        </Button>
      </template>
      <template v-else>
        <Button type="error" style="margin: 6px" disabled>一键删除</Button>
        <Button type="primary" class="search-btn" disabled>
          <Icon type="ios-download-outline" />导出数据
        </Button>
      </template>
      <Table ref="selection" size="small" :columns="columns" :data="tableData" :loading="i.tableLoading"
        @on-sort-change="handleSort" @on-selection-change="handleSelect" />
    </div>
    <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left">
        <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size"
          :page-size-opts="[12, 35, 50, 100, 1000]" show-sizer show-total @on-change="handlerChangePage"
          @on-page-size-change="handlePageSize" />
      </div>
    </div>
    <!-- MySQL Detail -->
    <div v-if="mysqlData">
      <mongodbDetail :modal-data="modalData" :mysql-data="mysqlData" />
    </div>
    <!-- MySQL Address -->
    <template v-if="addressDialog.show && addressDialog.cloudName === 'aws'">
      <auroraAddress :dialog="addressDialog" :address-items="addressItems" :instances-items="instancesItems" />
    </template>
    <template v-else-if="addressDialog.show && ['aliyun', 'qcloud', 'volc', 'gcp'].includes(addressDialog.cloudName)">
      <mongodbAddress :dialog="addressDialog" :address-items="addressItems" />
    </template>

    <mysql-add :modal-data="modalAdd" @drawer-close="handleClose" @save-data="handleSaveData" />
  </Card>
</template>

<script>
import { getMongoDBList, deleteMongoDB } from '@/api/cloud/mongodb.js'
import mongodbDetail from '../components/mongodb-detail.vue'
import mongodbAddress from '../components/mongodb-address.vue'
import auroraAddress from '../components/aurora-address.vue'
import mysqlAdd from '../components/mysql-add.vue'
export default {
  components: {
    mongodbDetail,
    mongodbAddress,
    auroraAddress,
    mysqlAdd
  },

  data() {
    return {
      // MySQL Address
      addressDialog: {
        show: false,
        title: '',
        cloudName: '',
      },
      addressItems: {}, // polardb / aurora cluster info
      instancesItems: {}, // aurora instance info

      // MySQLDetail
      modalData: {
        show: false,
        title: 'MongoDB详情',
      },
      // 添加
      modalAdd: {
        show: false,
        action: 'post',
        title: '添加数据库',
      },
      mysqlData: {},

      selectList: [],
      serachType: 'default',
      serachTypeList: [
        {
          value: 'default',
          label: '默认搜索',
        },
        {
          value: 'address',
          label: '地址搜索',
        },
      ],
      i: {
        pageTotal: 0,
        tableLoading: true
      },
      initPara: {
        page_number: 1,
        page_size: 12,
        search_filter: 'is_normal',
        order_by: "",      //排序字段
        order: "ascend", //排序 ascend descend
      },
      tableData: [],
      columns: [
        {
          type: 'selection',
          title: 'selection',
          key: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '云厂商',
          key: 'cloud_name',
          // align: 'center',
          minWidth: 130,
          maxWidth: 160,
          sortable: true,
          // eslint-disable-next-line consistent-return
          render: (h, params) => {
            const cloudName = params.row.cloud_name
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
            } if (cloudName === 'aliyun') {
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
            }
          },
        },
        {
          title: '实例状态',
          key: 'state',
          align: 'center',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const { row } = params
            // eslint-disable-next-line no-nested-ternary
            const color = row.state === '运行中' ? 'success' : row.state === '关机' ? 'error' : row.state === '创建中' ? 'primary' : 'error'
            // eslint-disable-next-line no-nested-ternary
            const text = row.state === '运行中' ? '运行中' : row.state === '关机' ? '已关机' : row.state === '创建中' ? '创建中' : row.state
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
        {
          title: '实例ID',
          key: 'instance_id',
          align: 'left',
          minWidth: 130,
          sortable: true,
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
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 130,
          sortable: true,
          tooltip: true,
        },
        {
          title: '可用区',
          key: 'zone',
          minWidth: 130,
          maxWidth: 160,
          tooltip: true,
        },
        {
          title: '实例类型',
          key: 'db_class',
          align: 'left',
          width: 130,
          sortable: true,
        },
        {
          title: '版本',
          key: 'db_version',
          align: 'left',
          minWidth: 110,
          maxWidth: 160,
          sortable: true,
          tooltip: true,
        },
        {
          title: '最后更新时间',
          key: 'update_time',
          align: 'center',
          fixed: 'right',
          width: 180,
          sortable: true,
        },
      ],
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    async handleGetData() {
      const res = await getMongoDBList(this.initPara)
      if (res.code === 0) {
        this.tableData = res.data
        this.i.pageTotal = res.count
      } else {
        this.$Message.error(`${res.msg}`)
      }
      this.clearSelectAll();
      this.i.tableLoading = false;
    },
    handleClose () {
      this.modalAdd.show = false
      this.modalData.show = false
      this.handleGetData()
    },
    handleAdd () {
      this.modalAdd.show = true
    },
    //保存 手动录入数据
    handleSaveData (saveData, action, next) {
      optrationMysQL(saveData, action).then(res => {
          if (res.code == 0) {
            this.$Message.success('成功')
            if (next) {
              this.handleGetData()
            } else {
              this.handleClose()
            }
          } else {
            this.$Message.error(res.msg)
          }
        })
    },
    handleSearch() {
      this.initPara.page_number = 1
      this.handleGetData()
    },
    handlefilter(val) {
      this.initPara.search_filter = val
      this.handleGetData()
    },
    handleDetail(paramsRow) {
      this.mysqlData = paramsRow
      this.modalData.show = true
    },
    handViewAddress(paramsRow) {
      this.addressItems = paramsRow.db_address
      console.info(this.addressItems )
      //  aurora instance need
      if (paramsRow.cloud_name === 'aws') {
        this.instancesItems = paramsRow.ext_info.db_instance_info
      }
      this.addressDialog = {
        show: true,
        title: paramsRow.name,
        cloudName: paramsRow.cloud_name,
      }
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
    // 每页条数
    handlePageSize(val) {
      this.initPara.page_size = val
      this.handleGetData()
    },
    // table 选中的ID
    handleSelect (val) {
      let selectIdList = []
      val.forEach(item => {
        selectIdList.push(item.id)
      })
      this.selectList = selectIdList
    },
    // 清空table已选择
    clearSelectAll() {
      this.$refs.selection.selectAll(false)
    },
    handleClear(e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSerachChangge() {
      this.initPara.search_address = ''
      this.initPara.searchVal = ''
    },
    handleDel() {
      this.$Modal.confirm({
        title: '二次确认',
        content: '确定删除已选中的数据? ',
        onOk: () => {
          optrationMysQL(
            {
              id_list: this.selectList,
            },
            'delete',
          ).then((res) => {
            if (res.code === 0) {
              this.$Notice.success({ title: `${res.msg}` })
              this.handleGetData()
            } else {
              this.$Notice.error({ title: `${res.msg}` })
            }
          })
        },
        onCancel: () => {
          this.$Message.info('回头是岸~')
          this.clearSelectAll()
        },
      })
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
  },
}
</script>
