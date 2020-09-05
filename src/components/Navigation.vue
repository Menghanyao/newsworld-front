<template>
  <div id="navigation">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2" v-if="isLogin">发布新闻</el-menu-item>
      <el-submenu index="3" v-if="isLogin">
        <!-- <template slot="title">{{ localUser.userName }}</template> -->
        <template slot="title">
          {{ localUser.userName }}
          <el-badge :value="unreadCount" :max="99" class="item-badge">
          </el-badge>
        </template>
        <el-menu-item index="3-1">我的发布</el-menu-item>
        <el-menu-item index="3-2">我的部门</el-menu-item>
        <!-- <el-menu-item index="3-3">消息中心</el-menu-item> -->
        <el-menu-item index="3-3">
            消息中心
          <el-badge :value="unreadCount" :max="99" class="item-badge">
          </el-badge>
        </el-menu-item>
        <el-menu-item index="3-4" @click="logout">退出登录</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" v-if="!isLogin">
        <el-button type="text" @click="dialog = true; refreshCode(); state = 'login'">登录</el-button>
      </el-menu-item>
    </el-menu>
    <div class="line"></div>

    <el-drawer
      :title="title"
      size="40%"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="form"
          :rules="rule"
          ref="ruleForm"
          label-width="100px"
          hide-required-asterisk
        >
          <el-form-item label="电话" prop="userPhone">
            <el-col :span="18">
              <el-input placeholder="11位手机号" v-model="form.userPhone"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="姓名" prop="userName" v-if="state == 'registry'">
            <el-col :span="18">
              <el-input placeholder="真实姓名" v-model="form.userName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-col :span="18">
              <el-input show-password :rows="5" placeholder="请输入密码" v-model="form.userPassword"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认" prop="confirmPassword" v-if="state == 'registry'">
            <el-col :span="18">
              <el-input show-password :rows="5" placeholder="请再输入一次" v-model="form.confirmPassword"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-col :span="18">
              <el-input :rows="5" placeholder="下方验证码" v-model="form.code"></el-input>
            </el-col>
          </el-form-item>
          <div class="login-code" @click="refreshCode()">
            <!-- 验证码组件 -->
            <sidentify :identifyCode="identifyCode"></sidentify>
          </div>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            v-if="state == 'login'"
            type="primary"
            @click="loginButton('ruleForm')"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '登 录' }}</el-button>
          <el-button
            v-else
            type="primary"
            @click="registry('ruleForm')"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '注 册' }}</el-button>
        </div>
        <div class="change-state">
          <el-button type="text" @click="changeState">{{ state == 'login' ? '去注册->' : '去登录->' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>


<script>
// import {mapState} from 'vuex'
import Sidentify from "./Sidentify.vue";
import { mapState } from "vuex";
import { login, addUser, noticeUnreadTotal } from "../configs/myAxios.js";
import {
  LOGIN_SUCCESS,
  REGISTRY_SUCCESS,
  NOTICE_TOTAL_NEW,
} from "../configs/enum.js";

export default {
  inject: ['reload'],
  components: {
    Sidentify,
  },
  data() {
    return {
      state: "login", //  状态有login和registry两种，控制登录和注册组件的切换
      isLogin: false, //  登录状态，控制组件显示
      activeIndex: "1",
      dialog: false,
      loading: false,
      form: {
        userName: "",
        userPhone: "",
        userPassword: "",
        confirmPassword: "",
        code: "", // 验证码
      },
      formLabelWidth: "100px",
      timer: null,
      rule: {
        userName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "长度在 1 到 4 个字符",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "姓名不支持特殊字符",
            trigger: "blur",
          },
        ],
        userPhone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          // {
          //   required: true,
          //   pattern: /^1[345789]\d{9}$/,
          //   message: "仅支持11位中国大陆地区号码",
          //   trigger: "blur",
          // },
        ],
        userPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          /* {
            type: "enum",
            enum: [true],
            message: "两次密码输入不一致",
            trigger: "blur",
            transform(confirmPassword) {
              return this.form.userPassword == confirmPassword;
            }, 
          },*/
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      identifyCodes: "1234567890",
      identifyCode: "",
      localUser: {},
      unreadCount: 10,
    };
  },
  computed: {
    ...mapState(["vuexUser"]),
    title: function () {
      if (this.state == "login") {
        return "登录";
      } else {
        return "注册";
      }
    },
  },
  watch: {
    vuexUser(newUser) {
      console.log("vuex中的user已变化,newUser是：", newUser);
    },
  },
  created() {
    this.checkLogin()
    // this.checkRouter()
  },
  methods: {
    checkLogin() {
      this.localUser = JSON.parse(localStorage.getItem("localUser"));
      // console.log('vuex的状态是：', this.vuexUser);
      // console.log('localStorage的状态是：', this.localUser);
      // console.log('localUser的类型是：', typeof(this.localUser));

      if (
        this.localUser == {} ||
        this.localUser == null ||
        this.localUser == undefined ||
        this.localUser.userId == null
      ) {
        console.log("失去登录状态")
        this.isLogin = false
        this.checkRouter()
        return false
      } else {
        this.autoLogin()
        return true
      }
    },
    checkRouter() {
      // 根据路由初始化tab选中栏
      
      // this.user = {
      //   userId: 120,
      //   userName: '假医生',
      //   userType: 3,
      //   groupId: 120
      // }
      // this.isLogin = true

// console.log("checkrouterrrrrrrrrrrrrrrrrrrrrrrrr")
// console.log(!this.isLogin,this.$route.path != '/',this.$route.path != '/detail')
      if(!this.isLogin && (this.$route.path != '/' && this.$route.path != '/detail')) {
        //  未登录，只能看首页和新闻详情页
        this.$message.error("访问这个页面需要登录，请先登录")
        this.$router.push('/')
      } else {
        //  已登录，根据路由调整activeIndex
        switch(this.$route.path) {
          case('/'):
            this.activeIndex = "1"
            break
          case('/add'):
          console.log('我的添加呀')
            this.activeIndex = "2"
            break
          case('/myNews'):
          console.log('我的发布呀')
            this.activeIndex = "3-1"
            break
          case('/department'):
            this.activeIndex = "3-2"
            break
          case('/notice'):
            this.activeIndex = "3-3"
            break
          default:
            this.activeIndex = "5"
            break
        }
      }
    },
    handleSelect(key, keyPath) {
      // if (key != this.activeIndex) {
        this.activeIndex = key;
        console.log("key:", key, "keypath:", keyPath);
        console.log("activeIndex", this.activeIndex, this.activeIndex == key);
        switch (key) {
          case "1":
            this.$router.push("/");
            break;
          case "2":
            this.$router.push("/add");
            break;
          case "3-1":
            this.$router.push("/mynews");
            break;
          case "3-2":
            this.$router.push("/department");
            break;
          case "3-3":
            this.$router.push("/notice");
            break;
        }
      // } else if (key == "1") {
      //   this.$router.push("/");
      // }
    },
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.timer = setTimeout(() => {
        done();
        // 动画关闭需要一定的时间
        setTimeout(() => {
          this.loading = false;
        }, 400);
      }, 1000);
    },
    cancelForm() {
      this.refreshCode();
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    //验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
      console.log("已重置验证码");
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      console.log(this.identifyCode);
    },
    changeState() {
      // 切换登录和注册
      this.state == "login"
        ? (this.state = "registry")
        : (this.state = "login");
      this.form.userPhone = "";
      this.form.userName = "";
      this.form.userPassword = "";
      this.form.confirmPassword = "";
      this.form.code = "";
      this.refreshCode();
    },
    logout() {
      this.$confirm("即将退出登录，是否确定？", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.commit("setVuexUser", {})
          localStorage.setItem(
            "localUser",
            JSON.stringify({
              userId: null,
            })
          );
          this.localUser = {}
          this.isLogin = false
          this.$message({
            type: "success",
            message: "已退出登录状态",
          })
          this.reload()
          this.$router.push('/')
        })
        .catch(() => {});
    },
    loginButton(ruleForm) {
      // $refs.drawer.closeDrawer()
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          if (this.form.code != this.identifyCode) {
            this.$message.error("验证码错误");
            this.refreshCode();
            return false;
          }
          let user = {
            userPhone: this.form.userPhone,
            userPassword: this.form.userPassword,
          };
          const loginResult = await login(user);
          if (LOGIN_SUCCESS == loginResult.code) {
            this.$message({
              message: loginResult.msg,
              type: "success",
            });
            this.localUser = loginResult.data;
            this.isLogin = true;
            this.$refs.drawer.closeDrawer();
            this.setUser(loginResult.data);
          } else {
            this.$message.error(loginResult.msg);
          }
        } else {
          console.log("error submit!!");
          this.refreshCode();
          return false;
        }
      });
    },
    registry(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          if (this.form.userPassword != this.form.confirmPassword) {
            this.$message.error("两次密码输入不一致");
            this.refreshCode();
            return false;
          }
          if (this.form.code != this.identifyCode) {
            this.$message.error("验证码错误");
            this.refreshCode();
            return false;
          }
          let user = {
            userPhone: this.form.userPhone,
            userName: this.form.userName,
            userPassword: this.form.userPassword,
          };
          const regisrtyResult = await addUser(user);
          if (regisrtyResult.code == REGISTRY_SUCCESS) {
            this.$message({
              message: regisrtyResult.msg,
              type: "success",
            });
            this.changeState();
          } else {
            this.$message.error(regisrtyResult.msg);
          }
        } else {
          console.log("error submit!!");
          this.refreshCode();
          return false;
        }
      });
    },
    async setUser(user) {
      // 设置vuex，localStorage，向外抛出的user
      this.$store.commit("setVuexUser", user)
      localStorage.setItem("localUser", JSON.stringify(user))
      this.$emit("user", user)
      this.checkRouter()
      const unread = await noticeUnreadTotal(user)
      if (unread.code == NOTICE_TOTAL_NEW) {
        this.unreadCount = unread.data != 0 ? unread.data : null
      }
      this.reload()
    },
    async autoLogin() {
      const autoLoginResult = await login(this.localUser);
      if (LOGIN_SUCCESS == autoLoginResult.code) {
        this.$message({
          message: "自动" + autoLoginResult.msg,
          type: "success",
        });
        this.localUser = autoLoginResult.data;
        this.isLogin = true;
        this.$refs.drawer.closeDrawer();
        this.setUser(autoLoginResult.data);
      } else {
        this.$message.error("自动" + autoLoginResult.msg);
      }
    },
  },
};
</script>

<style scoped>
.login-code {
  margin-bottom: 20px;
}
#el-drawer__title {
  font-weight: bold;
}
.change-state {
  margin-top: 30px;
  padding-left: 100px;
  font-size: 24px;
}
.item-badge {
  position: relative;
  bottom: 12px;
  right: 5px;
}


</style>