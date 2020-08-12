<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="(item) in menuTab"
          :class="{'current': item.current}"
          @click="toggleMenu(item)"
          :key="item.id"
        >{{item.txt}}</li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="item-form" v-show="model==='register'">
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="item-form">
          <label>验证码</label>

          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{codeButtonStatus.text}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
          >{{model ==="login" ? '登录':'注册'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "../../api/login";
import { reactive, ref, onMounted, isRef, toRefs } from "@vue/composition-api";
import axios from "axios";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateC
} from "../../utils/validate";
export default {
  name: "login",
  setup(props, { refs, root }) {
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码格式有误！"));
      } else {
        callback();
      }
    };
    let validatePasswords = (rule, value, callback) => {
      if (model.value === "login") {
        callback();
      }
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请输入重复密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不匹配！"));
      } else {
        callback();
      }
    };
    let validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      } else if (validateC(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);

    const model = ref("login");

    /**
     * 登录注册按钮状态
     */
    const loginButtonStatus = ref(true);

    /**
     * 验证码按钮状态
     */

    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });

    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });

    //声明倒计时
    const timer = ref(null);

    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }]
      //code: [{ validator: validateCode, trigger: "blur" }]
    });

    /**
     * 切换模块
     */
    const toggleMenu = data => {
      menuTab.forEach(element => {
        element.current = false;
      });
      data.current = true;
      model.value = data.type;
      resetFormdata();
      clearCountDown();
    };

    /**
     * 清除表单数据
     */
    const resetFormdata = () => {
      refs.loginForm.resetFields();
    };

    /**
     * 更新按钮状态
     */
    const updataButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };

    /**
     * 获取验证码
     */
    const getSms = () => {
      if (ruleForm.username == "") {
        root.$message.error("邮箱不可为空");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误");
        return false;
      }
      //获取验证码
      let data = {
        username: ruleForm.username,
        module: model.value
      };
      //修改获取验证码状态
      updataButtonStatus({
        status: true,
        text: "发送中"
      });

      setTimeout(() => {
        GetSms(data)
          .then(response => {
            let data = response.data;
            root.$message({
              message: data.message,
              type: "success"
            });
            //启动登录注册按钮
            loginButtonStatus.value = false;
            //调用计时器，倒计时
            countDown(60);
          })
          .catch(error => {});
      }, 3000);
    };

    /**
     * 提交表单
     */
    const submitForm = formName => {
      refs["loginForm"].validate(valid => {
        //表单验证通过
        if (valid) {
          // if(model.value === 'login'){
          //     login()
          // }else{
          //     register()
          // }
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 登录
     */
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: model.value
      };
      root.$store
        .dispatch("app/login", requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //登录成功后页面跳转
          root.$router.push({
            name: "Console"
          });
        })
        .catch(error => {});
      // Login(requestData)
      //   .then(response => {
      //     let data = response.data;
      //     root.$message({
      //       message: data.message,
      //       type: "success"
      //     });
      //     //登录成功后页面跳转
      //     root.$router.push({
      //       name: "Console"
      //     });
      //   })
      //   .catch(error => {});
    };

    /**
     * 注册
     */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: model.value
      };
      Register(requestData)
        .then(response => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success"
          });
          //注册成功后转移登录
          toggleMenu(menuTab[0]);
        })
        .catch(error => {});
    };

    /**
     * 倒计时
     */

    const countDown = number => {
      //settimeout : clearTimeout() 只执行一次
      //setInterval : clearInterval()
      //判断定时器是否存在
      if (timer.valu) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          //修改获取验证码状态
          updataButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };

    /**
     * 清除倒计时
     */

    const clearCountDown = () => {
      //还原验证码状态
      updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      //清楚倒计时
      clearInterval(timer.value);
    };

    onMounted(() => {});

    return {
      menuTab,
      model,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSms,
      loginButtonStatus,
      codeButtonStatus
    };
  }
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login-btn {
    margin-top: 19px;
  }
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>