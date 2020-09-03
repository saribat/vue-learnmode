import { GetCityPicker } from "../api/common";
import { reactive, toRefs } from "@vue/composition-api";
export function cityPicker() {
    const data = reactive({
        provinceData: [],
        provinceValue: "",
        cityData: [],
        cityValue: "",
        areaData: [],
        areaValue: "",
        streetData: [],
        streetValue: ""
    });

    const resultData = reactive({
        provinceValue: "",
        cityValue: "",
        areaValue: "",
        streetValue: ""
    });

    const getProvince = () => {
        GetCityPicker({ type: "province" })
            .then(Response => {
                data.provinceData = Response.data.data.data;
            })
            .catch(error => { });
    };

    /**
   * 选择省份，获取城市
   */
    const handlerProvince = val => {
        getData({ type: "city", province_code: val });
        // resetValue({ type: "city" });
        // GetCityPicker({ type: "city", province_code: val })
        //     .then(Response => {
        //         data.cityData = Response.data.data.data;
        //     })
        //     .catch(error => { });
    };
    /**
   * 选择城市，获取区县
   */
    const handlerCity = val => {
        getData({ type: "area", city_code: val });
        // resetValue({ type: "area" });
        // GetCityPicker({ type: "area", city_code: val })
        //     .then(Response => {
        //         data.areaData = Response.data.data.data;
        //     })
        //     .catch(error => { });
    };
    /**
     * 选择区县，获取街道
     */
    const handlerArea = val => {
        getData({ type: "street", area_code: val });
        // resetValue({ type: "street" });
        // GetCityPicker({ type: "street", area_code: val })
        //     .then(Response => {
        //         data.streetData = Response.data.data.data;
        //     })
        //     .catch(error => { });
    };

    const handlerStreet = val => {
        result();
    }

    /**
     * 重置选项
     */
    const resetValue = (params) => {
        const valueJson = {
            city: ['cityValue', 'areaValue', 'streetValue'],
            area: ['areaValue', 'streetValue'],
            street: ['streetValue'],
        }
        if (valueJson[params.type]) {
            valueJson[params.type].forEach(item => {
                data[item] = "";
            })
        }
        result();
    }

    /**
     * 返回数据集合
     */
    const result = () => {
        for (let key in resultData) {
            resultData[key] = data[key];
        }
    }

    /**
     * 获取数据
     */
    const getData = (params) =>{
        resetValue(params);
        GetCityPicker(params)
            .then(Response => {
                console.log(`${params.type}Data`)
                data[`${params.type}Data`] = Response.data.data.data;
            })
            .catch(error => { });
    }


    return {
        data,
        resultData,
        //...toRefs(data),//把对象类型结构为基础数据类型
        getProvince,
        handlerProvince,
        handlerCity,
        handlerStreet,
        handlerArea,
        resetValue
    }
}