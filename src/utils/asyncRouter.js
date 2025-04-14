/* eslint-disable no-param-reassign */
const iImport = require('./_import'); // 获取组件的方法

export const asyncRouterHandle = (asyncRouter) => {
  asyncRouter.map((item) => {
    if (item.component) {
      item.component = iImport(item.component);
    } else {
      delete item.component;
    }
    if (item.children) {
      asyncRouterHandle(item.children);
    }

    return "";
  });
};

export default asyncRouterHandle;
