<template>
  <el-upload
    class="avatar-uploader"
    :action="config.action"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.image" :src="data.image" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
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
import { QiniuToken } from "../../api/common";
export default {
  /**
   * 1.组件过程要做什么（七牛云token，显示默认图片，选择图片后渲染自身图片）
   * 2.最终结果要做什么（返回选择后的图片路径）
   */
  name: "uploadImg",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config :{
      type: Object,
      default: ()=>{}
    }
  },
  setup(props, { root, emit }) {
    const data = reactive({
      image: "",
        uploadKey: {
          token: "",
          key: ""
        }
      });
    const handleAvatarSuccess = (res, file) => {
      let img = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      data.image = img;

      emit("updata:imgUrl", img)
      //form.imgUrl = URL.createObjectURL(file.raw);
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 2MB!");
      }

      //文件名转码

      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;
      return isJPG && isLt2M;
    };

    /**
     * 获取七牛云方法
     */

    const getQiniuToken = () => {
      let requestData = {
        ak: props.config.ak,
        sk: props.config.sk,
        buckety: props.config.buckety
      };
      console.log(requestData)
      QiniuToken(requestData)
        .then(Response => {
          data.uploadKey.token = Response.data.data.token;
          console.log(Response.data);
        })
        .catch(error => {});
    };

    //监听
    watch(()=> props.imgUrl, (value) =>{
      data.image = value
    })

    onMounted(()=>{
        getQiniuToken();
    })

    return {
      data,
      handleAvatarSuccess,
      beforeAvatarUpload,
      getQiniuToken
    };
  }
};
</script>

<style lang="scss" scoped>
</style>