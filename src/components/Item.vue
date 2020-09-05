<template>
  <div class="item" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="item-body" v-for="item in newsList" :key="item.newsId">
      <el-divider></el-divider>
      <h4 class="news-title" @click="getDetail(item)">{{ item.newsTitle }}</h4>
      <div class="item-body-content">
        <p
          class="news-content"
          @click="getDetail(item)"
        > {{item.newsContent.slice(0, 70) }} ...</p>
        <!-- <small>作者</small>
        <small class="news-author" @click="jumpToAuthor">郑州铁路局</small> -->
        <small>阅读数: </small>
        <small>{{ item.readCount }}</small>
        <small> | 时间: </small>
        <small>{{ timestampToTime(item.gmtCreate) }}</small>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="block"  v-if="newsList.length != 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
    <div class="no-content" v-if="newsList.length == 0">
      <none msg="抱歉，此分类下暂无内容"></none>
    </div>
  </div>
</template>

<script>
import None from "./None"

import { newsList, timestampToTime, searchList } from "../configs/myAxios.js";

export default {
  components: {
    None
  },
  props: {
    user: Object,
    type: Number
  },
  data() {
    return {
      currentPage: 1,
      totalCount: '',
      newsList: [],
      userid: Number,
      fullscreenLoading: false,
    };
  },
  created() {
    this.openFullScreen()
    this.initData()
  },
  methods: {
    async initData() {
      //  首页新闻，我的发布，作者发布，部门新闻，搜索新闻的统一入口
      this.userid = JSON.parse(localStorage.getItem('localUser')).userId
      let queryId = this.userid
      let keywords = this.$route.query.keywords ? this.$route.query.keywords : ''
      if(this.$route.query.author && this.$route.query.author != this.userid) {
        queryId = this.$route.query.author
      }
      let pagination = {
        userId: queryId,
        current: this.currentPage,
        size: 5,
        type: this.type,
        search: keywords
      }
      const initResult = keywords=='' ? await newsList(pagination) : await searchList(pagination)
      if (initResult.code == this.type) {
        this.newsList = initResult.data.data
        // this.total = initResult.data.total
        this.totalCount = initResult.data.total
        this.$forceUpdate()
        console.log(this.total)
      } else {
        console.log('获取失败',initResult)
        this.newsList = []
        // this.total = 0
        this.totalCount = 0
      }
    },
    timestampToTime(stamp) {
      return timestampToTime(stamp)
    },
    getDetail(item) {
      console.log("click title/content,item is: ", item.newsId);
      this.$router.push({
        path: "/detail",
        query: {
          newsId: item.newsId,
          authorId: item.userId
        },
      });
    },
    handleSizeChange(para) {
      console.log(para);
    },
    handleCurrentChange(para) {
      this.initData()
      console.log(para);
    },
    openFullScreen() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1000);
    },
  },
  watch: {
    $route: {
      handler() {
        this.initData()
      }
    }
  }
};
</script>

<style scoped>
.item {
  margin-bottom: 10px;
  min-width: 400px;
}
.el-divider {
  margin: 5px auto;
}
.news-title {
  text-align: left;
  margin-top: 3px;
  margin-bottom: 0px;
}
.news-content {
  /* max-width: 90%; */
  max-height: 42px;
  overflow: hidden;
  text-align: left;
  text-indent: 2em;
}
.news-title,
.news-content,
.news-author {
  transition: all 0.4s;
}
.news-title:hover,
.news-content:hover,
.news-author:hover {
  color: #409eff;
  cursor: pointer;
}
.block {
  margin-top: 20px;
}
</style>