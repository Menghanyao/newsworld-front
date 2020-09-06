<template>
  <div class="admin">
    <h2>admin registry</h2>
    <el-form :model="form" :rules="rule" ref="ruleForm" label-width="100px" hide-required-asterisk>
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
      <!-- <el-button @click="cancelForm">取 消</el-button> -->
      <el-button
        type="primary"
        @click="registry('ruleForm')"
        :loading="loading"
      >{{ loading ? '提交中 ...' : '注 册' }}</el-button>
    </div>
  </div>
</template>

<script>
import Sidentify from "./Sidentify.vue";
import { addAdmin } from "../configs/myAxios.js";
import {
  REGISTRY_SUCCESS
} from "../configs/enum.js";
export default {
  components: {
    Sidentify,
  },
  created() {
      this.refreshCode()
  },
  data() {
    return {
      loading: false,
      state: 'registry',
      identifyCode: '',
      identifyCodes: "1234567890",
      form: {
        userName: "",
        userPhone: "",
        userPassword: "",
        confirmPassword: "",
        code: "", // 验证码
      },
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
    };
  },
  methods: {
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
          const regisrtyResult = await addAdmin(user);
          if (regisrtyResult.code == REGISTRY_SUCCESS) {
            this.$message({
              message: regisrtyResult.msg,
              type: "success",
            });
            this.$router.push('/')
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
  },
};
</script>