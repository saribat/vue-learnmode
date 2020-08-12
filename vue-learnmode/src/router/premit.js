import router from "./index";
import store from "../store/index";
import {getToken, removeToken, removeUsername} from "../utils/app";

const whiteRouter = ['/login']; // indexof方法，判读数组是否存在指定的某个对象

//路由守卫
router.beforeEach((to, from, next)=>{ // to 下一个页面 from 上一个页面
    if(getToken()){
        if(to.path === '/Login'){
            removeToken();
            removeUsername();
            store.commit("app/SET_TOKEN", '');
            store.commit("app/SET_USERNAME", '');
        }
        else{
            //获取用户角色
            //动态分配路由权限
        }
        
        next();
    }else{
        if(whiteRouter.indexOf(to.path) !== -1){
            next();
        }else{
            next('/login') //路由指向
        }
    }

})