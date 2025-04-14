<template>
  <div>
    <div class="search-con search-con-top">
      <Input class="search-input" v-model="initPara.searchVal" search :maxlength='50' @on-search="handleSearch"  placeholder="输入关键字搜索" />
      <Button type="primary" class="search-add-btn" @click="handleAdd">添加</Button>
      <span style="margin-left: 20px">一键筛选：</span>
      <RadioGroup  type="button" v-model="initPara.cloud_type" button-style="solid" @on-change="handleSearch">
        <Radio label="neiwang">内网</Radio>
        <Radio label="cloud">云商</Radio>
      </RadioGroup>
       <Checkbox  v-model="initPara.is_not_default" style="margin-left: 10px"  @on-change="handleSearch">非默认</Checkbox>
      <Button type="error" class="search-add-btn" @click="handleDel" :disabled="selectList.length !== 0 ? false : true">批量删除</Button>
    </div>

    <Table ref="selection" size="small" border :columns="columns" :data="tableData" :loading="i.tableLoading" 
     @on-sort-change="handleSort"  @on-selection-change="handleSelect" ></Table>

      <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
        <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
          :page-size-opts="[15, 50, 100, 1000]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
      </div>
    </div>

    <VswitchDetail :switchData="formData" :modal-data="modalData" />
    <vswitch-add :formData="formData" :modal-data="modalDataAdd" @drawer-close="handleClose" @save-data="handleSaveData"/>
    <region-modal  ref="regionModal"  :modal-data="modalDataRegion" @save-data="handleUpData"></region-modal>
  </div>
</template>

<script>
import { getVswitch, optVswitch } from '@/api/cloud/vswitch.js'
import VswitchDetail from '../components/vswitch-detail.vue'
import vswitchAdd from '../components/vswitch-add.vue'
import regionModal from '../components/set-cloud-region.vue'
export default {
    components: { VswitchDetail, vswitchAdd, regionModal },
    data() {
        return {
            columns: [
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
                  const text = row.state === '运行中' ? '运行中' : row.state === '关机' ? '已关机' : row.state === '创建中' ? '创建中' : row.state === '未同步' ? '未同步' : row.state
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
                  title: "交换机名称",
                  key: "name",
                  tooltip: true,
                  sortable: true,
                  resizable: true,
                  minWidth: 150
                },
                {
                    title: "资源ID",
                    key: "instance_id",
                    tooltip: true,
                    resizable: true,
                    width: 210,
                    render: (h, params) => {
                    return h('a', {
                      on: {
                        click: () => {
                          this.handlerDetail(params.row)
                        }
                      }
                    }, params.row.instance_id

                    )
                  }
                },
                {
                    title: "VPC",
                    key: "vpc_id",
                    tooltip: true,
                    sortable: true,
                    resizable: true,
                    width: 150
                },
                {
                    title: "地域",
                    key: "region",
                    sortable: true,
                    resizable: true,
                    minWidth: 90
                },
                {
                    title: "网段",
                    key: "cidr_block_v4",
                    tooltip: true,
                    resizable: true,
                    width: 130
                },
                {
                    title: "可用IP",
                    key: "address_count",
                    minWidth: 80
                },
                {
                  title: "描述",
                  key: "description",
                  tooltip: true,
                  resizable: true,
                  minWidth: 100
                },
                {
                  title: '云区域',
                  key: 'handle',
                  width: 120,
                  // align: 'center',
                  render: (h, params) => h('div', [
                    h(
                      'a',
                      {
                        on: {
                          click: () => {
                            this.handleShowRegion(params.row)
                          },
                        },
                      },
                      '查看',
                    ),
                  ]),
                },
                {
                  title: "更新时间",
                  key: "update_time",
                  sortable: true,
                  width: 170
                }
          ],
          modalData: {
            show: false,
            title: '虚拟子网详情',
          },
          modalDataAdd: {
            show: false,
            title: '添加虚拟子网',
            action: 'post'
          },
          modalDataRegion: {
            show: false,
            title: '选择云区域',
            action: 'put'
          },
          selectList: [],
          formData: {},
          tableData: [],
          i: {
              pageTotal: 0,
              tableLoading: true
          },
          initPara: {
              page_number: 1,
              page_size: 15,
              cloud_type: null,
              is_not_default: true,
              searchVal: null,
              order_by: "name",      //排序字段
              order: "ascend", //排序 ascend descend
          },
        };
    },
    methods: {
      async handleGetData() {
          const res = await getVswitch(this.initPara);
          if (res.code == 0) {
              this.tableData = res.data;
              this.i.pageTotal = res.count;
          }
          else {
              this.$Message.error(res.msg);
          }
          this.clearSelectAll();
          this.i.tableLoading = false;
      },
      handleClose () {
        this.modalData.show = false;
        this.modalDataAdd.show = false;
        this.modalDataRegion.show = false
        this.handleGetData()
      },
      handleAdd () {
        this.modalDataAdd.show = true;
      },
      handleSaveData (saveData, action) {
        optVswitch(saveData, action).then(res => {
          if (res.code == 0) {
            this.$Message.success('成功')
            this.handleClose()
          } else {
            this.$Message.error(res.msg)
          }
        })
      },
        // 删除
      handleDel() {
          this.$Modal.confirm({
              title: "二次确认",
              content: "确定删除已选中的数据？",
              onOk: () => {
                  optVswitch({ id_list: this.selectList }, "delete").then(res => {
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
      handleShowRegion (paramsRow) {
        this.modalDataRegion.show = true;
        this.$refs.regionModal.cloud_region_id = paramsRow.cloud_region_id
        this.modalDataRegion.title = `选择云区域 【${paramsRow.name}】`
        this.modalDataRegion.id = paramsRow.id;
      },
      handleUpData (upData) {
        // {id_list: this.selectList, cloud_region_id: cloud_region_id }
        optVswitch(upData, 'patch').then(res => {
          if (res.code == 0) {
            this.$Message.success('成功')
            this.handleClose()
          } else {
            this.$Message.error(res.msg)
          }
        })
      },
      // 详细信息
      handlerDetail(paramsRow) {
          this.formData = paramsRow;
          this.modalData.show = true;
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
    watch: {},
    computed: {},
    mounted() {
        this.handleGetData();
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
      margin-right: 3px;
    }
    &-add-btn {
      margin-left: 2px;
      margin-right: 3px;
    }
  }
}
</style>
