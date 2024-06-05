import VueRouter from "vue-router"

import baseRouters from "./modules/base"
import componentsRouters from "./modules/components"
import othersRouters from "./modules/others"
import Index from "@/pages/system/tree/index.vue"
import {Layout} from "tdesign-vue"


const env = import.meta.env.MODE || "development"

// 存放动态路由
export const asyncRouterList = [...baseRouters, ...componentsRouters, ...othersRouters]

// 存放固定的路由
const defaultRouterList = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
  },
  {
    path: "*",
    redirect: "/login", // 添加默认重定向到登录页面
  },
  ...asyncRouterList,
]

const createRouter = () =>
  new VueRouter({
    mode: "history",
    base: env === "site" ? "/starter/vue/" : null,
    routes: defaultRouterList,
    scrollBehavior() {
      return { x: 0, y: 0 }
    },
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
