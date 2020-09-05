<template>
  <div id="add">
    <bread v-bind:msg="name"></bread>
    <div class="form-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rule"
        ref="ruleForm"
        label-width="100px"
        hide-required-asterisk
      >
        <el-form-item label="新闻标题" prop="newsTitle">
          <el-input placeholder="标题用于搜索、展示" v-model="ruleForm.newsTitle"></el-input>
        </el-form-item>
        <!-- <el-form-item label="新闻内容" prop="newsContent">
        <el-input type="textarea" :rows="5" placeholder="请输入正文" v-model="ruleForm.newsContent"></el-input>
        </el-form-item>-->

        <el-form-item label="新闻内容" prop="newsContent">
          <mavon-editor
            v-model="ruleForm.newsContent"
            ref="md"
            @change="markdownToHtml"
            style="min-height: 600px"
            @imgAdd="handleEditorImgAdd"
          />
          <!-- <el-input type="textarea" :rows="5" placeholder="请输入正文" v-model="ruleForm.newsContent"></el-input> -->
        </el-form-item>

        <!-- <el-form-item label="新闻内容" prop="newsContent">
          <div v-html="html"></div>
        </el-form-item> -->

        <el-form-item label="仅部门可见" v-if="user.groupId && user.groupId != 0">
          <el-switch
            v-model="ruleForm.newsRange"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @click="console.log(newsRange)"
          ></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
          <el-button @click="$router.push('/')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

import Bread from "./Bread.vue";
import {
  NEWS_RANGE_ALL,
  NEWS_RANGE_GROUP,
  NEWS_ADD_SUCCESS,
} from "../configs/enum.js";
import { addNews, imgUpload } from "../configs/myAxios.js";

export default {
  components: {
    Bread,
    mavonEditor,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      name: "发布新闻",
      ruleForm: {
        newsTitle: "",
        newsContent: "",
        newsRange: false,
      },
      html: "",
      rule: {
        newsTitle: [{ required: true, message: "请输入标题", trigger: "blur" }],
        newsContent: [
          { required: true, message: "请输入正文", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          let news = {
            userId: this.user.userId,
            newsTitle: this.ruleForm.newsTitle,
            newsContent: this.html,
            newsRange: this.ruleForm.newsRange
              ? NEWS_RANGE_GROUP
              : NEWS_RANGE_ALL,
          }
          // console.log("11111111111", news);
          const addResult = await addNews(news)
          // console.log(addNews)
          if (addResult.code == NEWS_ADD_SUCCESS) {
            this.$message({
              message: addResult.msg,
              type: "success",
            });
            this.$router.push("/myNews")
          }
        }
      });
    },
    markdownToHtml(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
      // console.log(this.html);
    },
    async handleEditorImgAdd(position, file) {
      let fd = new FormData();//通过form数据格式来传
      fd.append("file", file); //传文件
      let res = await imgUpload(fd)
      this.$refs.md.$imglst2Url([[position, res.data]])
    }
  },
};
</script>

<style>
.el-switch {
  float: left;
  top: 10px;
  left: 10px;
}
</style>