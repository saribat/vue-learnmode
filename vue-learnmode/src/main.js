import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCompositionApi from '@vue/composition-api'; 

//自定义全局组件
import "./icons/index.js";

//引入路由

import "./router/premit";





Vue.config.productionTip = false;
Vue.use(VueCompositionApi);
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
