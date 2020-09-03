import service from '../utils/request';
/**
 * 用户角色
 */
export function GetRole(data={}) {
    return service.request({
        method: 'post',
        url: '/role/',
        data: data
    })
}

/**
 * 系统列表
 */
export function GetSystem(data={}) {
    return service.request({
        method: 'post',
        url: '/system/',
        data: data
    })
}

/**
 * 新增用户
 */
export function UserAdd(data) {
    return service.request({
        method: 'post',
        url: '/user/add/',
        data: data
    })
}

/**
 * 删除用户
 */
export function UserDel(data) {
    return service.request({
        method: 'post',
        url: '/user/delete/',
        data: data
    })
}

/**
 * 用户禁启用
 */
export function UserActives(data) {
    return service.request({
        method: 'post',
        url: '/user/actives/',
        data: data
    })
}
/**
 * 用户编辑
 */
export function UserEdit(data) {
    return service.request({
        method: 'post',
        url: '/user/edit/',
        data: data
    })
}