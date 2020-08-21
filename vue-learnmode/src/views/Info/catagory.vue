<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({type: 'category_first_add'})">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category" v-for="firstitem in category.item" :key="firstitem.id">
              <h4>
                <svg-icon icon-class="minus" />
                {{firstitem.category_name}}
                <div class="button-group">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="editCategory({data:firstitem, type: 'category_first_edit'})"
                    round
                  >编辑</el-button>
                  <el-button
                    size="medium"
                    type="success"
                    @click="handlerAddChildren({data:firstitem, type: 'category_second_add'})"
                    round
                  >添加子级</el-button>
                  <el-button size="mini" round @click="deleteCategoryConfirm(firstitem.id)">删除</el-button>
                </div>
              </h4>
              <ul v-if="firstitem.children">
                <li v-for="childrenItem in firstitem.children" :key="childrenItem.id">
                  {{childrenItem.category_name}}
                  <div class="button-group">
                    <el-button size="mini" type="danger" @click="editCategory({data:childrenItem, type: 'category_first_edit'})" round>编辑</el-button>
                    <el-button size="mini" round @click="deleteCategoryConfirm(childrenItem.id)">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" class="form-wrap" ref="categoryForm" :model="form">
            <el-form-item label="一级分类名称：" v-if="category_first_input">
              <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" v-if="category_children_input">
              <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_button_loading"
                :disabled="submit_button_disabled"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  AddFirstCategory,
  GetCategory,
  DeleteCategory,
  EditCategory,
  AddChildrenCategory
} from "../../api/news";
import { reactive, ref, onMounted, watch } from "@vue/composition-api";
import { global } from "../../utils/global_V3.0";
import { common } from "../../api/common";
export default {
  name: "Catagory",
  setup(props, { root, refs }) {
    const { confirm } = global();
    const { getInfoCategory, categoryItem, getInfoCategoryAll } = common();
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });

    const category = reactive({
      item: [],
      current: []
    });

    const submit_button_type = ref("");
    const submit_button_loading = ref(false);
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    const deleteId = ref("");

    /**
     * 方法
     */
    const submit = () => {
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      }
      if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      }
      if (submit_button_type.value == "category_second_add") {
        addSecondCategory();
      }
    };

    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message.error({
          message: "名称不可为空"
        });
        return false;
      }
      //按钮加载状态
      submit_button_loading.value = true;
      AddFirstCategory({ categoryName: form.categoryName })
        .then(Response => {
          let data = Response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
            getInfoCategoryAll();
          }
          submit_button_loading.value = false;
          refs.categoryForm.resetFields();
        })
        .catch(error => {
          submit_button_loading.value = false;
        });
    };

    const editFirstCategory = () => {
      if (category.current.length == 0) {
        root.$message({
          message: "未选择分类！",
          type: "error"
        });
        return false;
      }
      let requestData = {
        id: category.current.id,
        categoryName: form.categoryName
      };
      EditCategory(requestData)
        .then(Response => {
          root.$message({
            message: Response.data.message,
            type: "success"
          });
          getInfoCategoryAll();
          form.categoryName = "";
          category.current = [];
        })
        .catch(error => {});
    };

    const addFirst = params => {
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      console.log(submit_button_type.value);
    };

    const handlerAddChildren = params => {
      //存储数据
      submit_button_type.value = params.type;
      category.current = params.data;
      form.categoryName = params.data.category_name;
      category_first_disabled.value = true;
      category_children_input.value = true;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
    };

    const addSecondCategory = () => {
      if(!form.secCategoryName){
        root.$message.error("请输入名称！");
        return false;
      }
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: category.current.id
      };
      AddChildrenCategory(requestData).then(Response => {
        console.log(Response)
        root.$message.success(Response.data.message);
        getInfoCategoryAll();
        //清空子级输入框内容
        form.secCategoryName = "";
      });
    };

    const getCategory = () => {
      GetCategory()
        .then(Response => {
          let data = Response.data.data.data;
          category.item = data;
        })
        .catch(error => {});
    };

    const editCategory = params => {
      submit_button_type.value = params.type;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      //自动填补菜单名称
      form.categoryName = params.data.category_name;
      //储存当前数据对象
      category.current = params.data;
      console.log(category.current);
    };

    const deleteCategoryConfirm = categoryID => {
      deleteId.value = categoryID;
      confirm({
        content: "此操作将永久删除当前文件, 是否继续?",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          deleteId.value = "";
          root.$message.error("已取消");
        },
        id: deleteId.value
      });
    };

    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then(Response => {
          console.log(Response);
          let data = Response.data;
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: "success"
            });
            getInfoCategoryAll();
          }
        })
        .catch(error => {
          console.log(error);
        });
    };

    /**
     * 挂载完成后马上执行
     */
    onMounted(() => {
      //getCategory();
      getInfoCategoryAll();
    });

    /**
     * watch
     */
    watch(
      () => categoryItem.item,
      value => {
        category.item = value;
      }
    );

    return {
      category_first_input,
      category_children_input,
      form,
      submit,
      addFirst,
      category,
      submit_button_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      deleteCategory,
      deleteCategoryConfirm,
      editCategory,
      submit_button_type,
      editFirstCategory,
      handlerAddChildren
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/config.scss";
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 20px;
    }
  }
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    left: 14px;
    top: 15px;
    background-color: #fff;
    font-size: 17px;
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #965;
      .button-group {
        display: block;
      }
    }
  }

  .button-group {
    display: none;
    position: absolute;
    z-index: 2;
    right: 11px;
    top: -1px;
    button {
      font-size: 12px;
    }
  }
}
.form-wrap {
  width: 410px;
  padding-top: 26px;
}
.hr-e9e9e9 {
  width: calc(100% + 60px);
  margin-left: -30px;
  border: none;
  margin-top: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e9e9e9;
}
</style>