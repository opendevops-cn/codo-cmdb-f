<template>
  <div>
    <codemirror
      ref="myCm"
      v-model="myValue"
      :options="cmOptions"
      :autofocus="read"
      @input="inputChange"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
// keyMap
import 'codemirror/keymap/sublime.js';
//
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
// import 'codemirror/mode/text/typescript.js'
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/shell/shell.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/lua/lua.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/dockerfile/dockerfile.js';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/paraiso-light.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/base16-dark.css';
export default {
  name: 'codoEditor',
  components: { codemirror },
  props: {
    value: {
      type: String,
      default: '',
      // required: true
    },
    lang: {
      type: String,
      default: 'python',
    },
    read: {
      type: Boolean | String,
      default: true,
    },
    myTheme: {
      type: String,
      default: null,
    },
    eHeight: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      myValue: this.value,
      cmOptions: {
        tabSize: 4,
        mode: `text/javascript`,
        theme: 'base16-light',
        readOnly: true,
        showCursorWhenSelecting: true,
        lineNumbers: true,
        line: true,
        //
        //代码折叠
        keyMap: 'sublime',
        lineWrapping: true,
        foldGutter: true,
      },
    };
  },
  methods: {
    initLang: function () {
      // require('codemirror/mode/python/python.js')
      require('codemirror/mode/php/php.js');
      require('codemirror/mode/perl/perl.js');
      // require('codemirror/mode/shell/shell.js')
      // require('codemirror/mode/go/go.js')
      // require('codemirror/mode/lua/lua.js')
      // require('codemirror/mode/sql/sql.js')
      // require('codemirror/mode/yaml/yaml.js')
      // require('codemirror/mode/dockerfile/dockerfile.js')
    },
    initEditor: function () {
      this.initLang();

      if (this.read) {
        this.cmOptions.theme = 'base16-light';
        this.cmOptions.readOnly = true;
      } else {
        this.cmOptions.readOnly = false;
        this.cmOptions.theme = 'monokai';
      }

      if (this.lang == 'javascript' || this.lang == 'json') {
        this.cmOptions.mode = {
          name: 'javascript',
          json: true,
        };
      } else {
        this.cmOptions.mode = `text/x-${this.lang}`;
      }

      if (this.myTheme) {
        this.handleChangeTheme(this.myTheme);
      }

      this.$refs.myCm.codemirror.setOption('options', this.cmOptions);
    },
    handleChangeTheme(newValue) {
      try {
        this.cmOptions.theme = newValue;
        this.$refs.myCm.codemirror.setOption('options', this.cmOptions);
      } catch (e) {
        this.$message.error('切换编辑器主题出错：' + e.toString());
      }
    },
    inputChange(content) {
      this.$nextTick(() => {
        // console.log("content:" + content)
        this.myValue = content;
      });
    },
  },
  watch: {
    value(newVal) {
      this.myValue = newVal;
    },
    myValue(newVal) {
      this.$emit('input', newVal);
    },
    lang: function (newValue, oldValue) {
      if (newValue == 'javascript') {
        this.cmOptions.mode = `text/javascript`;
      } else if (newValue == 'typescript') {
        this.cmOptions.mode = `text/typescript`;
      } else if (newValue == 'mysql') {
        this.cmOptions.mode = `text/x-${newValue}`;
        this.cmOptions.theme = 'solarized';
      } else {
        this.cmOptions.mode = `text/x-${newValue}`;
      }
      this.$refs.myCm.codemirror.setOption('options', this.cmOptions);
    },

    read: function (newValue, oldValue) {
      if (newValue) {
        this.cmOptions.theme = 'base16-light';
        this.cmOptions.readOnly = true;
      } else {
        this.cmOptions.readOnly = false;
        this.cmOptions.theme = 'monokai';
      }
      this.$refs.myCm.codemirror.setOption('options', this.cmOptions);
    },

    myTheme: function (newValue, oldValue) {
      this.handleChangeTheme();
    },
    eHeight: function (newValue, oldValue) {},
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    },
  },
  mounted() {
    setTimeout(() => {
      this.initEditor();
    }, 200);
  },
};
</script>

<style lang="less">
.CodeMirror {
  margin: 0;
  line-height: 130%;
  border: 1px solid #eee;
  width: auto;
  height: auto;
  min-height: 300px;
  max-height: 800px;
  font-size: 12px;
  background-color: rgb(248, 248, 248);
  h1 {
    margin: 0;
  }
  .CodeMirror-scroll {
    height: auto;
    min-height: 300px;
    max-height: 800px;
    overflow-y: hidden;
    overflow-x: auto;
  }
}
</style>
