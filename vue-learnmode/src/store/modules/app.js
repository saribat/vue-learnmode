import { Login } from "../../api/login";
import { setToken, removeToken, removeUsername, setUsername, getUsername } from "../../utils/app";
const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_Ken: '',
    username: getUsername() || ""
}

const getters = {
    isCollapse: state => state.isCollapse,
    roles: state => state.roles
}

const mutations = { //同步 不需要回调处理事情
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse
        //html5存储
        //sessionStorage.setItem("isCollapse",JSON.stringify(state.isCollapse));
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state, value) {
        state.to_Ken = value
    },
    SET_USERNAME(state, value) {
        state.username = value
    },
    REMOVE_TOKEN(state) {
        state.to_Ken = ''
    }
}

const actions = { // 异步 可以回调事件
    login(content, requestData) {
        return new Promise((resolve, reject) => {
            Login(requestData).then((response) => {
                let data = response.data.data;
                content.commit('SET_TOKEN', data.token);
                content.commit('SET_USERNAME', data.username);
                setToken(data.token);
                setUsername(data.username);
                resolve(response);
            }).catch(error => {
                reject(error)
            })

        })
    },
    exit(content, requestData) {
        return new Promise((resolve, reject) => {
            removeToken();
            removeUsername();
            content.commit('SET_TOKEN', '');
            content.commit('SET_USERNAME', '');
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