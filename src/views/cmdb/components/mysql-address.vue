<template>
  <div>
    <Modal :title="dialog.title" v-model="dialog.show" width="70%" :mask-closable="false" :footer-hide=true>
      <alert>一共查询到:{{totalCount}}条链接地址.</alert>
      <div style="margin-top: 5px">
        <Table  :columns="columns" :data="addressItems"></Table>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "mysqlAddress",
  props: {
    dialog: Object,
    addressItems: {
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
          title: "Endpoint",
          key: "endpoint_type",
          align: "center",
          width: 120,
          render: (h, params) => {
            let endPointType = params.row.endpoint_type;
            if (endPointType === "Cluster") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "geekblue" },
                  },
                  "集群地址"
                ),
              ]);
            } else if (endPointType === "Primary") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "blue" },
                  },
                  "主地址"
                ),
              ]);
            } else if (endPointType === "Custom") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "cyan" },
                  },
                  "自定义地址"
                ),
              ]);
            }
          },
        },
        {
          title: "NetWork",
          key: "type",
          align: "center",
          width: 120,
          render: (h, params) => {
            let networkType = params.row.type;
            if (networkType === "private") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "default" },
                  },
                  "内网"
                ),
              ]);
            } else if (networkType === "public") {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: { color: "red" },
                  },
                  "公网"
                ),
              ]);
            }
          },
        },
        {
          title: "Port",
          key: "port",
          width: 100,
          align: "center"
        },
        {
          title: "IP Address",
          key: "ip",
          width: 150,
          align: "center",
          sortable: true,
        },
        {
          title: "Domain Address",
          key: "domain",
          align: "left"
        },
      ],
    };
  },
  methods: {
    //前端搜索
    handerSearch() {
      console.log(11);
    },
  },

  computed: {
    totalCount() {
      return this.addressItems.length;
    },
  },
};
</script>
