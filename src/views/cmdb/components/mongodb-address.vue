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
  name: "mongoDBAddress",
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
          title: "连接类型",
          key: "URLType",
          width: 100,
          align: "center"
        },
        {
          title: "连接类型",
          key: "Address",
          width: 100,
          align: "right"
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
