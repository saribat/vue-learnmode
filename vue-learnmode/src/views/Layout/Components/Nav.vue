<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="../../../assets/logo.jpg" />
    </h1>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :key="item.id" :index="index + ''">
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span slot="title">{{item.meta.name}}</span>
          </template>
          <template v-for="(subitem) in item.children">
            <el-menu-item
              v-if="!subitem.hidden"
              :key="subitem.id"
              :index="subitem.path"
            >{{subitem.meta.name}}</el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  onMounted,
  isRef,
  toRefs,
  computed
} from "@vue/composition-api";
export default {
  name: "navMenu",
  setup(props, { refs, root }) {
    //data数据定义
    //const isCollapse = ref(false);
    const routers = reactive(root.$router.options.routes);

    const defaultActive = computed(()=>{
      const route = root.$route;
      const { path } = route;
      return path;
    })

    /**
     * computed 监听
     */
    const isCollapse = computed(() => {
      return root.$store.state.app.isCollapse;
    });

    /**
     * 函数定义
     */

    //打印store
    return {
      isCollapse,
      routers,
      defaultActive
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
.logo {
  text-align: center;
  img {
    margin: 28px auto 25px;
    width: 92px;
  }
}
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
  }
  .logo img {
    padding-top: 20px;
    margin: auto;
    width: 70%;
    @include webkit(transition, all 0.3s ease 0s);
  }
}
</style>