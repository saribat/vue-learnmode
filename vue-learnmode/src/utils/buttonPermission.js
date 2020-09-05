import store from "../store/index";

export function buttonPermission(permission){
    let role = store.getters['app/roles'];
    if(role.includes('admin')){
        return true;
    }
    const button = store.getters['app/buttonPermission'];
    return button.indexOf(permission) >=0;
}