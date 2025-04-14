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
      <DatePicker class="search-input" :value="selectDate" :options="optionsDate" @on-change="handlerChangeDate"
       type="daterange" placement="bottom-end" placeholder="Select date" style="width: 220px"></DatePicker>
        <Button class="template__header__search__button" @click="getTableData"
          >搜索</Button
        >
      </div>
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

  </div>
</template>
<!-- eslint-disable camelcase -->

<script>
import { getAuditList } from '@/api/cmdb';

export default {
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
          title: '日志ID',
          key: 'id',
          width: 100,
        },
        {
          title: 'UUID',
          key: 'exec_uuid',
          width: 240,
        },
        {
          title: '业务名称',
          key: 'business_name',
          align: 'center',
          minWidth: 100,
        },
        {
          title: '模块名称',
          key: 'module_name',
          width: 100,
          align: 'center',
        },
        {
          title: '日志信息',
          key: 'message',
          width: 800,
          align: 'center',
        },
        {
          title: '日志时间',
          key: 'create_time',
          width: 160,
          align: 'center',
        },
        {
          title: '操作人',
          key: 'operator',
          width: 160,
          align: 'center',
        },
      ],
      tableData: [],
      selectDate: [],
      optionsDate: {
        shortcuts: [
          {
            text: '一星期',
            value () {
              const end = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24)
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            },
            onClick: (picker) => {
            }
          },
          {
            text: '一个月',
            value () {
              const end = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24)
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            },
            onClick: (picker) => {
            }
          },
          {
            text: '三个月',
            value () {
              const end = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24)
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            },
            onClick: (picker) => {
            }
          }
        ]
      },
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
    this.getDates();
  },
  methods: {
    handlerChangeDate (value) {
      this.selectDate = value
    },
    getDates () {
      const start = new Date()
      const end = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24)
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
      this.selectDate = [start, end]
      //
    },


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
        this.searchParams['start_date'] = this.selectDate[0]
        this.searchParams['end_date'] = this.selectDate[1]
        const { data, count } = await getAuditList(this.searchParams);
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
