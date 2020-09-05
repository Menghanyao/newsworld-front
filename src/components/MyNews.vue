<template>
  <div class="mynews">
    <bread v-bind:msg="name"></bread>
    <div class="mynews-left">
      <h3>{{ name }}</h3>
      <item :user="user" :type="who"></item>
    </div>
  </div>
</template>

<script>
import Item from "./Item";
import Bread from "./Bread";
import { NEWS_RANGE_MY, NEWS_RANGE_OTHER_PUBLIC, NEWS_SEARCH } from "../configs/enum.js";

export default {
  components: {
    Item,
    Bread,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      name: "我的主页",
      who: Number,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const queryId = this.$route.query.author ? this.$route.query.author : this.user.userId
      const keywords = this.$route.query.keywords ? this.$route.query.keywords.trim() : null
      if (this.user.userId == queryId && !keywords) {
        this.name="我的发布"
        this.who = NEWS_RANGE_MY
        // console.log("111111111111111111111111111", queryId, this.who);
      } else if (this.user.userId != queryId && !keywords){
        this.name="作者发布"
        this.who = NEWS_RANGE_OTHER_PUBLIC
        // console.log("222222222222222222222222222", queryId, this.who);
      } else if(keywords) {
        this.name = "搜索新闻"
        this.who = NEWS_SEARCH
      }
    },
  },
};
</script>

<style scoped>
.mynews-left {
  display: inline-block;
  float: left;
}
@media screen and (min-width: 500px) {
  .home-left {
    max-width: 500px;
  }
}
</style>