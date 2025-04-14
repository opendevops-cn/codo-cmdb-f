<template>
 <Drawer v-model="modalData.show" @on-close='handleCancel'  :title="modalData.title" :styles="styles"
      width="700px" draggable :mask-closable='false' >
      <div style="padding-bottom: 5px; padding-left: 20px;">
        <b >{{ modalData.name }}   ----  共 {{ listCount }} 条</b>
      </div>
      <template v-for=" item, index in listData" >
        <p style="padding-left: 20px;"> {{ item.cloud_name }}  --  {{ item.name }}  --  {{ item.instance_id }} </p>
      </template>
      <div class="drawer-footer">
          <Button style="margin-right: 8px" @click="handleCancel">取消</Button>
          <Button style="margin-right: 8px"  type="warning" @click="handleSubmit()">刷新到指定业务</Button>
          <Button type="error" @click="handleClean">清除当前资源的所有关联</Button>
      </div>
    </Drawer>
</template>
<script>
import {getDynamicRuleAsset} from "@/api/dynamic_rule";
export default {
  components: {},
  name: 'preViewAsset',
  props: {
    modalData: {
      type: Object,
      default: {}
    },
  },
  data () {
    return {
      listData: [],
      listCount: 0,
      styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
      },
    }
  },
  filters: {
  },
  methods: {
    handleCancel () {
      this.$emit('preview-close')
    },
    async handleGetData(id) {
      const res = await getDynamicRuleAsset(id);
      if (res.code == 0) {
        this.listData = res.data;
        this.listCount = res.count
      } else {
        this.$Message.error(res.msg)
      }
    },
    handleSubmit(val){
      this.$emit('refresh', {id:this.modalData.id ,'force':val})
    },
    handleClean(){
      this.$emit('clean', {id:this.modalData.id})
    }
  },
  watch: {
  },
  computed: {
  },
  //
  mounted () {
    // this.handleGetData()
  }
}
</script>
<style>
    .drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>