import store from "../store/index";

export function buttonPermission(permission){
    let role = store.commit('app/SET_ROLES', role);
    if(role.includes('admin')){
        return true;
    }
    const button = store.getters('app/buttonPermission');
    return button.indexOf(permission) >=0;
}