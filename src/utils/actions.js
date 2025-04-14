// 勿删,用于与基座通信,后面会以插件形式提供
function emptyAction () {
  console.warn("Current execute actions is empty!");
}

class Actions {
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  };

  setActions (actions) {
    this.actions = actions
  }

  onGlobalStateChange (...args) {
    return this.actions.onGlobalStateChange(...args)
  }

  setGlobalState (...args) {
    return this.actions.setGlobalState(...args)
  }
}

const actions = new Actions();

export default actions;

// 触发基座未授权逻辑
export const gotoUnAuth = () => {
  actions.setGlobalState({ unauth: true });
};

// 触发基座404逻辑
export const gotoNotFound = () => {
  actions.setGlobalState({ notFound: true });
};
