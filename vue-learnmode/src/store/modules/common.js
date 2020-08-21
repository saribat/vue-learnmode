import { GetCategory } from "../../api/news";

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
    actions
}
