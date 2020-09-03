<template>
  <el-select v-model="selectValue">
    <el-option
      v-for="item in initOptionData"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>
<script>
import {
  reactive,
  ref,
  onMounted,
  isRef,
  toRefs,
  computed,
  watch
} from "@vue/composition-api";
export default {
  name: "",
  data() {
    return {
      selectValue: "",
      initOptionData: [],
      option: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    };
  },
  methods: {
    initOption() {
      let initData = this.config.init;
      let optionArr = [];
      //数据校验
      if (initData.length === 0) {
        return false;
      }
      initData.forEach(element => {
        let arr = this.option.filter(elem => elem.value == element);
        if (arr.length > 0) {
          optionArr.push(arr[0]);
        }
      });

      if (optionArr.length === 0) {
        return false;
      }

      //初始化赋值

      console.log(optionArr);
      this.initOptionData = optionArr;
      //初始化搜索类型
      this.selectValue = optionArr[0].value;
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    config: {
      handler(newValue, oldValue) {
        console.log(newValue);
        this.initOption();
      },
      immediate: true //组件初始化时，马上进行监听
    }
  }
};
</script>
<style lang="scss" scoped>
</style>