<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
import { reactive, ref, onMounted, isRef, toRefs, computed } from "@vue/composition-api";
export default {
    name: "svgIcon",
    // props: ['iconClass', 'iconName'],
    props: {
        iconClass: {
            type: String,
            default: ''
        },
        className: {
            type: String,
            default: ''
        }
    },
    setup(props){
        //计算属性得出最终结果
        const iconName = computed(() => `#icon-${props.iconClass}`)

        const svgClass = computed(() => {
            if(props.className){
                return `svg-icon ${props.className}`
            }else{
                return `svg-icon`
            }
        })
        return{
            iconName,
            svgClass
        }
    }
}
</script>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
</style>