<template>
  <div>
    <Card dis-hover :bordered="false">
      <Alert show-icon>
        在这里可以配置集群模板(比如某个集群下的模块是相同的)，方便在业务拓扑创建集群节点快速调用。
      </Alert>
      <div class="search-con search-con-top">
        <Input class="search-input"  v-model="searchVal" search @on-search="handleSearch"  @keydown.enter.native="handleSearch" placeholder="输入关键字全局搜索" />
        <Button class="search-btn" @click="handerAddTemp">添加</Button>
      </div>

      <Table ref="selection" size="small" :columns="columns" :data="tableData"></Table>

      <div style="margin: 10px; overflow: hidden">
        <div style="text-align:center">
          <span>共{{pageTotal}}条</span>
        </div>
      </div>
      <Modal title="集群模板" :rules="ruleValidate" v-model="viewSetTempModal" footer-hide width="900" :mask-closable="false">
        <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 900px">
          <FormItem label="名称" prop="temp_name">
            <Input style="max-width: 260px" v-model="formDynamic.temp_name" placeholder="请输入名称"></Input>
          </FormItem>
          <template v-for="(item, index) in formDynamic.items">
            <FormItem v-if="item.status" :key="index" label="模块">
              <Row  :gutter="10">
                <Col span="8">
                  <Input style="max-width: 260px" v-model="item.module_name"  maxlength="50" placeholder=""></Input>
                </Col>
                <Col span="12">
                <Input  v-model="item.ext_info" :autosize="true"  maxlength="5000" type="textarea" placeholder=""></Input>
                </Col>
                <Col span="2">
                <Button type="text" @click="handleRemove(index)">删除</Button>
                </Col>
              </Row>
            </FormItem>
          </template>
          <FormItem>
            <Row>
              <Col span="20">
              <Button type="dashed" long @click="handleAdd" icon="md-add">添加模块</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formDynamic')">提交</Button>
            <Button @click="handleReset('formDynamic')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
    <!-- JSON展示 -->
    <Drawer title="模块数据" v-model="modalVisible" :width="650">
      <vue-json-pretty :data="jsonData" />
    </Drawer>
    <temp-app :modalData="modalData"  @drawer-close="handleClose" @save-data="handleBatchSave"></temp-app>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import tempApp from "./components/temp-application.vue"
import { getSetTemplist, operationSetTemp, optBatchAPPTemp } from "@/api/cmdb";

export default {
  components: {
    VueJsonPretty,
    tempApp
  },
  data() {
    return {
      pageTotal: "",
      request_type: "",
      viewSetTempModal: false,
      searchVal: "",
      jsonData: {},
      modalVisible: false,
      modalData: {
        show: false,
        title: '批量应用模板',
        temp_id: null,
        name:'',
        action: 'put'
      },
      columns: [
        {
          title: "模板名称",
          key: "temp_name"
        },
        {
          title: "模块",
          key: "temp_data",
          align: "center",
          ellipsis: true,
          // tooltip: true,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleDetail(params.row);
                  },
                },
              },
              "View"
            );
          },
        },
        {
          title: "创建人",
          key: "create_user",
          align: "center",
          // sortable: true,
          // width: 150,
        },

        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          sortable: true,
          width: 180,
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
          width: 180,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.handlerEdit(params.row);
                    },
                  },
                },
                "编辑"
              ),
             h(
                "a",
                {
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.handerApp(params.row);
                    },
                  },
                },
                "批量应用"
              ),
              h(
                "a",
                {
                  style: {
                    color: 'red',
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.handlerDelete(params.row);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],

      tableData: [],
      index: 1,
      formDynamic: {
        items: [
          {
            index: 1, // 唯一索引
            status: 1, // 0：删除  1：启用
            module_name: "", // 模块名称
          },
        ],
      },
      ruleValidate: {
        temp_name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //
    async handleGetData() {
      const res = await getSetTemplist({ searchVal: this.searchVal });
      if (res.code === 0) {
        this.tableData = res.data;
        this.pageTotal = res.count;
      } else {
        this.$Message.error(`${res.msg}`);
      }
    },
    //
    resetfromDynamic() {
      return {
        temp_name: "",
        temp_data: "",
        items: [
          {
            index: 1, // 唯一索引
            status: 1, // 0：删除  1：启用
            module_name: "", // 模块名称
            ext_info:  "{}"  //扩展字段
          },
        ],
      };
    },
    handerAddTemp() {
      this.viewSetTempModal = true;
      this.request_type = "post";
      this.index = 1;
      this.formDynamic = this.resetfromDynamic();
    },

    async handleSubmit() {
      if (!this.formDynamic.temp_name) {
        this.$Notice.error({ title: "名称不能为空" });
        return;
      }

      for (var _index in this.formDynamic.items) {
        let module_name = this.formDynamic.items[_index]["module_name"];
        let status = this.formDynamic.items[_index]["status"];
        if (status === 1) {
          if (module_name === "" || !module_name) {
            this.$Notice.warning({ title: "模块存在空值！" });
            return;
          }
        }
      }

      const res = await operationSetTemp(this.formDynamic, this.request_type);
      if (res.code === 0) {
        this.$Message.success(`${res.msg}`);
        this.handleGetData();
        this.viewSetTempModal = false;
      } else {
        this.$Message.error(`${res.msg}`);
      }
    },
    rowToConfig(row, id = row.id) {
      return {
        ...row,
        id: id,
        items: row.temp_data.items,
      };
    },
    handlerEdit(paramsRow) {
      this.formDynamic = this.rowToConfig(paramsRow);
      this.request_type = "put";
      this.viewSetTempModal = true;
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleAdd() {
      this.index++;
      this.formDynamic.items.push({
        module_name: "",
        index: this.index,
        status: 1,
      });
    },
    handleRemove(index) {
      this.formDynamic.items[index].status = 0;
    },
    //
    handlerDelete(paramsRow) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除 " + paramsRow.temp_name + " ?",
        // loading: true,
        onOk: () => {
          operationSetTemp({ id_list: [paramsRow.id] }, "delete").then((res) => {
            if (res.code === 0) {
              this.$Notice.success({ title: `${res.msg}` });
              this.handleGetData();
            } else {
              this.$Notice.error({ title: `${res.msg}` });
            }
          });
        },
        onCancel: () => {
          this.$Message.info("回头是岸~");
        },
      });
    },
    // 查看关联数据
    handleDetail(paramsRow) {
      console.log(paramsRow);
      this.jsonData = {
        data: paramsRow.temp_data.items,
      };
      this.modalVisible = true;
    },
    handleClose () {
      this.modalData.show = false
    },
    handerApp (paramsRow) {
      this.modalData.show = true
      this.modalData.temp_id = paramsRow.id
    },
    handleBatchSave (saveData) {
      optBatchAPPTemp(saveData, 'post').then(res => {
        if (res.code == 0) {
          this.$Message.success(res.msg)
          this.handleClose()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    handleSearch(){
      this.handleGetData()
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
