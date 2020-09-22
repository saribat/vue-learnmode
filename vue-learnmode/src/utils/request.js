import axios from 'axios'
import { Message } from 'element-ui';
import { getToken, getUsername} from "../utils/app";

//创建axios，赋予变量
//手把手地址
const BASEURL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API : process.env.VUE_APP_API;
const service = axios.create({
    baseURL: BASEURL,
    timeout: 10000
});


// 添加请求拦截器
/**
 * 请求接口前，做数据处理
 */
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 在请求头添加参数
    config.headers['Tokey'] = getToken();
    config.headers['UserName'] = getUsername();
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
/**
 * 请求接口，返回数据响应拦截
 */
service.interceptors.response.use(function (response) {
    let data = response.data;

    if(data.resCode !==0){
        Message.error(data.message);
        return Promise.reject(data)
    }
    else{
        // 对响应数据做点什么
        return response;
    }    
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


/**
 * export default 不需要花括号
 */
  export default service;