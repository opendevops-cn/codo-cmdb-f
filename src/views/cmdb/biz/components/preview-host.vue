<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <Modal v-model="dialog.show" title="预览主机" width="950" :mask-closable="false" :footer-hide="true">
      <alert>一共查询到:{{ totalCount }}条数据</alert>
      <Input v-model="searchVal" style="width: 330px; margin: 0px" clearable placeholder="输入实例ID、主机名、内网IP搜索" @keydown.enter.native="handleFilter" @on-change="handleFilter" search/>



      <div style="margin-top: 5px">
        <Table stripe border size="small" :columns="columns" :data="tableData" ref="table"/>
      </div>

      <div style="margin: 10px; overflow: hidden">
        <Page :total="totalCount" :current="pageNum" :page-size="pageSize" show-total @on-change="handlerChangePage" />
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "PreViewHost",
  props: {
    dialog: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      serverList: [], // 初始总数
      serverFilteredList: [],
      tableData: [],
      searchVal: "",
      pageTotal: 0,
      pageSize: 10,
      pageNum: 1,
      filterState: undefined,
      filterAgentStatus: undefined,
      columns: [
        {
          title: "实例ID",
          key: "instance_id",
          align: "center",
          sortable: true,
        },
        {
          title: "主机名称",
          key: "name",
          align: "center",
          minWidth: 100,
          sortable: true,
        },
        {
          title: "内网IP",
          key: "inner_ip",
          align: "center",
          width: 140,

          sortable: true,
        },
        {
          title: "外网IP",
          key: "outer_ip",
          align: "center",
          width: 140,
          sortable: true,
        },
        {
          title: "运行状态",
          key: "state",
          align: "center",
          width: 135,
          sortable: true,
          render: (h, params) => {
            const { row } = params
            // eslint-disable-next-line no-nested-ternary
            const color = row.state === "运行中" ? "success" : row.state === "关机" ? "error" : row.state === "创建中" ? "primary" : "error"
            // eslint-disable-next-line no-nested-ternary
            const text = row.state === "运行中" ? "运行中" : row.state === "关机" ? "已关机" : row.state === "创建中" ? "创建中" : "Fail"
            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color,
                },
              },
              text,
            )
          },
          filterMultiple: false,
          filters: [
            { label: "运行中", value: "运行中" },
            { label: "已关机", value: "关机" },
            { label: "创建中", value: "创建中" },
            { label: "Fail", value: "Fail" },
          ],

          filterRemote: (value, row) => {
            this.filterState = value[0]
            this.handleFilter()
          },
        },
        {
          title: "Agent状态",
          key: "agent_status",
          align: "center",
          width: 135,
          sortable: true,
          render: (h, params) => {
            const status = params.row.agent_status
            if (status == "1") {
              return h("div", [h("Tag", { props: { color: "green", type: "border" } }, "在线")])
            } if (status == "2") {
              return h("div", [h("Tag", { props: { color: "red" } }, "离线")])
            }
            return h("div", [h("Tag", { props: { color: "error" } }, "未知")])
          },
          filterMultiple: false,
          filters: [
            { label: "在线", value: "1" },
            { label: "离线", value: "2" },
            { label: "未知", value: "error" },
          ],
          filterRemote: (value, row) => {
            this.filterAgentStatus = value[0]
            this.handleFilter()
          },
        },
      ],
    }
  },
  computed: {
    totalCount() {
      return this.serverFilteredList.length
    },
  },
  watch: {

    "dialog.show": function (newVal) {
      if (newVal) {
        this.initData()
        this.setCurrentPageData()
      }
    },
  },
  methods: {
    handlerChangePage(value) {
      this.pageNum = value
      this.setCurrentPageData()
    },
    // 分页处理
    setCurrentPageData() {
      const begin = (this.pageNum - 1) * this.pageSize
      const end = this.pageNum * this.pageSize
      this.tableData = this.serverFilteredList.slice(begin, end)
    },
    checkExecList(item) {

      return (item.instance_id.indexOf(this.searchVal) >= 0 || item.name.indexOf(this.searchVal) >= 0 || item.inner_ip.indexOf(this.searchVal) >= 0) && (!this.filterState || item.state === this.filterState || this.filterState === "Fail" && !["运行中", "关机", "创建中"].includes(item.state)) && (!this.filterAgentStatus || item.agent_status === this.filterAgentStatus || this.filterAgentStatus === "error" && !["1", "2"].includes(item.agent_status))
    },
    // 前端搜索和筛选
    handleFilter() {
      this.pageNum = 1
      if (this.searchVal || this.filterState||this.filterAgentStatus) {
        this.serverFilteredList = this.serverList.filter(this.checkExecList)
      } else {
        this.serverFilteredList = this.serverList
      }

      this.setCurrentPageData()
    },
    initData() {
      this.serverFilteredList = this.serverList
      this.pageNum = 1
      this.pageSize = 10
      this.searchVal = ""
      this.filterState = undefined
      this.filterAgentStatus = undefined

      // 重置筛选状态，运行状态和Agent状态两个列有筛选,都要重置。handleFilterReset这个方法文档中没有，是查了源码找到的
      this.$refs.table.handleFilterReset(4);
      this.$refs.table.handleFilterReset(5);

    },
  },
}
</script>
