<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label>关键字：</label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOption" :selectData.sync="data.selectData"/>
              </el-col>
              <el-col :span="5">
                <el-input v-model="data.key_word" placeholder="请输入待搜索内容"></el-input>
              </el-col>
              <el-col :span="15">
                <el-button type="danger" @click="search">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" @click="handerAdd">新增用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <TableVue ref="userTable" :config="data.configTable" :tableRow.sync="data.tableRow">
      <template v-slot:status="slotdata">
        <el-switch
          @change="handerSwitch(slotdata.data)"
          v-model="slotdata.data.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="2"
          inactive-value="1"
        ></el-switch>
      </template>
      <template v-slot:operation="slotdata">
        <el-button size="small" type="danger" @click="handerDel(slotdata.data)">删除</el-button>
        <el-button size="small" type="success" @click="handerEdit(slotdata.data)">编辑</el-button>
      </template>
      <template v-slot:tableFooterLeft>
        <el-button size="small" @click="handerBatchDel()">批量删除</el-button>
      </template>
    </TableVue>
    <DialogAdd :flag="data.dialog_add" :editData="data.editData" @close="closeDialog" @refreshTableData="refreshData" />
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
  watch
} from "@vue/composition-api";
import SelectVue from "../../components/Select/index";
import TableVue from "../../components/Table/index";
import DialogAdd from "./dialog/add";
import { global } from "../../utils/global_V3.0";
import { UserDel, UserActives } from "../../api/user.js";
//中央事件
import Bus from "../../utils/bus";
export default {
  name: "userIndex",
  components: {
    SelectVue,
    TableVue,
    DialogAdd
  },
  setup(props, { root, refs }) {
    const { confirm } = global();
    const userTable = ref(null);
    const data = reactive({
      tableRow: {},
      dialog_add: false,
      configOption: {
        init: ["truename", "phone", "email"]
      },
      //搜索关键字
      key_word: "",
      selectData:{},
      editData: {},
      //阻止状态
      updateUserStatusFlag: false,
      //table组件配置参数
      configTable: {
        //多选框
        selection: true,
        // 翻页记录 checkbox
        recordCheckbox: true,
        //表头
        tHead: [
          {
            label: "邮箱/用户名",
            field: "username"
          },
          {
            label: "真实姓名",
            field: "truename"
          },
          {
            label: "手机号",
            field: "phone"
          },
          {
            label: "地区",
            field: "region"
          },
          {
            label: "角色",
            field: "role"
          },
          {
            label: "禁启用状态",
            field: "status",
            columnType: "slot",
            slotName: "status"
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ],
        //请求接口URL
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 10
          }
        },
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      }
    });

    const operation = params => {
    };
    const closeDialog = () => {
      data.dialog_add = false;
      refs.userTable.refreshData();
    };

    const handerBatchDel = () => {
      let userId = data.tableRow.idItem;
      if (!userId || userId.length === 0) {
        root.$message.error("请先选择待操作数据");
        return false;
      }
      confirm({
        content: "此操作将永久删除当前文件, 是否继续?",
        tip: "警告",
        fn: userDelete
      });
    };

    const handerDel = params => {
      data.tableRow.idItem = [params.id];
      confirm({
        content: "此操作将永久删除当前文件, 是否继续?",
        tip: "警告",
        fn: userDelete
      });
    };
    //删除用户
    const userDelete = () => {
      UserDel({ id: data.tableRow.idItem }).then(Response => {
        root.$message.success(Response.data.message);
      });
      // console.log(data.configTable.requestData)
      //第一种写法
      userTable.value.refreshData();
      //第二种写法
      //refs.userTable.refreshData();
    };

    const refreshData = () => {
      userTable.value.refreshData();
    };

    const handerSwitch = params => {
      if (updateUserStatusFlag) {
        return false;
      }
      data.updateUserStatusFlag = true;
      let requestData = {
        id: params.id,
        status: params.status
      };
      UserActives(requestData).then(Response => {
        root.$message.success(Response.data.message);
        data.updateUserStatusFlag = false;
      }).catch(error =>{
        data.updateUserStatusFlag = false;
      })
    };

    const search = ()=>{
      let requestData = {
        [data.selectData.value] : data.key_word
      };
      refs.userTable.paramsLoadData(requestData);
    }

    //用户新增
    const handerAdd =() =>{
      data.dialog_add = true;
      data.editData = Object.assign( {});
    }

    //用户编辑
    const handerEdit =(params) =>{
      data.dialog_add = true;
      data.editData = Object.assign( {}, params);
    }

    return {
      data,
      userTable,
      operation,
      closeDialog,
      handerBatchDel,
      handerDel,
      refreshData,
      handerSwitch,
      handerEdit,
      handerAdd,
      search
    };
  }
};
</script>
<style lang="scss" scoped>
.label-wrap {
  @include labelDom(right, 60, 40);
}
</style>