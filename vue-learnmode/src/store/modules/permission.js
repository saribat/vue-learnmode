import {GetUserRole} from "../../api/login";
import { defaultRouterMap, asnycRouterMap} from "../../router/index";
const state = {
    roles: [],
    allRouters: defaultRouterMap,
    addRouters: []
}

const getters = {
    roles: state => state.roles,
    allRouters: state => state.allRouters,
    addRouters: state => state.addRouters
}

const mutations = { //同步 不需要回调处理事情
    SET_ROLES(state, value){
        state.roles = value;
    },
    SET_ROUTER(state, router){
        state.addRouters = router;
        state.allRouters = defaultRouterMap.concat(router);
        console.log(state.allRouters)
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
            let addRouters = [];
            //超管
            if(role.includes('admin')){
                addRouters = asnycRouterMap;
            }else{//普通管理
                addRouters = asnycRouterMap.filter(item => {
                    //es6 数组匹配
                    if(role.includes(item.meta.system)){
                        return item;
                    }
                })
            }
            
            //更新路由
            commit('SET_ROUTER', addRouters)
            resolve();
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