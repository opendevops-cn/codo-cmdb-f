<template>
  <div>
    <Modal :title="dialog.title" v-model="dialog.show" width="920" :mask-closable="false" :footer-hide=true>
      <Alert type="success" show-icon>集群地址</Alert>
      <div style="margin-top: 5px">
        <Table stripe border :columns="columns" :data="addressItems"></Table>
      </div>
      <p></p>
      <Alert show-icon>节点地址</Alert>
      <div>
        <Table stripe border :columns="instanceColumns" :data="instancesItems"></Table>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "auroraAddress",
  props: {
    dialog: Object,
    addressItems: {
      type: Array,
      default: function () {
        return [];
      },
    },
    instancesItems: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      columns: [
        {
          title: "集群类型",
          key: "type",
          align: "center",
          width: 120,
          sortable: true,
          render: (h, params) => {
            let endpointType = params.row.endpoint_type;
            if (endpointType === "read") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "blue" },
                  },
                  "读集群"
                ),
              ]);
            } else if (endpointType === "wirte") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "geekblue" },
                  },
                  "写集群"
                ),
              ]);
            }
          },
        },
        {
          title: "网络",
          key: "type",
          align: "center",
          width: 120,
          sortable: true,
          render: (h, params) => {
            let networkType = params.row.type;
            if (networkType === "auto_dns") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "default" },
                  },
                  "智能DNS"
                ),
              ]);
            }
          },
        },

        {
          title: "端口",
          key: "port",
          width: 100,
          align: "center",
          sortable: true,
        },
        {
          title: "域名地址",
          key: "domain",
          align: "left",
          sortable: true,
        },
      ],
      instanceColumns: [
        {
          title: "名称",
          key: "name",
          tooltip: true,
        },
        {
          title: "地址",
          key: "instance_addr",
          align: "left",
          tooltip: true,
        },
        {
          title: "用户",
          key: "instance_user",
          width: 100,
        },
        {
          title: "端口",
          key: "instance_port",
          width: 90,
        },
        {
          title: "类型",
          key: "instance_class",
          width: 120,
        },
        {
          title: "状态",
          key: "instance_status",
          width: 100,
        },
      ],
    };
  },
  methods: {
    //前端搜索
    // handerSearch() {
    //   console.log(11);
    // },
  },

  computed: {
    // totalCount() {
    //   return this.addressItems.length;
    // },
  },
};
</script>
