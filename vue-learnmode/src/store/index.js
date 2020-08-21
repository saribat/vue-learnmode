import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app.js";
import common from "./modules/common";

Vue.use(Vuex);



export default new Vuex.Store({
    modules: {
      app,
      common
    }
});
