<template>
  <Modal v-model="modalData.show" :title="modalData.title" :footer-hide=true>
    <Select v-model="asset_server_id" filterable clearable placeholder="请选择主机">
      <Option v-for="item in serverList" :value="item.id" :key="item.id" :label="item.name"></Option>
    </Select>
    <Button type="success" style="margin-top: 10px;" :loading="btnLoading" @click="handleChangeSave" long>确定更换</Button>
  </Modal>
</template>

<script>
import { getServerList } from "@/api/cloud/server";
export default {
  name: 'serverModal',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      asset_server_id: null,
      btnLoading: false,
      serverList: [],
      initPara:{
        page_number: 1,
        page_size: 300,
      },
    }
  },
  methods: {
    async handleGetData() {
      const res = await getServerList(this.initPara);
      if (res.code == 0) {
        this.serverList = res.data;
      } else {
        this.$Message.error(res.msg)
      }
    },
    handleChangeSave () {
      if (!this.asset_server_id) {
        this.$Message.info('请选择主机')
        return
      }
      this.btnLoading = true
      setTimeout(() => {
        this.$emit('save-data', { id: this.modalData.id, asset_server_id: this.asset_server_id } )
        this.btnLoading = false
      }, 1000)
    },

  },
  watch: {

  },
  created () { },
  mounted () {
    this.handleGetData()
  },
};
</script>