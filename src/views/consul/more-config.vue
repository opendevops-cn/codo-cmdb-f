<template>
   <div>
       <Row :gutter="0">
        <Col span="6">
            <Card style="margin: 0 3px 3px; text-align: center">
                <p slot="title">Prometheus配置</p>
                <p>Content of card</p>
                <p>Content of card</p>
                <p>Content of card</p>
                <span class="icon iconfont icon-shouye-qita"></span>
                <div class="icon iconfont icon-liuchengkongzhizhongxin_jiedianguanli"></div>
            </Card>
        </Col>
        <Col span="6">
                <Card style="margin: 0 3px 3px; text-align: center">
                <p slot="title">MySQL Exporter配置</p>
                <p>Content of card</p>
                <p>Content of card</p>
                <p>Content of card</p>
            </Card>
        </Col>
        <Col span="6">
            <Card style="margin: 0 3px 3px; text-align: center">
                <p slot="title">Redis Exporter配置</p>
                <p>Content of card</p>
                <p>Content of card</p>
                <Icon type="logo-tux" /> instances 
                <Divider type="vertical" />
                <Icon type="ios-thumbs-up" style="margin-left: 5px;" /> 
                <Divider type="vertical" />
                <Icon type="ios-thumbs-down" style="margin-left: 5px;" /> 
            </Card>
        </Col>
        <Col span="6">
            <Card style="margin: 0 3px 3px; text-align: center">
                <p slot="title">开发中</p> 
                <p>Content of card</p>
                <p>Content of card</p>
                <p>Content of card</p>
            </Card>
        </Col>
      </Row>
      <Button v-clipboard:copy="configs" v-clipboard:success="onCopy" type="info" >复制配置</Button>
      <pre v-highlightjs="configs" style="line-height:110%"><code class="yaml yamlcode">
      </code></pre>

  </div>
</template>

<script>
import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'
// import 'highlight.js/styles/default.css' 
// import 'highlight.js/styles/xt256.css'
// import 'highlight.js/styles/monokai-sublime.css'
import 'highlight.js/styles/vs2015.css'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(VueHighlightJS)
export default {
  components: {
  },
  data() {
    return {
        configs: '该功能用于生成Prometheus的配置\n\n该功能用于生成Prometheus的配置\n\n该功能用于生成Prometheus的配置\n\n该功能用于生成Prometheus的配置\n\n'
      //
    };
  },
  methods: {
    onCopy() {
      this.$Message.success("复制成功")
    },
  },
  watch: {

  },
  mounted() {
  },
};
</script>
<style lang="less" scoped>
</style>
<style>
  .yamlcode {
    font-family:'Consolas';
  }
  pre {
    max-height: 640px;
    white-space: pre-wrap;
    overflow:auto;
  }
</style>