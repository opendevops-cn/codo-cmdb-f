<template>
   <div>
    <Card v-if="!showEdit" dis-hover :bordered="false">
      <Alert type="info" show-icon style="margin-left: 1px;">
          使用说明：
          <Icon type="ios-bulb-outline" slot="icon"></Icon>
          <template slot="desc">
            <p>CMDB同步拓扑以及关联数据到consul，为监控等服务提供数据源做服务发现，默认只同步和业务关联的数据并把业务数据放入Meta数据，业务ID放入Tag。</p>
            <p>可以根据Tags来区分业务，提供给多区域的Prometheus使用。</p>
          </template>
        </Alert>

      <div>
        <Affix :offset-top="50" style="padding-bottom: 15px">
          <Input class="search-input" v-model="searchVal" search @on-search="handleSearch"  placeholder="查询..." />
        </Affix>
        
        <Row :gutter="10">

          <i-col v-for="(item, index) in serverData" :key="index" :xxl="6" :xl="6" :lg="8" :md="12" :sm="12">
            <Card style="margin: 0 1px 10px; text-align: center;" >
              <p slot="title" class="card-title"  @click="handlePreview(item.name)">
               {{ item.name }}
              </p>

              <Tooltip max-width="200"  :transfer="true">
                <div style="margin: 5px 0px 5px; height: 25px; overflow:hidden;">     
                  <span v-for="tag in item.tags" >
                    <Tag color="cyan">{{ tag }}</Tag>
                  </span>
                </div>

                <div slot="content">
                  <span v-for="tag in item.tags" >
                    <span style="padding: 2px;">{{ tag }}  </span>
                  </span>
                </div>
              </Tooltip>

              <div style="padding-top: 8px; padding-bottom: 15px;">
                  <div style="float: left;">
                    {{ item.count }} instances 
                  </div>
                  
                  <div style="float: right;">
                    <Icon type="ios-thumbs-down" style="margin-left: 5px; margin-right: 5px;" /> {{ item.checks_critical }} 
                  </div>  
                  <div style="float: right;">
                    <Icon type="ios-thumbs-up" style="margin-left: 5px;" />  {{ item.checks_passing }} 
                  </div>
              </div>
          </Card>
        </i-col>
      </Row>
      <!-- 
        <List  item-layout="vertical" size="small">
          <ListItem v-for="item in tableData" :key="item.name">
              <ListItemMeta  :title="item.name"  @click.native="handlePreview(item.name)"/>
                <span v-for="tag in item.tags" >
                  <Tag color="blue" style="margin-left: 1px;">{{ tag }}</Tag>
                </span>
              <template slot="extra">
                <br>
                <Icon type="logo-tux" /> {{ item.count }} instances 
                <Icon type="ios-thumbs-up" style="margin-left: 5px;" />  {{ item.checks_passing }} 
                <Icon type="ios-thumbs-down" style="margin-left: 5px;" /> {{ item.checks_critical }}  
              </template>
          </ListItem>
       </List> -->

      </div>
      
    </Card>
      <consul-instance v-else :serverName="serverName"  @close="handleClose" />
  </div>
</template>

<script>
import { getConsulServices } from "@/api/consul";
import ConsulInstance from './components/instance.vue'

export default {
  components: {
    ConsulInstance
  },
  data() {
    return {
      showEdit: false,
      serverName: '',
      searchVal:null,
      // initPara:{
      //   page_number: 1,
      //   page_size: 15,
      //   searchVal: null,
      // },
      serverData: [],
      //
    };
  },
  methods: {
    // 获取
    async handleGetData() {
      const res = await getConsulServices();
      if (res.code == 0) {
        this.serverData = res.data;
      } else {
        this.$Message.error(res.msg)
      }
    },
    handleClose () {
      this.showEdit = false
      this.handleGetData()
    },
    // 预览
    async handlePreview (val) {
      this.serverName = val
      this.showEdit = !this.showEdit
    },
    checkExist (item) {
      let tags = JSON.stringify(item.tags)
      return item.name.indexOf(this.searchVal) >= 0 || tags.indexOf(this.searchVal) >= 0
    },
    handleSearch(){
      if (this.searchVal) {
        this.pageNum = 1
        this.serverData = this.serverData.filter(this.checkExist)
      } else {
        this.pageNum = 1
        this.handleGetData()
      }
    },
  },
  watch: {
    searchVal (val) {
      if (!val) {
         this.handleGetData()
      }
    }
  },
  mounted() {
    this.handleGetData();
  },
};
</script>
<style lang="less" scoped>
  .search-input{
    padding: 1px;
  }
  .card-title{
      font-weight: 600;
      max-width: 300px;
      margin-left: 0px;
      margin-bottom: 0px;
      color: #3399ff;
      font-size: 16px;
      line-height: 17px;
      cursor: pointer;
  }
</style>
