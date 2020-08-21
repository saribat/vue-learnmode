import { MessageBox } from 'element-ui';
import {
    reactive,
    ref,
    onMounted,
    isRef,
    toRefs,
    computed
} from "@vue/composition-api";
export function global() {
    const str = ref('');
    const confirm = ((params) => {
        MessageBox.confirm(params.content, params.tip || "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: params.type || "warning",
            center: true
        })
            .then(() => {
                str.value = params.id || '';
                params.fn && params.fn(params.id || '')
            })
            .catch(error=> {
                console.log(error);
                params.catchFn && params.catchFn()
            });
    })

    return {
        str,
        confirm
    }
}