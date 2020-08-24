import service from '../utils/request';
import { GetCategory, GetCategoryAll } from "../api/news";
import { reactive } from "@vue/composition-api";
export function common() {
    const categoryItem = reactive({
        item: []
    })
    //获取分类
    const getInfoCategory = (() => {
        GetCategory({}).then(Response => {
            categoryItem.item = Response.data.data.data
        }).catch(error => {

        })
    })
    //获取全部分类
    const getInfoCategoryAll = (() => {
        GetCategoryAll({}).then(Response => {
            categoryItem.item = Response.data.data
        }).catch(error => {

        })
    })

    return {
        getInfoCategory,
        getInfoCategoryAll,
        categoryItem
    }
}


/**
 * 获取七牛云token
 */
export function QiniuToken(data){
    return service.request({
        method: 'post',
        url: '/uploadImgToken/',
        data: data
    })
}