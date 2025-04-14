<template>
  <Card>
    <Input style="width: 300px; margin: 2px" @on-change="handleClear" clearable placeholder="输入关键字模糊搜索" v-model="searchParams.searchVal" @keydown.enter.native="handleSearch" />
    <Button type="default" @click="handleSearch()" icon="ios-search">搜索</Button>
    <span style="margin-left: 20px">一键筛选：</span>
    <Button @click="handlefilter('upcoming')" style="margin: 3px">未处理事件</Button>
    <Table size="small" :columns="columns" :data="tableData"></Table>
    <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left">
        <Page :total="pageTotal" :current="searchParams.page_number" :page-size="searchParams.page_size" :page-size-opts="[12, 35, 50, 100]" show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
      </div>
    </div>
  </Card>

</template>

<script>
import { getAwsEventslist } from '@/api/cloud/events.js';
export default {
  components: {},
  data() {
    return {
      tableData: [],

      pageTotal: 10,
      searchParams: {
        page_number: 1,
        page_size: 12,
      },
      columns: [
        {
          title: "ID",
          key: "id",
          align: "center",
          width: 80,
          sortable: true,
        },
        {
          title: "账号ID",
          width: 160,
          key: "event_account_id",
          align: "center",
          sortable: true,
        },
        {
          title: "类型",
          width: 380,
          key: "event_type",
          tooltip: true,
          align: "left",
          sortable: true,
        },
        {
          title: "实例ID",
          key: "event_instnace_id",
          align: "left",
          sortable: true,
          ellipsis: true,
          tooltip: true,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleDetail(params.index);
                  },
                },
              },
              params.row.event_instnace_id
            );
          },
        },
        {
          title: "主机名",
          key: "event_name",
          align: "left",
          minWidth: 150,
          sortable: true,
        },
        {
          title: "区域",
          maxWidth: 150,
          key: "event_region",
          align: "center",
          sortable: true,
        },
        {
          title: "服务",
          width: 150,
          key: "event_service",
          align: "center",
          sortable: true,
        },
        {
          title: "开始时间(UTC)",
          width: 180,
          key: "event_start_time",
          align: "center",
          sortable: true,
        },
        {
          title: "状态",
          key: "event_status",
          width: 100,
          align: "center",
          sortable: true,

          render: (h, params) => {
            let state = params.row.event_status;
            if (state == "upcoming") {
              return h("div", [
                h(
                  "tag",
                  {
                    props: {
                      color: "error"
                    },
                    style: {
                      marginRight: "4px",
                    },
                  },
                  "未处理"
                ),
              ]);
            } else {
              return h("div", [
                h(
                  "tag",
                  {
                    props: {
                      color: "success"
                    },
                    style: {
                      marginRight: "4px",
                    },
                  },
                  "已处理"
                ),
              ]);
            }
          },
        },
      ],
    };
  },
  methods: {
    // tableData
    async getTableData() {
      const res = await getAwsEventslist(this.searchParams);
      if (res.code === 0) {
        this.tableData = res.data;
        this.pageTotal = res.count;
      } else {
        this.$Message.error(`${res.msg}`);
      }
    },
    handleDetail(index) {
      this.$Modal.info({
        width: "950px",
        title: "AWS Events 事件信息",
        content: `账号：${this.tableData[index].event_account_id}<br>
            区域：${this.tableData[index].event_region}<br>
            实例ID：${this.tableData[index].event_instnace_id}<br>
            实例名称：${this.tableData[index].event_name}<br>
            事件状态：${this.tableData[index].event_status}<br>
            事件类型：${this.tableData[index].event_type}<br>
            事件开始时间：${this.tableData[index].event_start_time}<br>
            事件ID：${this.tableData[index].event_arn}<br>
`,
      });
    },
    handleClear(e) {
      if (e.target.value === "") this.tableData = this.value;
    },
    // 每页条数
    handlePageSize(val) {
      this.searchParams.page_size = val;
      this.getTableData();
    },
    // 切换分页
    changePage(val) {
      this.searchParams.page_number = val;
      this.getTableData();
    },
    handleSearch() {
      this.searchParams.filter_status = "";
      this.searchParams.page_number = 1;
      this.getTableData();
    },
    handlefilter(val) {
      this.searchParams.filter_status = val;
      this.searchParams.page_number = 1;
      this.getTableData();
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>