import { asyncRouterHandle } from '@/utils/asyncRouter';
import userMenu from '@/api/menu';
import mainRouter from '@/router';
import { baseRouter } from '../../plugins/router';

const routerList = [];

export const formatRouter = (routes) => {
  console.log(routes);
  // eslint-disable-next-line no-unused-expressions
  routes && routes.map((item) => {
    if ((!item.children || item.children.every(ch => ch.hidden)) && item.name !== '404') {
      routerList.push({ label: item.meta.title, value: item.name });
    }
    // eslint-disable-next-line no-param-reassign
    item.meta.hidden = item.hidden;
    if (item.children && item.children.length > 0) {
      formatRouter(item.children);
    }

    return true;
  });
};

const filterRouter = (menus) => {
  console.log(menus);
  const usermenu = {};
  menus.forEach((item) => {
    usermenu[item.name] = 1;
  });

  return mainRouter.filter(item => usermenu[item.name]);
};


export const router = {
  namespaced: true,
  state: {
    asyncRouters: [],
    routerList,
  },
  mutations: {
    setRouterList(state, routerSlice) {
      state.routerList = routerSlice;
    },
    // 设置动态路由
    setAsyncRouter(state, asyncRouters) {
      state.asyncRouters = asyncRouters;
    },
  },
  actions: {
    async SetAsyncRouter({ commit }) {
      if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
        baseRouter[0].children.push(...mainRouter);
      } else {
        const asyncRouterRes = await userMenu();
        if (asyncRouterRes.data.user_role === "root") {
          baseRouter[0].children.push(...mainRouter);
        } else {
          const asyncRouter = asyncRouterRes.data.menus;
          baseRouter[0].children.push(...filterRouter(asyncRouter));
        }
      }

      // baseRouter = asyncRouter;
      asyncRouterHandle(baseRouter);
      commit('setAsyncRouter', baseRouter);
      commit('setRouterList', routerList);
      return true;
    },
  },
  getters: {
    // 获取动态路由
    asyncRouters(state) {
      return state.asyncRouters;
    },
    routerList(state) {
      return state.routerList;
    },
  },
};

export default router;
