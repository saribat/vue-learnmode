const state = {
    id: JSON.parse(sessionStorage.getItem('infoId')) ||  "",
    title: JSON.parse(sessionStorage.getItem('infoTitle')) ||  ""
}

const getters = {
    infoId: state => state.id,
    infoTitle: state => state.title
}

const mutations = { //同步 不需要回调处理事情

    UPDATE_STATE_VALUE(state, params){
        for(let key in params){
            state[key] = params[key].value;
            //是否存储session
            if(params[key].session){
                sessionStorage.setItem(params[key].sessionKey, JSON.stringify(params[key].value));
            }
        }
    },

    SET_ID(state, value){
        state.id = value;
        sessionStorage.setItem('infoId', JSON.stringify(value));
    },
    SET_TITLE(state, value){
        state.title = value;
        sessionStorage.setItem('infoTitle', JSON.stringify(value));
    }
}
const actions = { // 异步 可以回调事件
    
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
