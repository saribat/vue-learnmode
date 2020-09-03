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
            next();
        }
        else{
            //获取用户角色
            //动态分配路由权限
            /**
             * 1.何时处理动态路由
             * 2.以什么条件处理动态路由
             */
            if(store.getters['permission/roles'].length === 0){
                store.dispatch('permission/getRoles').then(Response =>{
                    let role = Response;
                    store.dispatch('permission/createRouter', role).then(Response =>{

                    })
                })
            }else{
                next();
            }
        }
    }else{
        if(whiteRouter.indexOf(to.path) !== -1){
            next();
        }else{
            next('/login') //路由指向
        }
    }

})