import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app.js";
import common from "./modules/common";
import infoDetailed from "./modules/infoDetailed";

Vue.use(Vuex);



export default new Vuex.Store({
    modules: {
      app,
      common,
      infoDetailed
    }
});
