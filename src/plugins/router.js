import Vue from 'vue'
import VueRouter from 'vue-router'
// import { gotoNotFound } from '@/utils/actions';

Vue.use(VueRouter)

// 通用路由页
export const baseRouter = [
    {
        path: '/',
        name: 'layout',
        redirect: { name: 'index' },
        component: 'components/layout/withNavbar',
        meta: { title: process.env.VUE_APP_TITLE },
        children: [],
    },
    {
        path: '*',
        name: 'any',
        redirect: { name: 404 }, // 该页面将交由基座页统一接管
    },
]

const constantRoutes = [
    {
        path: '/404',
        name: '404',
        hidden: true,
        // @ts-ignore
        component: () => import('../views/404.vue'),
        beforeEnter: (to, from, next) => {
            // 拦截后交由基座统一处理
            next()
            // gotoNotFound();
        },
    },
]

const createRouter = () => new VueRouter({
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    base: window.__POWERED_BY_QIANKUN__ ? `/${process.env.VUE_APP_CODE}` : `/web/${process.env.VUE_APP_CODE}/`,
    mode: 'history',
    // @ts-ignore
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    // @ts-ignore
    router.matcher = newRouter.matcher
}

export default router
