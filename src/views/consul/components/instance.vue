<template>
  <Card  dis-hover :bordered="false">
      <Alert type="success" show-icon>
          当前服务组 {{ serverName }}，共 {{ i.pageTotal }} 条。
          <a  @click="handleCancel"> 返回上一级</a>
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
      </Alert>

      <div class="search-con search-con-top">
        <Input class="search-input"  v-model="searchVal" search @on-search="handleSearch"   placeholder="输入关键字搜索..." />
        <Button class="search-add-btn" @click="handleAdd">添加</Button>
        <Button type="error" class="search-add-btn" @click="handleDel" :disabled="selectList.length !== 0 ? false : true">批量删除</Button>
      </div>

      <Table size="small" ref="selection" :columns="columns" :data="tableData"  @on-selection-change="handleSelect"></Table>

      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal > 0 ? pageTotal : instanceList.length" :current="pageNum" :page-size="pageSize" show-total show-sizer placement="top" :page-size-opts="[15, 50, 1000]" 
            :transfer="true" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
        </div>
      </div>
      <!-- Meta数据展示 -->
      <modal title="Meta数据展示" v-model="modalVisible" :width="650">
        <vue-json-pretty :data="jsonData" />
      </modal>

  </Card>
</template>
<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import {  getConsulInstances, optConsulInstances } from "@/api/consul";
export default {
  components: {
    VueJsonPretty
  },
  name: 'ConsulInstance',
  props: {
    serverName: {
      type: String,
      default: null
    },
  },
  data () {
    return {
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      searchVal: '', //查找
      selectList: [],
      i: {
        pageTotal: 0, //总数
        tableLoading: false
      },
      jsonData: {},
      modalVisible: false,
      tableData: [],
      instanceList: [],
      columns: [
        {
          type: "selection",
          key: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "实例ID",
          key: "ServiceID",
          minWidth: 120,
          // align: "center",
        },
          {
          title: "地址",
          key: "ServiceAddress",
          minWidth: 120,
          maxWidth: 150,
          // align: "center",
        },
         {
          title: "端口",
          key: "ServicePort",
          minWidth: 110,
          maxWidth: 130,
          align: "center",
        },
         {
          title: "Tags",
          key: "ServiceTags",
          minWidth: 130,
          // align: "center",
          render: (h, params) => {
          let tags = params.row.ServiceTags;
          return h(
            "div",
            { 
              style: { 
              }
            },
            tags.map( item  => {
              return h('span', [
                h(
                  'Tag',
                  {
                    props: { color: 'cyan' },
                    style: {
                      marginRight: "6px",
                    },
                  },
                  item,
                ),
              ])
            })
          );
  
        }
          
        },
        {
          title: "Meta",
          key: "ServiceMeta",
          minWidth: 110,
          maxWidth: 130,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleDetail(params.row);
                  },
                },
              },
              "展开"
            );
          },
        },
        {
          title: "状态",
          key: "ServiceWeights",
          minWidth: 110,
          maxWidth: 130,
          render: (h, params) => {
            const status = params.row.ServiceWeights.Passing ? '正常' : '异常'
            if (status === '正常') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'green' },
                  },
                  status,
                ),
              ])
            }else if (status === '异常') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'red' },
                  },
                  status,
                ),
              ])
            }
             
         },
        },
      ],
    }
  },
  methods: {
    handleCancel () {
      this.$emit('close')
    },
    async handleGetData() {
      const res = await getConsulInstances({'server': this.serverName});
      if (res.code == 0) {
        this.instanceList = res.data
        this.i.pageTotal = res.count
      } else {
       this.$Notice.error({ title: `${res.msg}` });
      }
    },
    handleAdd () {
       this.$Notice.success({ title: '自动同步不香吗？' });
    },

    handleDel () {
      this.$Modal.confirm({
        title: "提醒",
        content: `<p>确认要删除，当前为自动同步数据!</p>`,
        onOk: () => {
          optConsulInstances({id_list:  this.selectList}, "delete").then((res) => {
            if (res.code === 0) {
              this.$Notice.success({ title: `${res.msg}` });
              this.handleGetData()
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
        selectIdList.push(item.ServiceID)
      })
      this.selectList = selectIdList
    },
    handleDetail(paramsRow) {
      this.jsonData = paramsRow.ServiceMeta
      this.modalVisible = true;
    },
    checkExist (item) {
      let MetaData = JSON.stringify(item.ServiceMeta)
      return item.ServiceID.indexOf(this.searchVal) >= 0 || item.ServiceAddress.indexOf(this.searchVal) >= 0 || item.ServiceTags.indexOf(this.searchVal) >= 0 || MetaData.indexOf(this.searchVal) >= 0
    },
    handleSearch () {
      if (this.searchVal) {
        this.pageNum = 1
        this.tableData = this.instanceList.filter(this.checkExist)
        this.pageTotal = this.tableData.length
      } else {
        this.pageNum = 1
        this.handleGetData()
      }
    },
        // 分页
    setCurrentPageData () { 
      let begin = (this.pageNum - 1) * this.pageSize;
      let end = this.pageNum * this.pageSize;
      this.tableData = this.instanceList.slice(begin, end);
    },
    handlerChangePage (value) {
      this.pageNum = value
      this.setCurrentPageData()
    },
    handlePageSize (value) {
      this.pageNum = 1
      this.pageSize = value
      this.setCurrentPageData()
    },
  },
  watch: {
    instanceList (val) {
      this.tableData = val
      this.setCurrentPageData()
    },
  },
  computed: {

  },
  //
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
      width: 450px;
      margin-left: 2px;
    }

    &-back-btn {
      margin-right: 1px;
      float: right;
    }

    &-add-btn {
      margin-left: 2px;
      margin-right: 3px;
    }
  }
}
</style>