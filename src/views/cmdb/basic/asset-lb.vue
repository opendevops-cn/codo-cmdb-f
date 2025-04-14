<!-- eslint-disable max-len -->
><template>
  <Card dis-hover :bordered="false">
    <Alert show-icon>
      已选择<span>{{ selectList.length }}</span>
      <a style="margin-left: 10px" @click="clearSelectAll">清空已选</a>
    </Alert>
    <Input v-model="initPara.searchVal" style="width: 300px; margin: 2px" clearable placeholder="输入关键字模糊搜索" @on-change="handleClear" @keydown.enter.native="handleSearch" />
    <Button style="margin: 3px" @click="handleSearch()">搜索</Button>
    <span style="margin-left: 20px">一键筛选：</span>
    <ButtonGroup>
      <Button v-if="initPara.search_filter === 'is_normal'" type="primary" @click="handlefilter('is_normal')">未过期</Button>
      <Button v-else @click="handlefilter('is_normal')">未过期</Button>
      <Button v-if="initPara.search_filter === 'is_expired'" type="primary" @click="handlefilter('is_expired')">已过期</Button>
      <Button v-else @click="handlefilter('is_expired')">已过期</Button>
    </ButtonGroup>
    <span style="margin-left: 20px">一键筛选：</span>
    <ButtonGroup>
      <Button v-if="initPara.search_filter === 'is_alb'" type="primary" @click="handlefilter('is_alb')">ALB</Button>
      <Button v-else @click="handlefilter('is_alb')">ALB</Button>
      <Button v-if="initPara.search_filter === 'is_slb'" type="primary" @click="handlefilter('is_slb')">SLB</Button>
      <Button v-else @click="handlefilter('is_slb')">SLB</Button>
      <Button v-if="initPara.search_filter === 'is_nlb'" type="primary" @click="handlefilter('is_nlb')">NLB</Button>
      <Button v-else @click="handlefilter('is_nlb')">NLB</Button>
    </ButtonGroup>
    <template v-if="selectList.length !== 0">
      <Button type="error" style="margin: 6px" @click="handleDel">一键删除</Button>
      <Button type="primary" class="search-btn" @click="exportData(2)">
        <Icon type="ios-download-outline" />导出数据
      </Button>
    </template>
    <Table ref="selection" size="small" :columns="columns" :data="tableData" @on-selection-change="handleSelect">
      <template #cloud_name="{ row }">
        <span v-if="row.cloud_name === 'qcloud'"><Tag color="geekblue">腾讯云</Tag></span>
        <span v-else-if="row.cloud_name === 'aliyun'"><Tag color="blue">阿里云</Tag></span>
        <span v-else-if="row.cloud_name === 'aws'"><Tag color="volcano">AWS</Tag></span>
        <span v-else-if="row.cloud_name === 'cds'"><Tag color="cyan">首都云</Tag></span>
        <span v-else-if="row.cloud_name === 'volc'"><Tag color="orange">火山云</Tag></span>
        <span v-else-if="row.cloud_name === 'gcp'"><Tag color="cyan">谷歌云</Tag></span>
      </template>
      <template #instance_id="{ row }">
        <a @click="handleDetail(row)">{{ row.instance_id }}</a>
      </template>
      <template #state="{ row }">
        <span v-if="row.state === '运行中'"><Tag type="dot" color="success">运行中</Tag></span>
        <span v-else><Tag type="dot" color="red">{{ row.state }}</Tag></span>
      </template>
      <template #endpoint_type="{ row }">
        <span v-if="row.endpoint_type === '内网'"><Tag color="blue">内网</Tag></span>
        <span v-else-if="row.endpoint_type === '公网'"><Tag color="green">公网</Tag></span>
        <span v-else ><Tag color="green">{{ row.endpoint_type }}</Tag></span>
      </template>
    </Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left">
        <Page :total="pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" :page-size-opts="[12, 35, 50, 100]" show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize" />
      </div>
    </div>
    <template v-if="formData">
      <LbDetail :form-data="formData" :modal-data="modalData" />
    </template>
  </Card>
</template>

<script>

import { getLBList, deleteLB } from '@/api/cloud/lb'
import LbDetail from '../components/lb-detail.vue'
export default {
  name: 'AssetLb',
  components: {
    LbDetail,
  },
  data() {
    return {
      modalData: {
        show: false,
        title: 'LB详情',
      },
      formData: {},
      selectList: [],
      tableData: [],
      pageTotal: 0,
      initPara: {
        page_size: 12,
        page_number: 1,
        searchVal: '',
        search_filter: 'is_normal',
        order_by: "",      //排序字段
        order: "ascend", //排序 ascend descend
      },
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
          title: '类型',
          key: 'type',
          align: 'center',
          width: 100,
        },
        {
          title: '实例ID',
          slot: 'instance_id',
          key: 'instance_id',
          align: 'left',
          minWidth: 100,
          sortable: true,
        },
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 120,
          sortable: true,
          tooltip: true,
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
          title: '网络',
          slot: 'endpoint_type',
          align: 'center',
          width: 100,
          key: 'endpoint_type',
        },
        {
          title: '地区',
          key: 'region',
          align: 'center',
          width: 150,
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
      const res = await getLBList(this.initPara)
      this.tableData = res.data
      this.pageTotal = res.count
    },
    handleClear(e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch() {
      this.initPara.page_number = 1
      this.handleGetData()
    },
    // 清空table已选择
    clearSelectAll() {
      this.$refs.selection.selectAll(false)
    },
    // table 选中的ID
    handleSelect (val) {
      let selectIdList = []
      val.forEach(item => {
        selectIdList.push(item.id)
      })
      this.selectList = selectIdList
    },
    // 切换分页
    changePage(val) {
      this.initPara.page_number = val
      this.clearSelectAll()
      this.handleGetData()
    },
    // 每页条数
    handlePageSize(val) {
      this.initPara.page_size = val
      this.clearSelectAll()
      this.handleGetData()
    },
    handlefilter(val) {
      this.initPara.search_filter = val
      this.handleGetData()
    },
    handleDetail(paramsRow) {
      this.formData = paramsRow
      this.modalData.show = true
    },
    handleDel() {
      this.$Modal.confirm({
        title: '二次确认',
        content: '确定删除已选中的数据? ',
        onOk: () => {
          deleteLB({id_list: this.selectList }).then((res) => {
            if (res.code === 0) {
              this.$Notice.success({ title: `${res.msg}` })
              this.handleGetData()
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
