<!-- eslint-disable max-len -->
<template>
  <Card>
    <Input v-model="searchParams.search_val" style="width: 300px; margin: 2px" clearable placeholder="输入关键字模糊搜索" @on-change="handleClear" @keydown.enter.native="getTableData" />
    <Button type="default" icon="ios-search" @click="getTableData">搜索</Button>
    <Button type="default" icon="ios-add" style="margin-left: 8px" @click="handleAdd">添加标签</Button>
    <Table :columns="columns" :data="tableData" />
    <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left">
        <Page :total="pageTotal" :current="searchParams.page_number" :page-size="searchParams.page_size" :page-size-opts="[12, 35, 50, 100]" show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize" />
      </div>
    </div>
    <!-- 添加标签 -->
    <TagAdd :dialog="modalMapAdd" :form="formValidateAdd" @e-close="modalMapAdd.modalVisible = false" @e-update="getTableData" />
    <!-- 编辑标签 / 绑定资源 -->
    <TagEdit :dialog="modalMapEdit" :form="formValidateEdit" @e-close="modalMapEdit.modalVisible = false" @e-update="getTableData" />
  </Card>
</template>

<script>
// @ts-ignore
import { getTag, deleteTag } from '@/api/cmdb'
import TagAdd from './tag-add.vue'
import TagEdit from './tag-edit.vue'

export default {
  components: {
    TagAdd,
    TagEdit,
  },
  data() {
    return {
      tableData: [],
      //  添加标签，传给子组件
      modalMapAdd: {
        modalVisible: false,
        modalTitle: '创建标签',
      },
      formValidateAdd: {
        tags: [
          {
            index: 1,
            status: 1, // 0 表示删除
            tag_key: '',
            tag_value: '',
          },
        ],
        tag_detail: '', // 备注
      },
      // 编辑
      modalMapEdit: {
        modalVisible: false,
        modalTitle: '编辑/绑定资源',
      },
      formValidateEdit: {
        tag_id: '',
        tag_key: '',
        tag_value: '',
      },
      pageTotal: 10,
      searchParams: {
        page_number: 1,
        page_size: 12,
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
          title: '标签键',
          width: 200,
          key: 'tag_key',
          align: 'left',
          sortable: true,
        },
        {
          title: '标签值',
          minWidth: 200,
          key: 'tag_value',
          align: 'left',
          sortable: true,
        },
        {
          title: '主机',
          width: 100,
          align: 'center',
          key: 'count',
          render: (h, params) => h('div', [
            h(
              'Tag',
              {
                style: {
                  // color: '',
                },
              },
              params.row.count.server,
            ),
          ]),
        },
        {
          title: '数据库',
          width: 100,
          align: 'center',
          key: 'count',
          render: (h, params) => h('div', [
            h(
              'Tag',
              {
                style: {
                  // color: '',
                },
              },
              params.row.count.mysql,
            ),
          ]),
        },
        {
          title: '缓存',
          width: 100,
          align: 'center',
          key: 'count',
          render: (h, params) => h('div', [
            h(
              'Tag',
              {
                style: {
                  // color: '',
                },
              },
              params.row.count.redis,
            ),
          ]),
        },
        {
          title: '负载均衡',
          width: 100,
          align: 'center',
          key: 'count',
          render: (h, params) => h('div', [
            h(
              'Tag',
              {
                // nativeOn: {
                // click: () => {
                // console.log('Dev')
                // },
                // },
              },
              params.row.count.lb,
            ),
          ]),
        },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          align: 'center',
          render: (h, params) => h('div', [
            // h(
            //   'a',
            //   {
            //     style: {
            //       marginRight: '20px',
            //     },
            //     on: {
            //       click: () => {
            //         this.handleViewData(params.row)
            //       },
            //     },
            //   },
            //   'API',
            // ),
            h(
              'a',
              {
                style: {
                  marginRight: '20px',
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row)
                  },
                },
              },
              '编辑',
            ),
            h(
              'a',
              {
                style: {
                  color: 'red',
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row)
                  },
                },
              },
              '删除',
            ),
          ]),
        },
      ],
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    handleViewData(paramsRow) {
      const url = `${window.location.origin}/api/v2/cmdb/tag/asset_detail/?tag_key=${paramsRow.tag_key}&tag_value=${paramsRow.tag_value}`
      window.open(url, '_blank')
    },
    handleAdd() {
      this.modalMapAdd.modalVisible = true
    },
    handleEdit(paramsRow) {
      this.formValidateEdit = {
        tag_id: paramsRow.id,
        tag_key: paramsRow.tag_key,
        tag_value: paramsRow.tag_value,
      }
      this.modalMapEdit.modalVisible = true
    },
    handleDelete(paramsRow) {
      this.$Modal.confirm({
        title: '二次确认',
        content: `确定删除(${paramsRow.tag_key}:${paramsRow.tag_value})？有关联则不能删除。`,
        onOk: () => {
          deleteTag({ tag_id: paramsRow.id }).then((res) => {
            if (res.code === 0) {
              this.$Notice.success({ title: `${res.msg}` })
              this.getTableData()
            } else {
              this.$Notice.error({ title: `${res.msg}` })
            }
          })
        },
        onCancel: () => {
          this.$Message.info('回头是岸~')
        },
      })
    },
    // tableData
    async getTableData() {
      const { data, count } = await getTag(this.searchParams)
      this.tableData = data
      this.pageTotal = count
    },
    handleClear(e) {
      // @ts-ignore
      if (e.target.value === '') this.tableData = this.value
    },
    // 每页条数
    handlePageSize(val) {
      this.searchParams.page_size = val
      this.getTableData()
    },
    // 切换分页
    changePage(val) {
      this.searchParams.page_number = val
      this.getTableData()
    },
  },
}
</script>
