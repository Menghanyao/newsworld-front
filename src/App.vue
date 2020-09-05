<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="app-title">新闻世界-news' world</div>
        <div class="app-search">
          <search></search>
        </div>
      </el-header>
      <el-aside>
        <navigation @user="getuser"></navigation>
      </el-aside>
      <el-main>
        <router-view v-if="isRouterAlive" :user="user"></router-view>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import Search from "./components/Search.vue";

export default {
  name: "app",
  provide() {
    return {
      reload: this.reload,
    };
  },
  components: {
    Navigation,
    Search,
  },
  methods: {
    getuser(val) {
      console.log("App.vue获得了user值：", val);
      this.user = val;
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
  data() {
    return {
      user: {},
      isRouterAlive: true,
    };
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.el-header {
  /* text-align: left; */
  position: relative;
}
.app-title {
  display: inline-block;
  /* left: 100px; */
  position: absolute;
  left: 20px;
  color: #409eff;
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
  margin-right: 20%;
  min-width: 320px;
  text-align: left;
}
.app-search {
  display: inline-block;
  position: absolute;
  right: 20px;
  line-height: 60px;
}
@media screen and (max-width: 500px) {
  .app-search {
    display: none;
  }
}
.el-aside {
  width: 800px !important;
}
</style>
