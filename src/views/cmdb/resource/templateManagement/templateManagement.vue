<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div>
    <div class="template__header">
      <div class="template__header__search">
        <Input
          v-model="searchParams.searchVal"
          class="template__header__search__input"
          placeholder="请输入搜索内容"
        />
        <Button class="template__header__search__button" @click="getTableData"
          >搜索</Button
        >
      </div>
      <Button type="primary" @click="handleAddddTemplate">创建模板</Button>
    </div>
    <Table
      ref="selection"
      stripe
      size="small"
      :loading="tableLoading"
      :columns="columns"
      :data="tableData"
    />
    <!-- 分页 -->
    <div
      style="
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
        overflow: hidden;
      "
    >
      <Page
        :total="pageTotal"
        :current="searchParams.page_number"
        :page-size="searchParams.page_size"
        :page-size-opts="[12, 35, 50, 100]"
        show-sizer
        show-total
        @on-change="changePage"
        @on-page-size-change="handlePageSize"
      />
    </div>

    <Modal
      v-model="showCloneModal"
      title="克隆模板"
      :loading="cloneModalLoading"
      :width="60"
      @on-ok="colneModalOk"
      @on-cancel="cloneModalCancel"
    >
      <div class="clone-modal__content">
        <Form ref="form" :model="cloneFormValues">
          <FormItem
            prop="name"
            label="模板名称"
            :label-width="100"
            :rules="{
              required: true,
              message: '模板名称必填',
              trigger: 'change',
            }"
          >
            <Input v-model="cloneFormValues.name" />
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal
      v-model="showDeleteModal"
      title="删除模板"
      :loading="deleteModalLoading"
      @on-ok="deleteModalOk"
      @on-cancel="deleteModalCancel"
    >
      确认删除模板吗？
    </Modal>
    <AddTemplateModal
      :show="showModal"
      :buyRow="buyRow"
      @closeAddModal="closeAddModal"
      @addSuccessCallback="addSuccessCallback"
    />
    <EditTemplate
      :show="showDrawer"
      :row="curRow"
      @closeDrawer="closeDrawer"
      @editSuccessCallback="editSuccessCallback"
    />
  </div>
</template>
<!-- eslint-disable camelcase -->

<script>
import {
  getOrderTemplateList,
  createOrderTemplate,
  deleteOrderTemplate,
} from '@/api/cmdb';

import AddTemplateModal from './addTemplate.vue';
import EditTemplate from './editTemplate.vue';

export default {
  components: {
    AddTemplateModal,
    EditTemplate,
  },
  data() {
    return {
      buyRow: null,
      pageTotal: 0,
      showDrawer: false,
      showDeleteModal: false,
      deleteModalLoading: true,
      curRow: {},
      showModal: false,
      showCloneModal: false,
      cloneModalLoading: true,
      tableLoading: false,
      cloneFormValues: {
        name: '',
      },
      columns: [
        {
          title: '资源ID',
          key: 'id',
          width: 100,
        },
        {
          title: '模板名称',
          key: 'name',
          align: 'center',
          minWidth: 160,
          render: (h, params) =>
            h('div', [
              h(
                'div',
                {
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer',
                  },
                  on: {
                    click: () => {
                      this.showDrawer = true;
                      this.curRow = params.row;
                    },
                  },
                },
                params.row.name
              ),
            ]),
        },
        {
          title: '子网信息',
          key: 'subnet_name',
          width: 400,
          align: 'center',
        },
        {
          title: '模板类型',
          key: 'res_type_alias',
          width: 120,
          align: 'center',
        },
        {
          title: '云厂商',
          key: 'vendor_alias',
          width: 120,
          align: 'center',
        },
        {
          title: '更新时间',
          key: 'update_time',
          width: 160,
          align: 'center',
        },
        {
          title: '最后一次使用时间',
          key: 'last_time',
          width: 160,
          align: 'center',
        },
        {
          title: '修改人',
          key: 'modify_user',
          width: 160,
          align: 'center',
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) =>
            h('div', [
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'text',
              //       size: 'small',
              //     },
              //     style: {
              //       color: '#2d8cf0',
              //     },
              //     on: {
              //       click: () => {
              //         this.showModal = true;
              //         this.buyRow = params.row;
              //       },
              //     },
              //   },
              //   '购买'
              // ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    color: '#2d8cf0',
                  },
                  on: {
                    click: () => {
                      this.cloneFormValues.name = `${params.row.name}-克隆`;
                      this.curRow = params.row;
                      this.showCloneModal = true;
                    },
                  },
                },
                '克隆'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    color: '#ed4014',
                  },
                  on: {
                    click: () => {
                      this.curRow = params.row;
                      this.showDeleteModal = true;
                    },
                  },
                },
                '删除'
              ),
            ]),
          width: 200,
        },
      ],
      tableData: [],
      searchParams: {
        page_number: 1,
        page_size: 12,
        order_by: 'id',
        order: 'descend',
        searchVal: '',
      },
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleAddddTemplate() {
      this.buyRow = null;
      this.showModal = true;
    },
    editSuccessCallback() {
      this.showDrawer = false;
      this.getTableData();
    },
    closeDrawer() {
      this.showDrawer = false;
    },
    async deleteModalOk() {
      try {
        const { id } = this.curRow;
        const res = await deleteOrderTemplate({
          id_list: [id],
        });
        if (!res) {
          throw new Error('请求错误，请重试');
        }
        this.showDeleteModal = false;
        this.$Message.success(res.msg);
        this.getTableData();
      } catch (err) {
        this.$Message.error(err.message);
        this.deleteModalLoading = false;
      } finally {
        this.$nextTick(() => {
          this.deleteModalLoading = true;
        });
      }
    },
    deleteModalCancel() {
      this.showDeleteModal = false;
    },
    addSuccessCallback() {
      this.showModal = false;
      this.getTableData();
    },
    closeAddModal() {
      this.showModal = false;
    },
    cloneModalCancel() {
      this.showCloneModal = false;
    },
    async colneModalOk() {
      try {
        await new Promise((resolve, reject) => {
          this.$refs.form.validate((v) => {
            if (!v) {
              reject(new Error('表单校验失败，请检查'));
            }
            resolve();
          });
        });
        const {
          account_id,
          vendor,
          cloud_region_id,
          res_type,
          region,
          zone,
          instance_type,
          tags,
          vpc_id,
          vpc_name,
          subnet_id,
          subnet_name,
          content,
        } = this.curRow;
        const res = await createOrderTemplate({
          name: this.cloneFormValues.name,
          account_id,
          vendor,
          cloud_region_id,
          res_type,
          region,
          zone,
          instance_type,
          tags,
          vpc_id,
          vpc_name,
          subnet_id,
          subnet_name,
          content,
          description: this.cloneFormValues.description || '',
        });
        if (!res) {
          throw new Error('请求错误，请重试');
        }
        this.showCloneModal = false;
        this.$Message.success(res.msg);
        this.getTableData();
      } catch (err) {
        this.$Message.error(err.message);
        this.cloneModalLoading = false;
      } finally {
        this.$nextTick(() => {
          this.cloneModalLoading = true;
        });
      }
    },
    async getTableData() {
      try {
        this.tableLoading = true;
        const { data, count } = await getOrderTemplateList(this.searchParams);
        this.pageTotal = count;
        this.tableData = data;
      } catch (err) {
        this.$Message.error(err.message);
      } finally {
        this.tableLoading = false;
      }
    },
    handleShowModal(show) {
      this.showModal = show;
    },
    // 每页条数
    handlePageSize(val) {
      this.searchParams.page_size = val;
      this.getTableData();
    },
    // 切换分页
    changePage(val) {
      this.searchParams.page_number = val;
      this.getTableData();
    },
  },
};
</script>

<style scoped lang="less">
.template__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  &__search {
    display: flex;
    &__input {
      margin-right: 20px;
      width: 200px;
    }
  }
}

.clone-modal__content {
  padding: 0 30px;
}

/deep/ .ivu-table-wrapper {
  max-height: calc(~'100vh - 200px');
  .ivu-table-body {
    max-height: calc(~'100vh - 280px');
    overflow-y: auto;
  }
}
</style>
