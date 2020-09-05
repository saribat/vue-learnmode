import Vue from "vue";
import store from "../store/index";
Vue.directive("btnPerm", {
    //父节点未渲染
    bind: function (el, bingind, vnode) {
        if (bingind.def.hasBtnPerm(bingind.value)) {
            el.style.display = "block"
        }
    },
    //操作父节点的时候
    inserted: function () {
    },
    update: function () {
    },
    componentUpdated: function () {
    },
    unbind: function () {
    },
    hasBtnPerm: function (permission) {
        let role = store.getters['app/roles'];
        if (role.includes('admin')) {
            return true;
        }
        const button = store.getters['app/buttonPermission'];
        return button.indexOf(permission) >= 0;
    }
})