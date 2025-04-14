<template>
  <div>
    <Row type="flex" justify="start" :gutter="10">
      <i-col v-if="expand" :md="24" :xl="5" style="margin-bottom: 10px">
        <Card dis-hover :bordered="false">
          <template v-if="businessList">
            <Alert show-icon>
              当前选择的是：
              <span class="select-title"> {{ currentTreeName }}</span>
            </Alert>
            <Select v-model="theBusinessID" filterable label-in-value placeholder="请选择" @on-change="handlerChange">
              <Option v-for="item in businessList" :key="item.biz_id" :value="item.biz_id" :label="item.biz_cn_name" />
            </Select>
            <Affix>
              <Input v-model="searchVal" autofocus="autofocus" style="padding-bottom: 10px;padding-top: 10px;" placeholder="搜素..." />
            </Affix>
          </template>
          <div class="tree-bar">
            <Tree ref="tree" style="height: 600px" :data="treeData" :render="renderContent" @on-contextmenu="handleContextMenu" @on-select-change="handlerTreeChange">
              <template slot="contextMenu">
                <DropdownItem @click.native="handleContextMenuAdd">添加子节点</DropdownItem>
                <DropdownItem @click.native="handleContextMenuEdit">编辑节点</DropdownItem>
                <DropdownItem style="color: #ed4014" @click.native="handleContextMenuDelete">删除节点</DropdownItem>
              </template>
            </Tree>
          </div>
        </Card>
      </i-col>
      <i-col :md="24" :xl="19" style="margin-bottom: 10px">
        <!-- 这里给整个TreeAsset组件放进去 -->
        <TreeAsset ref="treeAsset" :tree-node-data="treeNodeData" />
      </i-col>
    </Row>
    <!-- 添加节点 -->
    <TreeAdd :dialog="modalMapTree" :method="methodData" :form="formValidateTree" @e-close="modalMapTree.modalVisible = false" @e-update="getTreeData" />
    <TreeDelete :dialog="deleteDialog" :data="contextData" @e-close="deleteDialog.show = false" @e-update="getTreeData" />
  </div>
</template>
<script>
import { getBusinesslist } from "@/api/cmdb"
import { getServiceTreelist } from "@/api/service-tree"
import TreeAdd from "./tree-add.vue"
import TreeDelete from "./tree-delete.vue"
import TreeAsset from "./tree-asset.vue"

export default {
  name: "ServiceTreeIndex",
  components: {
    TreeAdd,
    TreeDelete,
    TreeAsset,
  },
  data() {
    return {
      selectedNodeId: null,
      treeNodeData: {},
      //  删除dialog
      deleteDialog: {
        show: false,
        name: "",
      },
      searchVal: "",
      expand: true,
      businessList: [],
      currentTreeName: null,
      theBusinessID: null,
      treeData: [],
      treeSetList: [],
      contextData: null,
      methodData: null,
      searchParams: {}, // 搜索
      // 添加子节点
      modalMapTree: {
        modalVisible: false,
        modalTitle: "添加子节点",
      },
      formValidateTree: {
        create_from: "直接创建",
        biz_id: null,
        node_type: null,
        node_sort: 100,
        title: null,
        grand_node: null,
        parent_node: null,
        expand: false,
        ext_info: {},
      },
    }
  },
  watch: {
    searchVal(val) {
      this.handlerSearchTree(val)
    },
  },
  mounted() {
    if (!localStorage.getItem("selectBusinessID")) {
      this.theBusinessID = "502"
    } else {
      this.theBusinessID = localStorage.getItem("selectBusinessID")
    }
    // console.info(this.theBusinessID)
    this.getBizList()
    this.getTreeData()
  },
  methods: {
    // 工具
    contextToConfig(contextData) {
      return {
        ...contextData,
      }
    },
    resetformValidateTree() {
      return {
        title: null,
        biz_id: null,
        parent_node: null,
        node_type: null,
        node_sort: 100,
        detail: null,
        create_from: "直接创建",
        ext_info: {},
      }
    },
    // Tree 删除子节点
    handleContextMenuDelete() {
      if (this.contextData.node_type === 0) {
        this.$Message.error("项目节点不能被删除！")
        return
      }
      this.deleteDialog.show = true
      this.deleteDialog.name = `/${this.contextData.parent_node}/${this.contextData.title}`
    },
    // 编辑节点
    handleContextMenuEdit() {
      this.methodData = "put"
      const nodeType = this.contextData.node_type
      // const { node_type } = this.contextData
      if (nodeType === 0) {
        this.$Message.error("Root节点不支持编辑!")
      } else {
        // 弹出框
        this.modalMapTree.modalVisible = true
        this.modalMapTree.modalTitle = "编辑节点"
        this.formValidateTree = this.contextToConfig(this.contextData)
      }
    },

    handleContextMenuAdd() {
      this.methodData = "post"
      // const { node_type } = this.contextData
      const nodeType = this.contextData.node_type
      // return
      if (nodeType === 3) {
        this.$Message.error("模块下不支持添加子节点了！")
        return
      }

      let modalTitle = "添加子节点" // 默认Title
      let parentNode = this.contextData.title // 当前节点

      // 判断
      this.formValidateTree = this.resetformValidateTree()
      if (nodeType === 0) {
        modalTitle = "添加环境"
        parentNode = this.contextData.title
      } else if (nodeType === 1) {
        modalTitle = "添加集群"
        parentNode = this.contextData.title
      } else if (nodeType === 2) {
        modalTitle = "添加模块"
        this.formValidateTree.grand_node = JSON.parse(JSON.stringify(this.contextData.parent_node))
        parentNode = this.contextData.title
      }
      // Modal
      this.formValidateTree.biz_id = this.theBusinessID // 业务ID
      this.formValidateTree.parent_node = parentNode // TopNode上级节点
      this.formValidateTree.node_type = nodeType + 1 // 类型,因为是在上级节点选择的添加，标记本身node_type的时候需要+1
      this.modalMapTree.modalTitle = modalTitle
      this.modalMapTree.modalVisible = true
    },

    // 获取业务
    async getBizList() {
      const res = await getBusinesslist()
      this.businessList = res.data
    },
    // removeChildren() {
    //   for (let node of  this.treeData) {
    //     if (node.node_type === 3) {
    //       node.expand = false
    //       //  delete node.children;
    //     }
    //     if (node.children) {
    //       removeChildren(node.children);
    //     }
    //   }
    // },
    // 获取Tree
    async getTreeData() {
      const res = await getServiceTreelist({ biz_id: this.theBusinessID })
      this.treeData = res.data
      // this.removeChildren()

      this.treeSetList = this.treeData[0].children // 用來前端搜索
    },
    // 更改业务
    async handlerChange(item) {
      this.bizServerList = [] // 这里后面直接调用子组件方法进行数据置空
      this.theBusinessID = item.value
      localStorage.setItem("selectBusinessID", this.theBusinessID) // 改为前端localStorage存起来
      localStorage.setItem("selectBusinessName", item.label)
      this.getTreeData(this.theBusinessID)
      //
      this.$refs.treeAsset.getTableData()
    },
    // Tree搜索，只做了搜索集群
    handlerSearchTree(val) {
      const newSetList = []
      this.treeSetList.forEach((item) => {
        if (item.title.indexOf(val) !== -1) {
          newSetList.push(item)
        }
      })
      this.treeData[0].children = newSetList
    },
    renderContent(h, { data }) {
      let icon = ""
      const nodeIsSelected = this.treeNodeData.node_type === data.node_type && this.treeNodeData.biz_id === data.biz_id && this.treeNodeData.id === data.id
      if (data.node_type === 0) {
        icon = nodeIsSelected ? "icon_biz1-selected" : "icon_biz1-default"
      } else if (data.node_type === 1) {
        icon = nodeIsSelected ? "icon_env2-selected" : "icon_env2-default"
      } else if (data.node_type === 2) {
        icon = nodeIsSelected ? "icon_set3-selected" : "icon_set3-default"
      } else if (data.node_type === 3) {
        icon = nodeIsSelected ? "icon_module4-selected" : "icon_module4-default"
      } else {
        icon = "logo-tux"
      }
      return h(
        "div",
        {
          style: {
            minWidth: "200px",
            paddingRight: '26px', 
            position: 'relative'
          },
        },
        [
          h("span",
            {
              style: {
                display: "flex",
                // justifyContent: "center",
                alignItems: 'center'
              }
            }, [
            h("SvgIcon", {
              props: {
                size: "18",
                iconClass: icon,
              },
              style: {
                "margin-right": "8px",
                "flex-shrink": 0,
              },
            }),
            h(
              "span",
              {
                style: {
                  "font-size": "16px",
                },
              },
              data.title,
              ),
          ]),
          h("Badge", {
            props: {
              count: data.count,
              type : nodeIsSelected ? "info" : "normal",
              overflowCount: 99999,
            },
            style: {
              // float: "right",
              position: 'absolute',
              right: 0,
              top: '2px'
            },
          }),
        ],
      )
    },
    // Tree 右键弹出
    handleContextMenu(data) {
      this.contextData = data // 赋值
    },
    // 点击节点
    handlerTreeChange(obj) {
      if (obj.length === 0) {
        return
      }
      const data = obj[0]
      this.currentTreeName = data.title
      this.selectedNodeId = data.id
      this.treeNodeData = data //  把整个data传给子组件处理
    },
  },
}
</script>

<style>
.demo-tree-render .ivu-tree-title {
  width: 100%;
}
.tree-bar {
  overflow: auto;
  margin-top: 5px;
  position: relative;
  min-height: 80px;
}
</style>
