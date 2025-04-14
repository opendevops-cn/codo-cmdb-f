<template>
  <div>
    <div class="search-con search-con-top">
       <Input class="search-input" v-model="initPara.searchVal" search :maxlength='50' @on-search="handleSearch"  placeholder="输入关键字搜索" />
        <Button type="error" class="search-add-btn" @click="handleDel" :disabled="selectList.length !== 0 ? false : true">批量删除</Button>
    </div>

    <Table ref="selection" size="small"  :columns="tableColumns" :data="tableData" :loading="i.tableLoading"
     @on-sort-change="handleSort"  @on-selection-change="handleSelect" ></Table>

      <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
        <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
          :page-size-opts="[15, 50, 100, 1000]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
      </div>
    </div>

  </div>
</template>

<script>
import { getVPC,optVPC } from '@/api/cloud/vpc.js'
export default {
  data () {
    return {
      tableColumns: [
        {
            type: "selection",
            key: "",
            width: 60,
            align: "center"
        },
        {
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
        {
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
            const text = row.state === '运行中' ? '运行中' : row.state === '关机' ? '已关机' : row.state === '创建中' ? '创建中' : row.state === '未同步' ? '未同步' :  row.state
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
          title: 'VPC ID',
          key: 'instance_id',
          tooltip: true,
          width: 200
        },
        {
          title: '名称',
          key: 'vpc_name',
          tooltip: true,
          sortable: true,
          width: 300
        },
        {
          title: '地域',
          key: 'region',
          minWidth: 90
        },
        {
          title: '网段',
          key: 'cidr_block_v4',
          tooltip: true,
          minWidth: 130
        },
        {
          title: '虚拟子网',
          key: 'vpc_switch',
          tooltip: true,
          minWidth: 220
        },
        {
          title: '更新时间',
          key: 'update_time',
          width: 170
        }

      ],
      tableData: [],
      selectList: [],
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
    }
  },
  methods: {
    handleGetData () {
      getVPC(this.initPara).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.i.pageTotal = res.count;
        } else {
          this.i.pageTotal = 0
          this.tableData = []
        }
        this.clearSelectAll();
        this.i.tableLoading = false;
      })
    },
    handleDel() {
      this.$Modal.confirm({
          title: "二次确认",
          content: "确定删除已选中的数据？",
          onOk: () => {
              optVPC({ id_list: this.selectList }, "delete").then(res => {
                  if (res.code === 0) {
                      this.$Message.success(res.msg);
                      this.handleGetData();
                  }
                  else {
                      this.$Notice.error({ title: `${res.msg}` });
                  }
              });
          },
          onCancel: () => {
              this.$Message.info("回头是岸~");
          },
      });
    },
    // 详细信息
    handlerDetail (value) {
      this.redisData = value
      this.modalData.show = true
    },
    handleSelect(val) {
        let selectIdList = [];
        val.forEach(item => {
            selectIdList.push(item.id);
        });
        this.selectList = selectIdList;
    },
    // 清空table已选择
    clearSelectAll() {
        this.$refs.selection.selectAll(false);
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
  .search {
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
</style>
