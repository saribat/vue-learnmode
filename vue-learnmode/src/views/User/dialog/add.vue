<template>
  <el-dialog
    title="新增："
    :visible.sync="data.dialog_info_flag"
    @close="close()"
    width="630px"
    @open="openDialog"
  >
    <el-form :model="data.form" ref="InfoForm" :rules="data.rules">
      <el-form-item label="用户名：" :label-width="data.formLabelWidth" prop="username">
        <el-input v-model="data.form.username" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码：" :label-width="data.formLabelWidth" prop="password">
        <el-input type="password" v-model="data.form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="姓名：" :label-width="data.formLabelWidth" prop="truename">
        <el-input v-model="data.form.truename" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="手机号：" :label-width="data.formLabelWidth" prop="phone">
        <el-input v-model.number="data.form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="地区：" :label-width="data.formLabelWidth" prop="region">
        <CityPicker :cityPickerLevel="[]" :cityPickerData.sync="data.cityPickerData" />
      </el-form-item>
      <el-form-item label="是否启用：" :label-width="data.formLabelWidth" prop="status">
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>
      <el-form-item label="角色：" :label-width="data.formLabelWidth" prop="role">
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox
            v-for="item in data.roleItem"
            :key="item.role"
            :label="item.role"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="按钮权限：" :label-width="data.formLabelWidth">
        <template v-if="data.btnPerm.length > 0">
          <div v-for="item in data.btnPerm" :key="item.name">
            <h4>{{ item.name}}</h4>
            <template v-if="item.perm && item.perm.length > 0">
              <el-checkbox-group v-model="data.form.btnPerm">
                <el-checkbox
                  v-for="button in item.perm"
                  :key="button.value"
                  :label="button.value"
                >{{button.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
        </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit('InfoForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import sha1 from "js-sha1";
import { reactive, ref, computed, watchEffect } from "@vue/composition-api";
import {
  GetRole,
  GetSystem,
  UserAdd,
  UserEdit,
  GetPermButton
} from "../../../api/user";
//引用组件
import CityPicker from "../../../components/CityPicker/index";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateC
} from "../../../utils/validate";
export default {
  name: "dialogInfo",
  components: { CityPicker },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit, root, refs }) {
    //校验用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    //校验密码
    let validatePassword = (rule, value, callback) => {
      /**
       * 业务逻辑
       * 1 编辑状态
       *      需要校验：data.form.id 存在且密码不为空
       *      不需要校验：data.form.id 存在且密码为空
       *
       * 2 新增状态
       *      需要校验：data.form.id不存在
       */
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        if (value) {
          data.form.password = stripscript(value);
          value = data.form.password;
        }

        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (validatePass(value)) {
          callback(new Error("密码格式有误！"));
        } else {
          callback();
        }
      }
    };
    const data = reactive({
      //用户角色
      roleItem: [],
      roleCode: [],
      submitLoading: false,
      formLabelWidth: "95px",
      dialog_info_flag: false,
      //城市数据,
      cityPickerData: {},
      //按钮权限
      btnPerm: [],
      //用户表单
      form: {
        username: "",
        password: "",
        truename: "",
        phone: "",
        region: "",
        //是否启用,
        status: "2",
        role: [],
        btnPerm: []
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      categoryOption: []
    });

    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      //root.$emit("update:flag", false);
      emit("close");
      //回调做逻辑处理时，不用修饰器，反之可用
    };

    const openDialog = () => {
      //角色请求
      getRole();
      //初始值处理
      let editData = props.editData;
      if (editData.id) {
        //编辑
        editData.role = editData.role.split(",");
        editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(",") : [];
        //循环JSON对象
        for (let key in editData) {
          data.form[key] = editData[key];
        }
      } else {
        data.form.id && delete data.form.id;
      }
    };

    const changeflag = flag => {
      data.dialog_info_flag = flag;
    };

    //请求角色

    const getRole = () => {
      if (data.roleItem.length === 0) {
        GetRole().then(Response => {
          data.roleItem = Response.data.data;
        });
      }
      if (data.btnPerm.length === 0) {
        GetPermButton().then(Response => {
          data.btnPerm = Response.data.data;
        });
      }
    };

    const resetForm = () => {
      refs.InfoForm.resetFields();
    };

    const submit = formName => {
      refs[formName].validate(valid => {
        //表单验证通过
        if (valid) {
          let requestData = JSON.parse(JSON.stringify(data.form));
          requestData.role = requestData.role.join();
          requestData.btnPerm = requestData.btnPerm.join();
          requestData.region = JSON.stringify(data.cityPickerData);

          if (requestData.id) {
            if (requestData.password) {
              requestData.password = sha1(requestData.password);
            } else {
              delete requestData.password;
            }
            userEdit(requestData);
          } else {
            requestData.password = sha1(requestData.password);
            userAdd(requestData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    const userAdd = requestData => {
      UserAdd(requestData)
        .then(Response => {
          root.$message.success(Response.data.message);
          close();
          emit("refreshTableData");
        })
        .catch(error => {});
    };

    const userEdit = requestData => {
      console.log(requestData);
      UserEdit(requestData)
        .then(Response => {
          root.$message.success(Response.data.message);
          close();
          emit("refreshTableData");
        })
        .catch(error => {});
    };

    //单项数据流，父级到子级。不能反向做修改
    //watch
    watchEffect(() => {
      data.dialog_info_flag = props.flag;
    });

    return {
      close,
      openDialog,
      submit,
      resetForm,
      data,
      getRole,
      userAdd,
      userEdit
    };
  }
};
</script>
<style lang="scss" scoped>
</style>