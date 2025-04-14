<template>
  <div>
    <Modal v-model="modalMap.show" :title="dialog.title" :footer-hide="true" width="650" :mask-closable="false">
      <vue-json-pretty :data="FormData" />
    </Modal>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

export default {

  name: 'AssetMore',
  components: {
    VueJsonPretty,
  },
  props: {
    dialog: {
      default() {
        return {}
      },
      type: Object,
    },
    data: {
      default() {
        return {}
      },
      type: Object,
    },
  },
  data() {
    return {}
  },
  computed: {
    modalMap() {
      return this.dialog
    },
    FormData() {
      return this.data
    },
  },
}
</script>
