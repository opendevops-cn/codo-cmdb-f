<template>
  <div>
    <Drawer v-model="modalData.show" :closable="false" style="background-color: #f8f8f9" width="950">
      <div class="search-con search-con-top">
        <Input class="search-input" v-model="initPara.searchVal" search :maxlength='250' @on-search="handleSearch" placeholder="输入关键字搜索" />
      </div>
      <Table ref="selection" size="small"  :columns="tableColumns" :data="tableData" :loading="i.tableLoading"
        @on-sort-change="handleSort" ></Table>

      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
            :page-size-opts="[15, 50, 100, 1000]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { getDomainLog } from '@/api/domain/domain.js'
export default {
  name: 'optLog',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      tableData: [],
      tableColumns: [
        {
          title: '操作时间',
          width: 150,
          key: 'update_time',
          sortable: true,
        },
        {
          title: '用户',
          key: 'username',
          align: 'center',
          sortable: true,
          width: 100,
        },
        {
          title: '行为',
          key: 'action',
          align: 'center',
          width: 100,
        },
        {
          title: '记录',
          key: 'record',
          sortable: true,
          minWidth: 150,
        }
      ],
      i: {
          pageTotal: 0,
          tableLoading: true
      },
      initPara: {
          page_number: 1,
          page_size: 15,
          searchVal: null,
          domain_name: "",
          order_by: "update_time",      //排序字段
          order: "descend", //排序 ascend descend
      },

    }
  },
  methods: {
    handleCancel () {
       this.$emit('drawer-close')
    },
    handleGetData () {
      getDomainLog(this.initPara).then(res => {
        if (res.code == 0) {
          this.tableData = res.data;
          this.i.pageTotal = res.count;
        } else {
          this.i.pageTotal = 0
          this.tableData = []
        }
        this.i.tableLoading = false;
      })
    },
    handleSort (column, key, order) {
      this.initPara.order = column.order === "asc" ? 'ascend' : 'descend'
      this.initPara.order_by = column.key
      this.handleGetData()
    },
    handleSearch() {
        this.initPara.page_number = 1;
        this.handleGetData();
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
  }

}
</script>
