<template>
  <div>
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for>分类：</label>
          <div class="wrap-content">
            <el-select v-model="categoryValue" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="label-wrap date">
          <label for>日期：</label>
          <div class="wrap-content">
            <el-date-picker
              style="width: 100%"
              v-model="dateValue"
              type="datetimerange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"            
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="label-wrap key-word">
          <label for>关键字：</label>
          <div class="wrap-content">
            <SelectVue :config="data.configOption" />
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-input v-model="search_keywork" placeholder="请输入内容" style="width: 100%"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width: 100%" @click="getList">搜索</el-button>
      </el-col>
      <el-col :span="3">
        <p></p>
      </el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width: 100%"
          @click="dialog_info = true"
        >新增</el-button>
      </el-col>
    </el-row>

    <div class="black-space-30"></div>
    <!--表格 -->
    <el-table
      :data="tableData.item"
      border
      style="width: 100%"
      v-loading="loadingDate"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="750"></el-table-column>
      <el-table-column prop="categoryId" label="类别" width="130" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="237" :formatter="toData"></el-table-column>
      <el-table-column prop="user" label="管理员" width="115"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="editInfo(scope.row.id)" v-if="btnPerm('info.edit')">编辑</el-button>
          <el-button size="mini" type="success" @click="detailed(scope.row)" v-if="btnPerm('info.detailed')">编辑详情</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.row.id)" v-if="btnPerm('info.delete')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="black-space-30"></div>
    <!-- 表格分页-->
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12" class="pull-right">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗-->
    <DialogInfo :flag="dialog_info" @close="closeDialog" :category="options.category" />
    <!-- 编辑弹窗-->
    <DialogEditInfo
      :flag="dialog_info_edit"
      @close="closeDialog"
      :id="infoID"
      :category="options.category"
    />
  </div>
</template>

<script>
import { GetCategory, GetList, DeleteInfo } from "../../api/news";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import SelectVue from "../../components/Select/index";
import {
  reactive,
  ref,
  onMounted,
  isRef,
  toRefs,
  computed,
  watch
} from "@vue/composition-api";
import { global } from "../../utils/global_V3.0";
import { common } from "../../api/common";
import { timestampToTime } from "../../utils/common";
export default {
  name: "infoIndex",
  components: { DialogInfo, DialogEditInfo , SelectVue},
  setup(props, { root }) {
    const { getInfoCategory, categoryItem } = common();
    const { str, confirm } = global();

    const options = reactive({
      category: []
    });
    const data = reactive({
      configOption: {
        init: ["id", "title"]
      }
    });
    const total = ref(0);

    const categoryValue = ref("");
    const dateValue = ref("");
    const search_Key = ref("id");
    const search_keywork = ref("");
    const deleteInfoId = ref("");
    const infoID = ref("");

    //loading
    const loadingDate = ref(false);

    //信息弹窗标记
    const dialog_info = ref(false);
    const dialog_info_edit = ref(false);
    //搜索关键词
    const searchOption = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);

    /**
     * 搜索条件处理
     */
    const formatData = () => {
      let requestData = {
        categoryId: "",
        startTiem: "",
        endTime: "",
        title: "",
        id: "",
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      //分类ID
      if (categoryValue.value) {
        requestData.categoryId = categoryValue.value;
      }
      //日期
      if (dateValue.value.length > 0) {
        requestData.startTiem = dateValue.value[0];
        requestData.endTime = dateValue.value[1];
      }
      console.log(search_Key.value)
      if (search_keywork.value) {
        requestData[search_Key.value] = search_keywork.value;
      }
      // if(search_Key.value =='id'){
      //   requestData.id = search_keywork.value;
      // }
      // else{
      //   requestData.title = search_keywork.value;
      // }
      console.log(requestData)
      return requestData;
    };

    const editInfo = id => {
      infoID.value = id;
      dialog_info_edit.value = true;
    };

    /**
     * 详情页
     */

    const detailed = data => {
      //预先存值
      // root.$store.commit("infoDetailed/SET_ID", data.id);
      // root.$store.commit("infoDetailed/SET_TITLE", data.title);

      root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        id: {
          value: data.id,
          sessionKey: 'infoId',
          session: true
        },
        title: {
          value: data.title,
          sessionKey: 'infoTitle',
          session: true
        }
      });
      //跳转页面
      root.$router.push({
        name: "InfoDetailed",
        params: {
          id: data.id,
          title: data.title
        }
        // path:`/InfoDetailed/${data.id}/${data.title}`
      });
    };

    //通过API获取数据
    const getList = () => {
      let requestData = formatData();
      loadingDate.value = true;
      GetList(requestData)
        .then(Response => {
          let data = Response.data.data.data;
          tableData.item = data;
          total.value = Response.data.data.total;
          loadingDate.value = false;
        })
        .catch(error => {
          console.log(error);
        });
    };

    //表格数据
    const tableData = reactive({
      item: []
    });

    //页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 10
    });

    const handleSizeChange = val => {
      page.pageSize = val;
      console.log(`每页 ${val} 条`);
    };

    const handleCurrentChange = val => {
      page.pageNumber = val;
      console.log(`当前页: ${val}`);
      getList();
    };

    const closeDialog = () => {
      dialog_info.value = false;
      dialog_info_edit.value = false;
      getList();
    };
    /**
     * 删除
     */

    const deleteItem = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "此操作将永久删除当前文件, 是否继续?",
        tip: "警告",
        fn: confirmDelete
      });
    };

    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
        root.$message.error("请先选择！");
        return false;
      }
      confirm({
        content: "此操作将永久删除所选文件, 是否继续?",
        fn: confirmDelete
      });
    };

    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value }).then(Response => {
        console.log(Response);
        root.$message.success(Response.data.message);
        getList();
      });
    };

    const toData = row => {
      return timestampToTime(row.createDate);
    };

    const toCategory = row => {
      let categoryId = row.categoryId;
      let categoryData = options.category.filter(
        item => item.id == row.categoryId
      )[0];
      if (categoryData) {
        return categoryData.category_name;
      }
    };

    const handleSelectionChange = val => {
      let id = val.map(item => item.id);
      deleteInfoId.value = id;
    };

    //获取分类
    const getCategory = () => {
      GetCategory()
        .then(Response => {
          let data = Response.data.data.data;
          options.category = data;
        })
        .catch(error => {});
    };
    /**
     * 生命周期
     */
    onMounted(() => {
      //获取分类
      getList();

      //getCategory()
      //vue3.0
      //getInfoCategory();
      //vuex
      root.$store.dispatch("common/getInfoCategory").then(Response => {
        options.category = Response;
      });
    });

    /**
     * watch
     */
    // watch(
    //   () => categoryItem.item,
    //   value => {
    //     options.category = categoryItem.item;
    //   }
    // );

    return {
      data,
      options,
      categoryValue,
      dateValue,
      searchOption,
      search_Key,
      search_keywork,
      tableData,
      handleSizeChange,
      handleCurrentChange,
      dialog_info,
      closeDialog,
      deleteItem,
      deleteAll,
      getList,
      total,
      loadingDate,
      toData,
      toCategory,
      handleSelectionChange,
      dialog_info_edit,
      editInfo,
      infoID,
      detailed
    };
  }
};
</script>

<style lang="scss" scoped>
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key-word {
    @include labelDom(right, 100, 40);
  }
}
</style>