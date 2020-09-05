<template>
  <div class="home">
    <div class="home-left">
      <h3>最新</h3>
      <item :user="user" :type="all"></item>
    </div>
    <div class="home-right">
      <h3>热门</h3>
      <top :type="hot"></top>
    </div>
  </div>
</template>

<script>
import Item from "./Item";
import Top from "./Top.vue";
import { NEWS_RANGE_ALL, NEWS_RANGE_HOT } from "../configs/enum.js";

export default {
  components: {
    Item,
    Top,
  },
  props: {
    user: Object
  },
  data() {
    return {
      all: NEWS_RANGE_ALL,
      hot: NEWS_RANGE_HOT,
    }
  }
};
</script>

<style scoped>
.home-left {
  display: inline-block;
  float: left;
  min-width: 500px;
}
@media screen and (min-width: 550px) {
  .home-left {
    /* max-width: 500px; */
    width: 65%;
  }
}
.home-right {
  display: inline-block;
  float: right;
  margin-right: 20px;
  padding-right: 15px;
  padding-bottom: 15px;
  border: 1px dotted #333;
  border-radius: 20px;
  box-shadow: 5px 10px 5px #888888;
  /* background-color: salmon; */
}
@media screen and (max-width: 850px) {
  .home-right {
    display: none;
  }
}
</style>