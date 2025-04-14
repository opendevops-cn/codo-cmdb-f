<template>
  <div>
    <Card dis-hover :bordered="false">
      <Alert show-icon> 业务信息从权限中心同步，请联系管理员添加。 </Alert>
      <div>
      </div>
         <div class="search-con search-con-top">
          <Input class="search-input"  v-model="initPara.searchVal" search @on-search="handleSearch" :maxlength="50" placeholder="输入关键字全局搜索" />
          <!-- <Button  @click="handCreate" class="search-btn">添加业务</Button> -->
        </div>

      <Table size="small" ref="selection" :columns="columns" :data="tableData" @on-sort-change="handleSort"></Table>
      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
            :page-size-opts="[10, 15, 50, 100]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
        </div>
      </div>
    </Card>
    <!-- 添加 -->
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading="true" :footer-hide="true" width="750">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="中文名称" prop="biz_cn_name">
          <Input v-model="formValidate.biz_cn_name" :maxlength="120" placeholder="请输入中文名称,不可重复"></Input>
        </FormItem>

        <FormItem label="英文名称" prop="biz_en_name">
          <Input v-model="formValidate.biz_en_name" :maxlength="120" placeholder="请输入英文名称"></Input>
        </FormItem>

        <FormItem label="运维同学" prop="biz_opser">
          <Input v-model="formValidate.biz_opser" :maxlength="120" placeholder="请输入运维负责人"></Input>
        </FormItem>

        <FormItem label="研发同学" prop="biz_developer">
          <Input v-model="formValidate.biz_developer" :maxlength="120" placeholder="请输入研发负责人"></Input>
        </FormItem>
        <FormItem label="测试同学" prop="biz_tester">
          <Input v-model="formValidate.biz_tester" :maxlength="120" placeholder="请输入测试负责人"></Input>
        </FormItem>

        <FormItem label="生命周期" prop="life_cycle">
          <Select v-model="formValidate.life_cycle" placeholder="生命周期">
            <Option value="开发中">开发中</Option>
            <Option value="测试中">测试中</Option>
            <Option value="已上线">已上线</Option>
            <Option value="停运">停运</Option>
          </Select>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { getBusinesslist, operationBusiness } from "@/api/cmdb";

export default {
  data() {
    return {
      modalMap: {
        loading: false,
        modalVisible: false,
        modalTitle: "添加",
      },
      initPara:{
        page_number: 1,
        page_size: 10,
        searchVal: null,
        order_by: "biz_id",      //排序字段
        order: "ascend", //排序 ascend descend
      },
      i:{
        pageTotal: 0, //总数
        tableLoading: false
      },
      selectList: [],
      method_data: null, // 请求方法
      formValidate: {},
      tableData: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "业务ID",
          key: "biz_id",
          align: "center",
          width: 100,
          sortable: true,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleDetail(params.index);
                  },
                },
              },
              params.row.biz_id
            );
          },
        },
        {
          title: "业务(中文名)",
          key: "biz_cn_name",
          minWidth: 150,
          align: "center",
          sortable: true,
        },
        {
          title: "业务(英文名)",
          key: "biz_en_name",
          minWidth: 150,
          align: "center",
          sortable: true,
        },
        {
          title: "生命周期",
          key: "life_cycle",
          align: "center",
          width: 120,
          sortable: true,
          render: (h, params) => {
            let life_cycle = params.row.life_cycle;
            if (life_cycle === "已上线") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "green" },
                  },
                  "已上线"
                ),
              ]);
            } else if (life_cycle === "开发中") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "blue" },
                  },
                  "开发中"
                ),
              ]);
            } else if (life_cycle === "测试中") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "geekblue" },
                  },
                  "测试中"
                ),
              ]);
            } else if (life_cycle === "停运") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "red" },
                  },
                  "停运"
                ),
              ]);
            }
          },
        },
        {
          title: "运维同学",
          minWidth: 100,
          key: "biz_opser",
          align: "center",
        },
        {
          title: "开发同学",
          key: "biz_developer",
          align: "center",
          minWidth: 100,
        },
        {
          title: "测试同学",
          key: "biz_tester",
          align: "center",
          minWidth: 100,
        },
        {
          title: "更新时间",
          key: "update_time",
          align: "center",
          sortable: true,
          width: 180,
        },
        {
          title: "操作",
          key: "handle",
          width: 90,
          // fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.formValidate = this.rowToConfig(params.row);
                      this.modalMap.modalVisible = true;
                      this.modalMap.modalTitle = "编辑业务";
                      this.method_data = "put";
                    },
                  },
                },
                "编辑"
              ),
            ]);
          },
        },
      ],
      ruleValidate: {
        biz_cn_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur",
          },
        ],
        biz_en_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur",
          },
        ],
        life_cycle: [
          {
            required: true,
            message: "请输入生命周期",
            trigger: "blur",
          },
        ],
        biz_opser: [
          {
            required: true,
            message: "请输入维护人员",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleGetData() {
      getBusinesslist(this.initPara).then(res => {
          if (res.code === 0) {
            this.tableData = res.data;
            this.i.pageTotal = res.count;
          } else {
            this.$message.error(`${res.msg}`);
          }
        }
      );
    },
    // view
    handleDetail(index) {
      this.$Modal.info({
        width: 30,
        title: "业务信息",
        content: `中文名称：${this.tableData[index].biz_cn_name}<br>
        英文名称：${this.tableData[index].biz_en_name}<br>
        生命周期：${this.tableData[index].life_cycle}<br>
        运维人员：${this.tableData[index].biz_opser}<br>
        开发人员：${this.tableData[index].biz_developer}<br>
        测试人员：${this.tableData[index].biz_tester}<br>
        创建时间：${this.tableData[index].create_time}<br>
        最后一次更新时间：${this.tableData[index].update_time}
        `,
      });
    },

    // 添加
    handCreate () {
      this.$Message.success("联系管理添加");
      // this.method_data = "post";
      // this.formValidate = {};
      // this.modalMap.modalVisible = true;
      // this.modalMap.modalTitle = "新增业务";
    },
    // 提交
    handleSubmit(value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          setTimeout(() => {
            operationBusiness(this.formValidate, this.method_data).then(res => {
                if (res.code === 0) {
                  this.$Message.success(`${res.msg}`);
                  this.handleGetData();
                  this.modalMap.modalVisible = false;
                } else {
                  this.$Message.error(`${res.msg}`);
                }
              }
            );
          }, 500);
        } else {
          this.$Message.error("缺少必要参数");
        }
      });
    },
    rowToConfig(row, biz_id = row.biz_id) {
      return {
        ...row,
        biz_id: biz_id,
      };
    },
    handleSearch () {
      this.initPara.page_number = 1
      this.handleGetData()
    },
    handleSort (column, key, order) {
      this.initPara.order = column.order === "asc" ? 'ascend' : 'descend'
      this.initPara.order_by = column.key
      this.handleGetData()
    },
    // 切换分页
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

    // 重置
    handleReset(name) {
      this.$refs[name].resetFields();
    },
  },
  mounted() {
    this.handleGetData();
  },
};
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;

  .search {
    &-input {
      display: inline-block;
      width: 400px;
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