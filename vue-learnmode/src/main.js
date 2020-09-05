import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCompositionApi from '@vue/composition-api';

//自定义全局组件
import "./icons/index.js";
//自定义全局方法
//import global from "./utils/global";
//自定义指令按钮权限
import "./utils/buttonPerm";
//引入按钮权限
import { buttonPermission } from "./utils/buttonPermission";

//引入路由
import "./router/premit";






Vue.prototype.btnPerm = buttonPermission;
Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(ElementUI);
//Vue.use(global);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
