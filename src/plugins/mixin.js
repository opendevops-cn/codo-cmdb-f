// 全局混入
import Vue from "vue";

const myMixin = {
  methods: {
    gotoBack() {
      this.$router.back();
    },
    goto(data) {
      this.$router.push(data);
    },
  },
};

Vue.mixin(myMixin);