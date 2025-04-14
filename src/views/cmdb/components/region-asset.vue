<template>
  <Drawer v-model="modalData.show" @on-close='handleCancel'  :title="modalData.title" :styles="styles" width="70%" draggable :mask-closable='false' >
      
    <div class="search-con search-con-top">
      <div class="search-col"><b>选择主机:</b></div>
      <Cascader  class="search-input" :data="treeData" v-model="topoList"  change-on-select @on-change="handleChange" placeholder="通过拓扑选择主机"></Cascader>
    </div>

    <Table size="small"  :columns="columns" :data="tableData" ></Table>

      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
            :page-size-opts="[15, 50, 100]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
        </div>
      </div>

    <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="handleCancel">取消</Button>
        <Button style="margin-right: 8px"  type="warning" @click="handleSubmit()">关联</Button>
    </div>
  </Drawer>
</template>
<script>
import { getServiceTreelist, getTreeAsset } from '@/api/service-tree'
export default {
  components: {},
  name: 'regionAsset',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      topoList: [],
      params: {},
      treeData: [],
      initPara:{
        page_number: 1,
        page_size: 15,
        searchVal: null,
      },
      i: {
        pageTotal: 0, //总数
        tableLoading: false
      },
      tableData: [],
      columns: [
        {
          title: "环境",
          key: "env_name",
          width: 100,
          align: "center",
        },
          {
          title: "集群",
          key: "region_name",
          minWidth: 120,
          maxWidth: 150,
          align: "center",
        },
         {
          title: "模块",
          key: "module_name",
          minWidth: 120,
          maxWidth: 170,
          align: "center",
        },
         {
          title: "资源名",
          key: "name",
          minWidth: 150,
          align: "center",
        },
        {
          title: "内网IP",
          key: "inner_ip",
          minWidth: 120,
          maxWidth: 170,
          align: "center",
        },
        {
          title: "状态",
          key: "state",
          minWidth: 110,
          maxWidth: 140,
          align: "center",
        },
      ],
      styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
      },
    }
  },
  methods: {
    handleCancel () {
      this.$emit('close')
    },
    async handleGetData() {
      const res = await getServiceTreelist();
      if (res.code == 0) {
        this.treeData = res.data
        this.changeId2(this.treeData ,'title','label','value')
      } else {
       this.$Notice.error({ title: `${res.msg}` });
      }
    },
    async handleGetAssetData () {
      this.params = Object.assign(this.params, this.initPara)
      const res = await getTreeAsset(this.params);
      if (res.code == 0) {
        this.tableData = res.data
        this.i.pageTotal = res.count
      } else {
       this.$Notice.error({ title: `${res.msg}` });
      }
    },
    changeId2(objAry, key, newkey, newkey2) {
      if (objAry != null) {
        objAry.forEach((item) => {
          Object.assign(item, {
            [newkey]:  item[key],
            [newkey2]: item[key],
          });
          this.changeId2(item.children, key, newkey, newkey2);
        });
      }
    },
    // 选中后预览
    handleChange (value) {
      this.params = {
        asset_type: 'server'
      }
      if (value.length >= 1 ) {
         this.params['biz_cn'] = value[0]
      }
      if (value.length >= 2 ) {
         this.params['env_name'] = value[1]
      }
      if (value.length >= 3 ) {
         this.params['region_name'] = value[2]
      }
      if (value.length == 4 ) {
         this.params['module_name'] = value[3]
      }
      // console.info('params', this.params)
      this.handleGetAssetData()
    },
    handleSubmit(){
      this.$emit('relevance', {id: this.modalData.id, topoParams: this.params})
    },
        // 分页
    handlerChangePage (value) {
      this.initPara.page_number = value
      this.handleGetAssetData()
    },
    handlePageSize (value) {
      this.initPara.page_number = 1
      this.initPara.page_size = value
      this.handleGetAssetData()
    },
  },
  watch: {
  },
  computed: {
  },
  //
  mounted () {
    this.handleGetData()
  }
}
</script>
<style>
    .drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;

  .search {
    &-col {
      display: inline-block;
      width: 80px;
      margin-left: 2px;
    }
    &-input {
      display: inline-block;
      width: 450px;
      margin-left: 2px;
    }

    &-btn {
      margin-left: 10px;
    }

    &-add-btn {
      margin-right: 10px;
    }
  }
}
</style>