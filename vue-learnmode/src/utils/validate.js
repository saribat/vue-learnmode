export function stripscript(s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
        return rs;
}
    
export function validateEmail(value){
    let reg =/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return !reg.test(value) ? true : false
}

export function validatePass(value){
    let reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,20}$/;
    return !reg.test(value) ? true : false
}

export function validateC(value){
    let reg=/^[a-z0-9]{4}$/;
    return !reg.test(value) ? true : false
}