<template>
  <el-dialog
    title="新增："
    :visible.sync="data.dialog_info_flag"
    @close="close()"
    width="580px"
    @open="openDialog"
  >
    <el-form :model="data.form" ref="InfoForm">
      <el-form-item label="类别：" :label-width="data.formLabelWidth" prop="categoryId">
        <el-select v-model="data.form.categoryId" placeholder="请选择活动区域">
          <el-option
            v-for="item in data.categoryOption"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="data.formLabelWidth" prop="title">
        <el-input v-model="data.form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="data.formLabelWidth" prop="content">
        <el-input v-model="data.form.content" type="textarea" style="height: 160px"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { reactive, ref, computed, watchEffect } from "@vue/composition-api";
import { AddInfo } from "../../../api/news";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit, root, refs }) {
    const data = reactive({
      submitLoading: false,
      formLabelWidth: "70px",
      dialog_info_flag: false,
      form: {
        categoryId: "",
        title: "",
        content: "",
        createDate: "2020-02-02 12:00:00",
        imgUrl:
          "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg"
      },
      categoryOption :[]
    });


    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      //root.$emit("update:flag", false);
      emit("close");
      //回调做逻辑处理时，不用修饰器，反之可用
    };

    const openDialog = () => {
      data.categoryOption = props.category;
    };

    const changeflag = flag => {
      data.dialog_info_flag = flag;
    };

    const resetForm = () => {
      refs.InfoForm.resetFields();
      // (data.form.categoryId = ""), (data.form.title = ""), (data.form.content = "");
    };

    const submit = () => {
      let requestData = {
        categoryId: data.form.categoryId,
        title: data.form.title,
        content: data.form.content,
        createDate: data.form.createDate,
        imgUrl: data.form.imgUrl
      };
      if (!data.form.categoryId) {
        root.$message({
          message: "分类不能为空",
          type: "danger"
        });
        return false;
      }
      data.submitLoading = true;
      AddInfo(requestData).then(Response => {
        let data = Response.data;
        root.$message({
          message: data.message,
          type: "success"
        });
      });
      data.submitLoading = false;
      resetForm();
      emit("close");
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
      data
    };
  }
};
</script>
<style lang="scss" scoped>
</style>