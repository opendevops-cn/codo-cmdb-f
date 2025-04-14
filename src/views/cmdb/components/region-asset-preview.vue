<template>
    <Drawer v-model="modalData.show" @on-close='handleCancel'  :title="modalData.title" width="70%" draggable  >
      <div class="search-con search-con-top">
          <Input class="search-input"  v-model="initPara.searchVal" search @on-search="handleSearch"  @keydown.enter.native="handleSearch" placeholder="输入关键字全局搜索" />
<!--           <Button type="error" class="search-btn" :disabled="selectList.length !== 0 ? false : true"   @click="handleDel">解除关联</Button>-->
      </div>

      <Table size="small" ref="selection"  :columns="columns" :data="tableData" @on-selection-change="handleSelect"></Table>

      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
            :page-size-opts="[15, 50, 100]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
        </div>
      </div>

    </Drawer>
</template>
<script>
import { previewCloudRegion } from '@/api/cloud-region'
export default {
  components: {},
  name: 'regionAssetPreview',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      initPara:{
        page_number: 1,
        page_size: 15,
        searchVal: null,
      },
      i: {
        pageTotal: 0, //总数
        tableLoading: false
      },
      selectList: [],
      tableData: [],
      columns: [
         {
            type: "selection",
            key: "selection",
            width: 60,
            align: "center",
        },
        {
          title: "ID",
          key: "id",
          minWidth: 100,
          align: "center",
        },
         {
          title: "资源名",
          key: "name",
          minWidth: 150,
          align: "center",
        },
        {
         title: "云厂商",
          key: "cloud_name",
          minWidth: 150,
          align: "center",
        },
          {
         title: "地域",
          key: "region",
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
    }
  },
  methods: {
    handleCancel () {
      this.$emit('close')
    },
    async handleGetData () {
      this.initPara = Object.assign(this.initPara, { region_id: this.modalData.region_id })
      const res = await previewCloudRegion( this.initPara);
      if (res.code == 0) {
        this.tableData = res.data
        this.i.pageTotal = res.count
      } else {
       this.$Notice.error({ title: `${res.msg}` });
      }
    },
    handleDel () {
      this.$emit('del', { id_list: this.selectList, region_id: this.modalData.region_id })
    },
 
    handleSelect (val) {
      let selectIdList = []
      val.forEach(item => {
        selectIdList.push(item.id)
      })
      this.selectList = selectIdList
    },
    handleSearch () {
      this.initPara.page_number = 1
      this.handleGetData()
    },
    // 分页
    handlerChangePage (value) {
      this.initPara.page_number = value
      this.handleGetData()
    },
    handlePageSize (value) {
      this.initPara.page_number = 1
      this.initPara.page_size = value
      this.handleGetData()
    },
  },
  watch: {
  },
  computed: {
  },
  //
  mounted () {
  }
}
</script>

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