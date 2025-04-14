<template>
  <Card dis-hover :bordered="false">
    <div>
      <div>
        <div class="search-con search-con-top">
          <Input
            class="search-input"
            v-model="initPara.searchVal"
            search
            :maxlength="100"
            @on-search="handleSearch"
            placeholder="输入关键字全局搜索"
          />
          <Button @click="handCreate()" style="margin: 3px">添加分组</Button>
        </div>
        <Table
          size="small"
          :columns="columns"
          :data="tableData"
          @on-sort-change="handleSort"
        ></Table>
      </div>
      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left">
          <Page
            :total="i.pageTotal"
            :current="initPara.page_number"
            :page-size="initPara.page_size"
            show-total
            show-sizer
            :page-size-opts="[15, 50, 100]"
            @on-change="handlerChangePage"
            @on-page-size-change="handlePageSize"
          />
        </div>
      </div>
    </div>
    <!-- 预览 -->
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中，请稍等一会...</div>
    </Spin>

    <preViewHost ref="previewHost" :dialog="dialog"></preViewHost>

    <permGroupEdit
      ref="dgEdit"
      :modal-data="modalData"
      :biz-list="bizList"
      @drawer-close="handleClose"
      @save-data="handleSaveData"
    ></permGroupEdit>
  </Card>
</template>

<script>
import 'vue-json-pretty/lib/styles.css';

import {
  getPermGrouplist,
  optPermGroup,
  preViewPermGroupHost,
  SyncPermGroup,
} from '@/api/cmdb/perm-group';
import { getBusinesslist } from '@/api/cmdb';
import preViewHost from './components/preview-host';
import permGroupEdit from './components/perm-group-edit.vue';

export default {
  components: {
    preViewHost,
    permGroupEdit,
  },
  data() {
    return {
      modalData: {
        show: false,
        title: '添加动态分组',
        id: null,
        action: 'post',
      },
      dialog: {
        show: false,
        title: '预览主机',
      },
      tableData: [],
      columns: [
        {
          title: 'UID',
          key: 'exec_uuid',
          minWidth: 200,
          maxWidth: 300,
        },
        {
          title: '分组名称',
          key: 'perm_group_name',
          align: 'center',
          tooltip: true,
          sortable: true,
          minWidth: 200,
        },
        {
          title: '权限类型',
          key: 'perm_type',
          align: 'center',
          sortable: true,
          minWidth: 40,
        },
        {
          title: '用户组',
          key: 'user_group',
          align: 'center',
          sortable: true,
          minWidth: 100,
          render: (h, params) => {
            return h('span', params.row.user_group.join(','));
          },
        },
        {
          title: '业务',
          key: 'biz_id',
          align: 'center',
          sortable: true,
          minWidth: 100,
          render: (h, params) => {
            let biz_id = params.row.biz_id;
            return h('p', this.bizMap[biz_id]);
          },
        },
        {
          title: '修改人',
          key: 'modify_user',
          align: 'center',
          width: 180,
        },
        {
          title: '更新时间',
          key: 'update_time',
          sortable: true,
          width: 180,
        },
        {
          title: '操作',
          key: 'handle',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => {
                      this.handlePreview(params.row);
                    },
                  },
                },
                '预览'
              ),
              h(
                'a',
                {
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row);
                    },
                  },
                },
                '编辑'
              ),
              h(
                'a',
                {
                  style: {
                    marginRight: '10px',
                  },
                  on: {
                    click: () => {
                      this.SyncPerm(params.row);
                    },
                  },
                },
                '同步'
              ),
              h(
                'a',
                {
                  style: {
                    color: 'red',
                    marginRight: '10px',
                  },
                  on: {
                    click: () => {
                      this.handleDel(params.row);
                    },
                  },
                },
                '删除'
              ),
            ]);
          },
        },
      ],
      bizList: [],
      bizMap: {},
      initPara: {
        page_number: 1,
        page_size: 15,
        searchVal: null,
        order_by: 'update_time', //排序字段
        order: 'descend', //排序 ascend descend
      },
      i: {
        pageTotal: 0, //总数
        tableLoading: true,
      },
      initForm: {
        biz_id: '501',
        perm_group_name: null,
        perm_type: '',
        perm_group_detail: '',
        perm_start_time: new Date(),
        jms_org_id: "00000000-0000-0000-0000-000000000002",
      },
      spinShow: false,
      // serverList: [{ name: "test" }],
    };
  },
  methods: {
    // 获取动态分组列表
    async handleGetData() {
      const res = await getPermGrouplist(this.initPara);
      if (res.code == 0) {
        this.tableData = res.data;
        this.i.pageTotal = res.count;
      } else {
        this.$Message.error(res.msg);
      }
      this.i.tableLoading = false;
    },
    async handleGetBizList() {
      const res = await getBusinesslist();
      this.bizList = res.data;
      this.bizList.forEach((ele) => {
        this.bizMap[ele.biz_id] = ele.biz_cn_name;
      });
    },
    handleClose() {
      this.modalData.show = false;
      this.handleGetData();
    },
    //创建分组
    handCreate() {
      // this.initForm.perm_group_name = null;
      // this.initForm.perm_group_detail = null;
      // this.theData = Object.assign(this.$options.data().theData, this.initForm)
      this.modalData = {
        show: true,
        action: 'post',
        title: '添加权限分组',
      };
      this.$refs.dgEdit.formValidate = this.initForm;
    },
    handleEdit(paramsRow) {
      this.modalData = {
        show: true,
        action: 'put',
        title: '编辑权限分组',
      };
      this.$refs.dgEdit.formValidate = this.rowToConfig(paramsRow);
      // this.$refs.dgEdit.handleGetEnv()
    },
    // 获取配置,编辑
    rowToConfig(row, id = row.id) {
      // let dynamic_group_dict = row.dynamic_group_rules;
      return {
        ...row,
        id: id,
        // dynamic_group_rules: dynamic_group_dict['items'], // 因为存数据库的时候是个JSON
      };
    },
    // 保存数据
    async handleSaveData(saveData, action) {
      console.info(saveData, action);
      const res = await optPermGroup(saveData, action);
      if (res.code === 0) {
        this.$Notice.success({ title: `${res.msg}` });
        this.handleClose();
      } else {
        this.$Notice.error({
          title: '发生错误',
          desc: `${res.msg}`,
        });
      }
    },
    // 保存数据
    async SyncPerm(saveData, action) {
      console.info(saveData, action)
      const body = {
        id: saveData.id,
      };
      const res = await SyncPermGroup(body, "post");
      if (res.code === 0) {
        this.$Notice.success({ title: `${res.msg}` });
        this.handleClose();
      } else {
        this.$Notice.error({
          title: '发生错误',
          desc: `${res.msg}`,
        });
      }
    },
    // 删除分组
    handleDel(paramsRow) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除分组 ' + paramsRow.perm_group_name + ' ?',
        // loading: true,
        onOk: () => {
          optPermGroup({ id_list: [paramsRow.id] }, 'delete').then((res) => {
            if (res.code === 0) {
              this.$Notice.success({ title: `${res.msg}` });
              this.handleClose();
            } else {
              this.$Notice.error({ title: `${res.msg}` });
            }
          });
        },
        onCancel: () => {
          this.$Message.info('回头是岸~');
        },
      });
    },

    // 预览动态分组主机
    async handlePreview(paramsRow) {
      // groupPreview
      this.spinShow = true;

      try {
        let res = await preViewPermGroupHost(paramsRow.exec_uuid);

        if (res.code !== 0) {
          this.$Message.error(`${res.msg}`);
          return;
        }
        this.$refs.previewHost.serverList = res.data;
        this.$refs.previewHost.setCurrentPageData();
        this.dialog.show = true;
      } catch (e) {
        this.$Message.error(e.toString());
      } finally {
        this.spinShow = false;
      }
    },
    handleSearch() {
      this.initPara.page_number = 1;
      this.handleGetData();
    },
    // 排序
    handleSort(column, key, order) {
      this.initPara.order = column.order === 'asc' ? 'ascend' : 'descend';
      this.initPara.order_by = column.key;
      this.handleGetData();
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
  created() {
    this.handleGetBizList();
  },
  mounted() {
    this.handleGetData();
  },
};
</script>
<style>
.drawer-footer {
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
      width: 200px;
    }
    &-input {
      display: inline-block;
      width: 400px;
      margin-left: 2px;
    }
    &-btn {
      margin-left: 10px;
    }
  }
}
</style>