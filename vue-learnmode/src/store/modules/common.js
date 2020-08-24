import { GetCategory } from "../../api/news";

const state = {
    qiniuUrl: 'www-web-jshtml-cn-idva7mx.web-jshtml.cn/'
}

const getters = {
    qiniuUrl: state => state.qiniuUrl
}

const actions = { // 异步 可以回调事件
    getInfoCategory(content, requestData) {
        return new Promise((resolve, reject) => {
            GetCategory({}).then((Response) =>{
                resolve(Response.data.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions
}
