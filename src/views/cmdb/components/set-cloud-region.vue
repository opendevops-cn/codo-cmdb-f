<template>
  <Modal v-model="modalData.show" :title="modalData.title" :footer-hide=true>
    <Select v-model="cloud_region_id" filterable clearable placeholder="请选择云区域">
      <Option v-for="item in cloudRegionList" :value="item.cloud_region_id" :key="item.id" :label="item.name"></Option>
    </Select>
    <Button type="success" style="margin-top: 10px;" :loading="btnLoading" @click="handleChangeSave" long>确定更换</Button>
  </Modal>
</template>

<script>
import { getCloudRegion } from "@/api/cloud-region.js";
export default {
  name: 'regionModal',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      cloud_region_id: null,
      btnLoading: false,
      cloudRegionList: [],
      initPara:{
        page_number: 1,
        page_size: 300,
      },
    }
  },
  methods: {
    async handleGetData() {
      const res = await getCloudRegion(this.initPara);
      if (res.code == 0) {
        this.cloudRegionList = res.data;
      } else {
        this.$Message.error(res.msg)
      }
    },
    handleChangeSave () {
      if (!this.cloud_region_id) {
        this.$Message.info('请选择一个云区域吧')
        return
      }
      this.btnLoading = true
      setTimeout(() => {
        this.$emit('save-data', { id: this.modalData.id, cloud_region_id: this.cloud_region_id } )
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