<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select v-model="data.provinceValue" @change="handlerProvince">
          <el-option
            v-for="item in data.provinceData"
            :key="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
            :value="item.PROVINCE_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.city">
        <el-select v-model="data.cityValue" @change="handlerCity">
          <el-option
            v-for="item in data.cityData"
            :key="item.CITY_CODE"
            :label="item.CITY_NAME"
            :value="item.CITY_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.area">
        <el-select v-model="data.areaValue" @change="handlerArea">
          <el-option
            v-for="item in data.areaData"
            :key="item.AREA_CODE"
            :label="item.AREA_NAME"
            :value="item.AREA_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.street">
        <el-select v-model="data.streetValue" @change="handlerStreet">
          <el-option
            v-for="item in data.streetData"
            :key="item.STREET_CODE"
            :label="item.STREET_NAME"
            :value="item.STREET_CODE"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { watch, onBeforeMount, reactive } from "@vue/composition-api";
import { cityPicker } from "../../mixins/cityPicker";
export default {
  name: "cityPicker",
  props: {
    cityPickerLevel: {
      type: Array,
      default: () => []
    },
    cityPickerData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false
    });
    const {
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      data,
      resultData,
      handlerStreet
      // provinceData,
      // provinceValue,
      // cityData,
      // cityValue,
      // areaData,
      // areaValue,
      // streetData,
      // streetValue
    } = cityPicker();

    /**
     * 初始化
     */

    const initCityPicker = () => {
      let initData = props.cityPickerLevel;
      if (initData.length === 0) {
        for(let key in init){
          init[key] = true;
        }
      } else {
        initData.forEach(item => {
          init[item] = true;
        });
      }
    };
    //获取省份
    onBeforeMount(() => {
      initCityPicker();
      getProvince();
    });

    watch(
      [
        () => resultData.provinceValue,
        () => resultData.cityValue,
        () => resultData.areaValue,
        () => resultData.streetValue
      ],
      ([province, city, area, street]) => {
        emit("update:cityPickerData", resultData);
      }
    );

    return {
      init,
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      data,
      resultData,
      handlerStreet
      // provinceValue,
      // provinceData,
      // cityData,
      // cityValue,
      // areaData,
      // areaValue,
      // streetData,
      // streetValue
    };
  }
};
</script>
<style lang="scss" scoped>
</style>