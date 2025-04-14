<template>
  <div class="search">
    <Card>
      <Row v-show="openSearch" @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="70">
          <FormItem label="名称" prop="name">
            <Input v-model="searchForm.name" type="text" placeholder="请输入名称" clearable style="width: 200px" />
          </FormItem>
          <FormItem style="margin-left:-35px;" class="br">
            <Button type="primary" icon="ios-search" @click="handleSearch">搜索</Button>
            <Button @click="handleReset">重置</Button>
          </FormItem>
        </Form>
      </Row>
      <Row align="middle" justify="space-between" class="operation">
        <div>
          <Button type="primary" icon="md-add" @click="add">添加</Button>
          <Button icon="md-trash" @click="delAll">批量删除</Button>
        </div>
        <div class="icons">
          <Tooltip content="刷新" placement="top" transfer>
            <Icon type="md-refresh" size="18" class="item" @click="getDataList" />
          </Tooltip>
          <Tooltip :content="openSearch ? '关闭搜索' : '开启搜索'" placement="top" transfer>
            <Icon type="ios-search" size="18" class="item tip" @click="openSearch = !openSearch" />
          </Tooltip>
          <Tooltip :content="openTip ? '关闭提示' : '开启提示'" placement="top" transfer>
            <Icon type="md-bulb" size="18" class="item tip" @click="openTip = !openTip" />
          </Tooltip>
          <Tooltip content="表格密度" placement="top" transfer>
            <Dropdown trigger="click" @on-click="changeTableSize">
              <Icon type="md-list" size="18" class="item" />
              <DropdownMenu slot="list">
                <DropdownItem :selected="tableSize == 'default'" name="default">默认</DropdownItem>
                <DropdownItem :selected="tableSize == 'large'" name="large">宽松</DropdownItem>
                <DropdownItem :selected="tableSize == 'small'" name="small">紧密</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Tooltip>
          <Tooltip content="导出数据" placement="top" transfer>
            <Icon type="md-download" size="18" class="item" @click="exportData" />
          </Tooltip>
        </div>
      </Row>
      <Alert v-show="openTip" show-icon>
        已选择 <span class="select-count">{{ selectList.length }}</span> 项
        <a class="select-clear" @click="clearSelectAll">清空</a>
      </Alert>
      <Table ref="table" :loading="loading" border :columns="columns" :data="data" :size="tableSize" sortable="custom"
             @on-sort-change="changeSort" @on-selection-change="changeSelect" />
      <Row type="flex" justify="end" class="page">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" :page-size-opts="[10,20,50]"
              size="small" show-total show-elevator show-sizer @on-change="changePage"
              @on-page-size-change="changePageSize" />
      </Row>
    </Card>
    <Modal v-model="modalVisible" :title="modalTitle" :mask-closable="false" :width="500">
      <Form ref="form" :model="form" :rules="formValidate" :label-width="100" label-position="left">
        <FormItem label="名称" prop="name">
          <Input v-model="form.name" clearable />
        </FormItem>
        <FormItem label="开关" prop="is_enable">
          <i-switch v-model="form.is_enable" />
        </FormItem>
        <FormItem label="创建时间" prop="create_time">
          <TimePicker v-model="form.create_time" type="time" clearable style="width:100%" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
//   import { shortcuts } from "@/libs/shortcuts";
export default {
  name: 'LbTest',
  components: {
  },
  data() {
    return {
      tableSize: 'default',
      openSearch: true, // 显示搜索
      openTip: true, // 显示提示
      loading: true, // 表单加载状态
      modalType: 0, // 添加或编辑标识
      modalVisible: false, // 添加或编辑显示
      modalTitle: '', // 添加或编辑标题
      searchForm: { // 搜索框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: 'createTime', // 默认排序字段
        order: 'desc', // 默认排序方式
      },
      form: { // 添加或编辑表单对象初始化数据
        name: '',
        is_enable: true,
        create_time: '',
      },
      // 表单验证规则
      formValidate: {
        name: [{
          type: 'string', required: true, message: '请输入', trigger: 'blur',
        }],
        is_enable: [{
          type: 'boolean', required: true, message: '请选择', trigger: 'change',
        }],
        create_time: [{ required: true, message: '请输入', trigger: 'change' }],
      },
      submitLoading: false, // 添加或编辑提交状态
      selectList: [], // 多选数据
      columns: [
        // 表头
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 120,
          sortable: true,
        },
        {
          title: '开关',
          key: 'is_enable',
          minWidth: 120,
          sortable: false,
        },
        {
          title: '创建时间',
          key: 'create_time',
          minWidth: 120,
          sortable: false,
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 150,
          render: (h, params) => h('div', [
            h(
              'a',
              {
                on: {
                  click: () => {
                    this.edit(params.row)
                  },
                },
              },
              '编辑',
            ),
            h('Divider', {
              props: {
                type: 'vertical',
              },
            }),
            h(
              'a',
              {
                on: {
                  click: () => {
                    this.remove(params.row)
                  },
                },
              },
              '删除',
            ),
          ]),
        },
      ],
      data: [], // 表单数据
      total: 0, // 表单数据总数
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getDataList()
    },
    changePage(v) {
      this.searchForm.pageNumber = v
      this.getDataList()
      this.clearSelectAll()
    },
    changePageSize(v) {
      this.searchForm.pageSize = v
      this.getDataList()
    },
    handleSearch() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getDataList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      // 重新加载数据
      this.getDataList()
    },
    changeSort(e) {
      this.searchForm.sort = e.key
      this.searchForm.order = e.order
      if (e.order === 'normal') {
        this.searchForm.order = ''
      }
      this.getDataList()
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false)
    },
    changeSelect(e) {
      this.selectList = e
    },
    changeTableSize(v) {
      this.tableSize = v
    },
    exportData() {
      this.$refs.table.exportCsv({
        filename: '数据',
      })
    },
    getDataList() {
      this.loading = true
      // 带多条件搜索参数获取表单数据 请自行修改接口
      // this.getRequest("请求路径", this.searchForm).then(res => {
      //   this.loading = false;
      //   if (res.success) {
      //     this.data = res.result.content;
      //     this.total = res.result.totalElements;
      //     if (this.data.length == 0 && this.searchForm.pageNumber > 1) {
      //       this.searchForm.pageNumber -= 1;
      //       this.getDataList();
      //     }
      //   }
      // });
      // 以下为模拟数据
      // this.data = [
      // ];
      this.total = this.data.length
      this.loading = false
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.modalType === 0) {
            // 添加 避免编辑后传入id等数据 记得删除
            delete this.form.id
            // this.postRequest("请求地址", this.form).then(res => {
            //   this.submitLoading = false;
            //   if (res.success) {
            //     this.$Message.success("操作成功");
            //     this.getDataList();
            //     this.modalVisible = false;
            //   }
            // });
            // 模拟请求成功
            this.submitLoading = false
            this.$Message.success('操作成功')
            this.getDataList()
            this.modalVisible = false
          } else {
            // 编辑
            // this.postRequest("请求地址", this.form).then(res => {
            //   this.submitLoading = false;
            //   if (res.success) {
            //     this.$Message.success("操作成功");
            //     this.getDataList();
            //     this.modalVisible = false;
            //   }
            // });
            // 模拟请求成功
            this.submitLoading = false
            this.$Message.success('操作成功')
            this.getDataList()
            this.modalVisible = false
          }
        }
      })
    },
    add() {
      this.modalType = 0
      this.modalTitle = '添加'
      this.$refs.form.resetFields()
      delete this.form.id
      this.modalVisible = true
    },
    edit(v) {
      this.modalType = 1
      this.modalTitle = '编辑'
      this.$refs.form.resetFields()
      // 转换null为""
      for (const attr in v) {
        if (v[attr] === null) {
          v[attr] = ''
        }
      }
      const str = JSON.stringify(v)
      const data = JSON.parse(str)
      this.form = data
      this.modalVisible = true
    },
    remove(v) {
      this.$Modal.confirm({
        title: '确认删除',
        // 记得确认修改此处
        content: '您确认要删除该条数据?',
        loading: true,
        onOk: () => {
          // 删除
          // this.deleteRequest("请求地址，如/deleteByIds/" + v.id).then(res => {
          //   this.$Modal.remove();
          //   if (res.success) {
          //     this.$Message.success("操作成功");
          //     this.clearSelectAll();
          //     this.getDataList();
          //   }
          // });
          // 模拟请求成功
          this.$Message.success('操作成功')
          this.clearSelectAll()
          this.$Modal.remove()
          this.getDataList()
        },
      })
    },
    delAll() {
      if (this.selectList.length <= 0) {
        this.$Message.warning('您还未选择要删除的数据')
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: `您确认要删除所选的 ${this.selectList.length} 条数据?`,
        loading: true,
        onOk: () => {
          let ids = ''
          this.selectList.forEach((e) => {
            ids += `${e.id},`
          })
          ids = ids.substring(0, ids.length - 1)
          // 批量删除
          // this.deleteRequest("请求地址，如/deleteByIds/" + ids).then(res => {
          //   this.$Modal.remove();
          //   if (res.success) {
          //     this.$Message.success("操作成功");
          //     this.clearSelectAll();
          //     this.getDataList();
          //   }
          // });
          // 模拟请求成功
          this.$Message.success('操作成功')
          this.$Modal.remove()
          this.clearSelectAll()
          this.getDataList()
        },
      })
    },
  },
}
</script>
<style lang="less">
.search {
    .operation {
        margin-bottom: 2vh;
    }

    .select-count {
        font-weight: 600;
        color: #40a9ff;
    }

    .select-title {
        font-weight: 600;
        color: #40a9ff;
    }

    .select-clear {
        margin-left: 10px;
    }

    .page {
        margin-top: 2vh;
    }

    .drop-down {
        margin-left: 5px;
    }
}

.tree-bar {
    overflow: auto;
    margin-top: 5px;
    position: relative;
    min-height: 80px;
}
// 设置每个组件间的间距，指定标签
.icons > * {
    margin-right: 10px;
}
.tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
}

.expand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .icon {
        cursor: pointer;
    }

    :hover {
        color: #1890ff !important;
    }
}
</style>
