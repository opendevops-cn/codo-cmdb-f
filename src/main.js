import "./pubilc-path"
import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import "./plugins"
import router from "./plugins/router"
import "./assets/scss/index.scss"
import "@/permission"
import qiankun from "@/utils/actions"
import "@/icons"

Vue.config.productionTip = false
let instance = null

Vue.prototype.$layout = {
  noShowNavbar: false,
  noShowLeftMenu: false,
}

function render(props = {}) {
  // console.info('props',props,props.mockLogout)
  if (props) {
    qiankun.setActions(props)
  }

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app")
}

function storeTest(props) {
  props.onGlobalStateChange
  && props.onGlobalStateChange(
    (value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
    true,
  )
  props.setGlobalState
  && props.setGlobalState({
    ignore: props.name,
    user: {
      name: props.name,
    },
  })
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log("[vue] vue app bootstraped")
}

export async function mount(props) {
  console.info("props---------", props)
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log("state: 变更后的状态; prev 变更前的状态", state, prev)
  })
  console.log("[vue] props from main framework", props)
  storeTest(props)
  render(props)
}

export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ""
  instance = null
}
