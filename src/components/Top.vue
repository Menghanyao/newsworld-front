<template>
  <div class="top">
    <ol v-if="hotList.length != 0">
      <li class="top-li" v-for="item in hotList" :key="item.newsId">
        <span class="top-title" @click="getDetail(item)">{{ item.newsTitle }}</span>
      </li>
    </ol>
    <div class="no-content" v-if="hotList.length == 0">
      <span>暂时还没有热门新闻</span>
    </div>
  </div>
</template>

<script>
import { newsList } from "../configs/myAxios.js";

export default {
  props: {
    type: Number,
  },
  data() {
    return {
      hotList: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let pagination = {
        current: 1,
        size: 20,
        type: this.type,
      };
      const initResult = await newsList(pagination);
      this.hotList = initResult.data;
    },
    getDetail(item) {
      this.$router.push({
        path: "/detail",
        query: {
          newsId: item.newsId,
          authorId: item.userId,
        },
      });
    },
  },
};
</script>

<style scoped>
.top-li {
  margin: 15px auto;
  text-align: left;
  transition: all 0.4s;
}
.top-li:hover {
  color: #409eff;
  cursor: pointer;
}
.top-title {
  margin-left: 5px;
}
.no-content {
  padding-left: 10px;
}
</style>