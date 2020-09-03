<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%" @selection-change="thatSelectCheckbox">
      <!--多选-->
      <el-table-column v-if="data.tableConfig.selection" type="selection" width="55"></el-table-column>
      <template v-for="item in data.tableConfig.tHead">
        <!--v-slot-->
        <el-table-column
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
          v-if="item.columnType ==='slot'"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!--文本数据渲染-->
        <el-table-column
          v-else
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
      </template>
    </el-table>
    <div class="table-footer">
      <el-col :span="4">
          <slot name="tableFooterLeft"></slot>
      </el-col>
      <el-col :span="20">
        <el-pagination
          v-if="data.tableConfig.paginationShow"
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.currentPage"
          :page-sizes="pageData.pageSizes"
          :page-size="pageData.pageSize"
          :layout="data.tableConfig.paginationLayout"
          :total="pageData.total"
        ></el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  onMounted,
  isRef,
  toRefs,
  computed,
  watch,
  onBeforeMount
} from "@vue/composition-api";
import { LoadData } from "./tableLoadData";
import { paginationHook } from "./paginationHook";
export default {
  name: "tableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    },    
    tableEow: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    //加载数据
    const { tabledata, tableLoadData } = LoadData({ root });
    //页码
    const {
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount
    } = paginationHook({
      root
    });
    const data = reactive({
      tableConfig: {
        selection: true,
        recordCheckbox: false,
        requestData: {},
        tHead: [],
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      tableData: []
    });

    /**
     * V3.0业务逻辑拆分与组合
     */

    /**
     * 监听
     * 数据渲染
     */
    watch(
      [() => tabledata.item, () => tabledata.total],
      ([tableData, total]) => {
        data.tableData = tableData;
        totalCount(total);
      }
    );
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        let requestData = data.tableConfig.requestData;
        if (requestData.data) {
          //赋值
          requestData = data.tableConfig.requestData;
          //更新值
          requestData.data.pageNumber = currentPage;
          requestData.data.pageSize = pageSize;
        }
      }
    );

    //刷新数据
    const refreshData = () =>{
      tableLoadData(data.tableConfig.requestData);
    }

    //带参数刷新数据
    const paramsLoadData = (params) =>{
      let requestData = Object.assign({}, params,{
        pageNumber: 1,
        pageSize: 10
      })
      data.tableConfig.requestData.data = requestData;
      refreshData();
    }

    /**
     * 方法
     */

    const initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = props.config[key];
        }
      }
    };

    //勾选checkbox时触发的方法

    const thatSelectCheckbox = (val) =>{
      let rowData = {
        idItem: val.map(item => item.id),
        dataItem: val
      }
      emit("update:tableRow", rowData)
    }

    onBeforeMount(() => {
      //data.tableConfig = props.config;
      initTableConfig();
      tableLoadData(data.tableConfig.requestData);
    });

    return {
      data,
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount,
      thatSelectCheckbox,
      refreshData,
      tableLoadData,
      paramsLoadData
    };
  }
};
</script>
<style lang="scss" scoped>
.table-footer {
  padding: 15px 0;
}
</style>