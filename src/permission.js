import router from './plugins/router';
import store from '@/store/index';

let asyncRouterFlag = 0;

router.beforeEach(async (to, from, next) => {
  if (!asyncRouterFlag) {
    asyncRouterFlag += 1;
    await store.dispatch('router/SetAsyncRouter');
    const asyncRouters = store.getters['router/asyncRouters'];

    console.log("router/SetAsyncRouter", asyncRouters, router);
    
    asyncRouters.forEach(r => {
      console.log("asyncRouters:", r)
      router.addRoute(r)
    });
    next({ ...to, replace: true });
  } else {
    next();
  }
});
