import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login/index.vue";
import Console from "../views/Console/index.vue";
import Layout from "../views/Layout/index.vue";
import Info from "../views/Info/index.vue";
import Detailed from "../views/Info/detailed.vue";
import InfoCategory from "../views/Info/catagory.vue";
import User from "../views/User/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "Login",
    hidden: true,
    meta:{
      name: '主页'
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: Login,
    meta:{
      name: '登录'
    }
  },
  {
    path: "/console",
    name: "Console",
    redirect: "Index",
    meta: {
      name: "控制台",
      icon: "console"
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "首页"
        },
        component: Console
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta:{
      name: '信息管理',
      icon: "info"
    },
    children:[
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta:{
          name: '信息列表'
        },
        component: Info
      },
      {
        path: "/infoCatagory",
        name: "InfoCatagory",
        meta:{
          name: '信息分类'
        },
        component: InfoCategory
      },
      {

        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        meta:{
          name: '信息详情'
        },
        component: Detailed
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    component: Layout,
    meta:{
      name: '用户管理',
      icon: "user"
    },
    children:[
      {
        path: "/userIndex",
        name: "UserIndex",
        meta:{
          name: '用户列表'
        },
        component: User
      }
    ]
  }
];
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
});

export default router;
