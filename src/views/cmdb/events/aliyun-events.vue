<!-- eslint-disable max-len -->
<template>
  <Card>
    <Input v-model="initPara.searchVal" style="width: 350px; margin: 2px" search placeholder="输入关键字模糊搜索" @on-search="handleSearch"/>
    <span style="margin-left: 20px">一键筛选：</span>
    <Checkbox v-model="initPara.filter_status" style="margin-left: 10px"  @on-change="handlefilter()">待处理事件</Checkbox>
    <Table size="small" :columns="columns" :data="tableData"  @on-sort-change="handleSort" ></Table>
    <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left">
        <Page :total="pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" :page-size-opts="[12, 35, 50, 100]" show-sizer show-total 
        @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
      </div>
    </div>
  </Card>
</template>

<script>
import { getAliyunEventslist } from '@/api/cloud/events.js'

export default {
    components: {},
    data() {
        return {
            tableData: [],
            pageTotal: 0,
            initPara: {
              page_number: 1,
              page_size: 12,
              searchVal: null,
              order_by: "event_end_time",      //排序字段
              order: "descend", //排序 ascend descend
            },
            columns: [
                {
                    title: 'ID',
                    key: 'id',
                    align: 'center',
                    width: 80,
                    sortable: true,
                },
                {
                    title: '账号',
                    width: 210,
                    key: 'account_id',
                    align: 'center',
                    sortable: true,
                },
                {
                    title: '服务',
                    width: 150,
                    key: 'event_service',
                    align: 'center',
                    sortable: true,
                },
                {
                    title: '类型',
                    width: 200,
                    key: 'event_type',
                    tooltip: true,
                    align: 'left',
                    sortable: true,
                },
                {
                    title: '实例ID',
                    key: 'event_instance_id',
                    align: 'left',
                    minWidth: 120,
                    sortable: true,
                    tooltip: true,
                    render: (h, params) => h(
                        'a',
                        {
                            on: {
                                click: () => {
                                    this.handleDetail(params.index)
                                },
                            },
                        },
                        params.row.event_instance_id,
                    ),
                },
                {
                    title: '实例名称',
                    key: 'event_instance_name',
                    align: 'left',
                    minWidth: 200,
                    sortable: true,
                },
                {
                    title: '开始时间',
                    width: 180,
                    key: 'event_start_time',
                    sortable: true,
                },
                {
                    title: '结束时间',
                    width: 180,
                    key: 'event_end_time',
                    sortable: true,
                },
                {
                    title: '状态',
                    key: 'event_status',
                    width: 100,
                    align: 'center',
                    sortable: true,
                    render: (h, params) => {
                        const state = params.row.event_status
                        if (state === '待处理') {
                            return h('div', [
                                h(
                                    'tag',
                                    {
                                        props: {
                                            color: 'error'
                                        },
                                        style: {
                                            marginRight: '4px',
                                        },
                                    },
                                    '待处理',
                                ),
                            ])
                        } else {
                        return h('div', [
                            h(
                                'tag',
                                    {
                                        props: {
                                            color: 'success'
                                        },
                                        style: {
                                            marginRight: '4px',
                                        },
                                    },
                                state,
                            ),
                            ])
                        }              
                    },
                },
            ],
        }
    },
    mounted() {
        this.handleGetData()
    },
    methods: {
    // tableData
        async handleGetData() {
            const res = await getAliyunEventslist(this.initPara)
            if (res.code === 0) {
                this.tableData = res.data
                this.pageTotal = res.count
            } else {
                this.$Message.error(`${res.msg}`)
            }
        },
        handleDetail(index) {
            this.$Modal.info({
                width: '950px',
                title: '阿里云事件信息',
                content: `账号：${this.tableData[index].account_id}<br>
            事件ID：${this.tableData[index].event_id}<br>
            实例ID：${this.tableData[index].event_instance_id}<br>
            实例名称：${this.tableData[index].event_instance_name}<br>
            事件状态：${this.tableData[index].event_status}<br>
            事件类型：${this.tableData[index].event_type}<br>
            开始时间：${this.tableData[index].event_start_time}<br>
            结束时间：${this.tableData[index].event_end_time}<br>
            备注：${this.tableData[index].event_detail}<br>
`,
            })
      },
      handleSort (column, key, order) {
        this.initPara.order = column.order === "asc" ? 'ascend' : 'descend'
        this.initPara.order_by = column.key
        this.handleGetData()
      },
      // 每页条数
      handlePageSize(val) {
          this.initPara.page_size = val
          this.handleGetData()
      },
      // 切换分页
      handlerChangePage(val) {
          this.initPara.page_number = val
          this.handleGetData()
      },
      handleSearch() {
        this.initPara.page_number = 1;
        this.handleGetData();
      },
      handlefilter(val) {
        this.initPara.page_number = 1
        this.handleGetData()
      },
    },
}
</script>
