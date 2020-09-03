import {GetUserRole} from "../../api/login";
import { defaultRouterMap, asnycRouterMap} from "../../router/index";
const state = {
    roles: []
}

const getters = {
    roles: state => state.roles
}

const mutations = { //同步 不需要回调处理事情
    SET_ROLES(state, value){
        state.roles = value;
    }
}

const actions = { // 异步 可以回调事件
    /**
     * 获取用户角色
     * @param {}} param0 
     * @param {*} requestData 
     */
    getRoles({commit}, requestData){
        return new Promise((resolve, reject)=>{
            GetUserRole().then(Response=>{
                let role = Response.data.data;
                commit('SET_ROLES', role);
                resolve(role);
            })
        })
    },
    createRouter({commit}, data){
        return new Promise((resolve, reject)=>{
            let role = data;
        })
    }
}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};