<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState()">
      <svg-icon iconClass="menu" class="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">{{username}}</div>
      <div class="header-icon pull-left" @click="logout()">
        <svg-icon iconClass="exit" class="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
export default {
  name: "layoutHeader",
  setup(props, { root }) {
    const username = computed(() => root.$store.state.app.username);
    //退出
    const logout = () => {
      root.$store.dispatch("app/logout").then(Response => {
        if (Response.resCode === 0) {
          root.$message.success("退出成功！");
          root.$router.push({
            name: "Login"
          });
        }
      });
    };
    const navMenuState = () => {
      root.$store.commit("app/SET_COLLAPSE");
    };

    return {
      navMenuState,
      username,
      logout
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: 75px;
  background-color: #fff;
  line-height: 75px;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
}
.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  * .header-icon {
    padding: 0 28px;
  }
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
</style>