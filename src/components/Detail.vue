<template>
  <div class="detail" v-loading.fullscreen.lock="fullscreenLoading">
    <bread v-bind:msg="name"></bread>
    <div class="detail-title">{{ news.newsTitle }}</div>
    <!-- <div class="detail-title">震惊，印度政府竞对马云做出这种事</div> -->
    <div class="detail-author">
      <!-- <avatar :name="author.userName"></avatar> -->
      <span class="detail-author-name">
        作者：
        <span @click="jumpToAuthor(author)">{{ author.userName }}</span>
      </span>
      <span class="detail-author-time">
        发布时间：
        <span>{{ timestampToTime(news.gmtCreate) }}</span>
      </span>
      <span class="detail-author-readCount">
        阅读数：
        <span>{{ news.readCount }}</span>
      </span>
      <span class="detail-author-readCount">
        当前热度：
        <span>{{ news.readHot }}</span>
      </span>
      <span class="detail-author-report" v-if="user.userName">
        <el-button type="danger" size="small" @click="report">举报文章</el-button>
      </span>
    </div>
    <div class="detail-devide"></div>
    <div class="detail-content">
      <!-- <pre>
        《焦骨》（《风花雪月》之“花”）
        作曲/演唱：银临
        作词：慕清明
        编曲/混音：灰原穷
        题字：桥半舫
        海报：井井酱
        PV：苏婉
        不肯违心绽放的花，受炽焰焚骨之痛。
        骨虽焦枯，而其芳华愈盛。
        ——题记
        謇傲花瓣在烈火中惊艳成灰
        灼烫的夜 凝视某些虚伪
        敢在世俗唇舌上奔跑的明媚
        该被倾慕 也应该被敬畏
        如同刀尖下挣扎着流水
        潺潺淌出倔强的慈悲
        也憧憬与大雪一同跌坠
        激烈自由地被风包围
        宁愿我凋谢成枯岩余晖
        襟怀万里山海鼎沸
        向人间烟火种半碗惊雷
        埋在春风的韵尾
        晨曦照彻白云碑
        （music）
        七情六欲还没疯完先别追悔
        三千世界 足够耗尽轮回
        穷途末路就折了傲骨听玉碎
        逆光的梦 越真挚越垂危
        情有独钟的是轻狂年岁
        独上高楼宣苍龙来会
        我爱的恨的众生都很美
        缠绵过眼中每一滴泪
        宁愿我凋谢成枯岩余晖
        襟怀万里山海鼎沸
        向人间烟火种半碗惊雷
        埋在春风的韵尾
        晨曦照彻白云碑
        （music）
        将绽放在最辽阔的明天
        对峙心头那片荒原
        我生就绚丽短暂如热恋
        只想温柔地赴险
        举世无双一千遍
        -终-
      </pre>-->
      <!-- <pre> {{ news.newsContent }} </pre> -->
      <div v-html="news.newsContent"></div>
    </div>
    <div class="detail-devide"></div>
    <div class="detail-comment">
      <div class="my-comment">
        <span class="detail-author-readCount">
          这篇文章：
          <span v-if="!firstLikeIcon">
            <i class="el-icon-star-off no-like" @click="addFirstLike"></i>
            {{ firstLikeCount }} 人觉得很赞
          </span>
          <span v-else>
            <i class="el-icon-star-on like" @click="cancelFirstLike"></i>
            {{ firstLikeCount }} 人觉得很赞
          </span>
        </span>
        <h3>畅所欲言</h3>
        <div class="my-comment-form">
          <el-input type="textarea" :rows="3" placeholder="评论一下..." v-model="myFirstComment"></el-input>
        </div>
        <div class="my-comment-button">
          <el-button type="success" plain @click="addFirstComment">提 交</el-button>
        </div>
      </div>
      <div class="detail-devide"></div>
      <div class="comment-area">
        <h3>评论区 : {{ firstCommentCount }}条评论</h3>

        <div class="comment-item" v-for="item in firstCommentList" :key="item.index">
          <div class="item-left">
            <!-- <div class="left-avatar">{{ item.fromUser.userName.slice(-2) }}</div> -->
            <div class="left-avatar">{{ item.fromUserName }}</div>
            <!-- <div class="left-avatar">{{ firstCommentUser[item.index].userName }}</div> -->
          </div>
          <div class="item-right">
            <div class="right-content">
              <!-- <p>
                一级评论内容一级评论内容一级评论内容一级评论内容一级评论内容一级评论内容一级评论内容一级评论内容一级评论内容一级评论内容一级评论内容一级评论内
                容一级评论内容一级评论内容一级评论内容一级评论内容
              </p>-->
              <p>{{ item.comment.content }}</p>
            </div>
            <div class="right-like">
              <span v-if="!secondLikeIcon[item.index]">
                <i class="el-icon-star-off no-like" @click="addSecondLike(item)"></i>
                {{ item.secondLikeCount }}人觉得很赞
              </span>
              <span v-else>
                <i class="el-icon-star-on like" @click="cancelSecondLike(item)"></i>
                {{ item.secondLikeCount }}人觉得很赞
              </span>
            </div>
            <div class="right-comment">
              <span>
                <i class="el-icon-s-comment no-like" @click="expandSecondCommentArea(item)"></i>
                {{ item.secondCommentCount }}
              </span>
            </div>
            <div class="right-time">
              <!-- <span>2020年8月13日 00:12:40</span> -->
              <span>{{ timestampToTime(item.comment.gmtCreate) }}</span>
            </div>
            <div class="second-comment-area" v-show="item.secondExpand">
              <div
                class="second-comment-item"
                v-for="secondItem in item.secondCommentList"
                :key="secondItem.commentId"
              >
                <div class="second-left">
                  <div class="second-left-avatar">{{ secondItem.fromUser.userName.slice(-2) }}</div>
                </div>
                <div class="second-right">
                  <p>{{ secondItem.comment.content }}</p>
                </div>
                <div class="second-time">
                  <span>{{ timestampToTime(secondItem.comment.gmtCreate) }}</span>
                </div>
              </div>

              <div class="my-second-comment">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="回复评论..."
                  v-model="mySecondComment[item.index]"
                ></el-input>
                <div class="my-comment-button">
                  <el-button type="success" size="small" plain @click="addSecondComment(item)">提 交</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Avatar from "./Avatar";
import "mavon-editor/dist/css/index.css";
import Bread from "./Bread.vue";
import {
  getUser,
  getNews,
  readNews,
  timestampToTime,
  addReport,
  getFirstCommentList,
  getNewsLikeCount,
  getFirstLikeList,
  getSecondLikeCount,
  getSecondLikeList,
  getSecondCommentList,
  addComment,
  cancelLike
} from "../configs/myAxios.js";
import {
  NOTICE_ADD_REPORT,
  COMMENT_TYPE_FIRST_LIKE,
  COMMENT_TYPE_FIRST_COMMENT,
  COMMENT_TYPE_SECOND_LIKE,
  COMMENT_TYPE_SECOND_COMMENT,
} from "../configs/enum.js";

export default {
  inject: ['reload'],
  // props: {
  //   user: Object,
  // },
  components: {
    Bread,
    // Avatar,
  },
  data() {
    return {
      name: "详情",
      user: {},
      news: {
        newsContent: "",
      },
      author: Object,
      fullscreenLoading: false,
      myFirstComment: "",
      mySecondComment: [],
      firstCommentList: [],
      firstCommentCount: "",
      firstLikeCount: "",
      firstLikeList: [],
      firstLikeIcon: false,
      secondLikeIcon: [],
      firstLikeRecord: {},
      secondLikeRecord: [],
      firstCommentUser: []
    };
  },
  created() {
    this.openFullScreen();
    console.log(this.$route.query);
    this.initData();
  },
  methods: {
    async initData() {
      this.user = JSON.parse(localStorage.getItem('localUser'))
      let newsId = this.$route.query.newsId;
      let authorId = this.$route.query.authorId;
      const news = await getNews(newsId);
      const author = await getUser(authorId);
      await readNews(news.data);
      this.news = news.data;
      this.author = author.data;
      const res = this.initFirstLikeAndComment();
      console.log(res)
    },
    report() {
      this.$prompt("", "举报原因", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[\u4E00-\u9FA5]/,
        inputErrorMessage: "需包含中文",
      })
        .then(async ({ value }) => {
          let notice = {
            newsId: this.news.newsId,
            fromId: this.user.userId,
            toId: 0,
            content: value,
          };
          const reportResult = await addReport(notice);
          if (reportResult.code == NOTICE_ADD_REPORT) {
            this.$message({
              type: "success",
              message: "我们已成功收到您的举报，稍后将受理",
            });
          } else {
            this.$message({
              type: "info",
              message: reportResult.msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消举报",
          });
        });
    },
    timestampToTime(stamp) {
      return timestampToTime(stamp);
    },
    jumpToAuthor(people) {
      let path = "";
      if (people.userId == this.user.userId) {
        path = "myNews";
      } else {
        path = "author";
      }
      this.$router.push({
        path: path,
        query: {
          author: people.userId,
        },
      });
    },
    openFullScreen() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      },1500);
    },
    async initFirstLikeAndComment() {
      
      let news = {
        newsId: this.news.newsId,
      };
      
      const firstLikeCount = await getNewsLikeCount(news);
      const firstLikeList = await getFirstLikeList(news);
      const firstCommentList = await getFirstCommentList(news);

      this.firstLikeCount = firstLikeCount.data;
      this.firstLikeList = firstLikeList.data;
      this.firstCommentCount = firstCommentList.data.length;
      this.firstCommentList = firstCommentList.data;
      this.firstLikeIcon = false; // 控制点赞样式
      let index = 0;
      this.firstLikeList.forEach((item) => {
        if (this.user.userId == null) {
          return
        }
        if (item.fromId == this.user.userId) {
          this.firstLikeRecord = item;
          this.firstLikeIcon = true;
          console.log(2222222222222222222222222,item.fromId,this.user.userId)
        }
      });
      this.firstCommentList.forEach(async (item) => {
        item.index = index;
        this.firstCommentUser[index++] = item.fromUser
        this.$set(item, 'fromUserName', item.fromUser.userName)
        // console.log(2222222222222222222222222222,this.firstCommentUser[item.index].userName)

        item.secondExpand = false;
        let secondLikeCount = await getSecondLikeCount(item.comment);
        item.secondLikeCount = secondLikeCount.data;
        let secondCommentList = await getSecondCommentList(item.comment);
        item.secondCommentList = secondCommentList.data;
        item.secondCommentCount = secondCommentList.data.length;
        let secondLikeListResult = await getSecondLikeList(item.comment);
        let secondLikeList = secondLikeListResult.data;

        let secondLikeIcon = false; //  控制二级点赞样式
        secondLikeList.forEach((sub) => {
          if (sub.fromId == this.user.userId) {
            this.secondLikeRecord[item.index] = sub;
            secondLikeIcon = true;
          }
        });
        this.secondLikeIcon[item.index] = secondLikeIcon;
      });
      this.$forceUpdate();
    },
    expandSecondCommentArea(item) {
      console.log(item, item.secondExpand);
      item.secondExpand = !item.secondExpand;
      this.$forceUpdate();
    },
    async addComment(comment) {
      const addResult = await addComment(comment);
      if (
        comment.commentType == COMMENT_TYPE_FIRST_COMMENT ||
        comment.commentType == COMMENT_TYPE_SECOND_COMMENT
      ) {
        this.$message({
          type: "success",
          message: addResult.msg,
        });
      } else {
        return true;
      }
    },
    async addFirstLike() {
      if (!this.user.userId) {
        this.$message.error("该功能需要登录才能使用")
        return false
      }
      let comment = {
        newsId: this.news.newsId,
        commentType: COMMENT_TYPE_FIRST_LIKE,
        fromId: this.user.userId,
        toId: this.news.userId,
      };
      const res = await this.addComment(comment);
      console.log(res);
      this.firstLikeIcon = true;
      // this.firstLikeCount ++;
      this.reload()
      // this.initFirstLikeAndComment()
      // console.log("1喜欢", comment)
    },
    cancelFirstLike() {
      // console.log("1你点击了no喜欢",this.firstLikeRecord)
      cancelLike(this.firstLikeRecord)
      this.firstLikeCount--;
      this.firstLikeIcon = false;
      this.reload()
    },
    async addSecondLike(parentComment) {
      if (!this.user.userId) {
        this.$message.error("该功能需要登录才能使用")
        return false
      }
      let comment = {
        newsId: this.news.newsId,
        commentType: COMMENT_TYPE_SECOND_LIKE,
        fromId: this.user.userId,
        toId: parentComment.comment.fromId,
        parentId: parentComment.comment.commentId,
      };
      const res = await this.addComment(comment);
      console.log(res);
      this.secondLikeIcon[parentComment.index] = true;
      // parentComment.secondLikeCount++;
      this.reload()
      // this.$forceUpdate();
      // this.initFirstLikeAndComment()
      // console.log("2喜欢", comment)
    },
    cancelSecondLike(item) {
      // console.log("2,no like",this.secondLikeRecord[item.index])
      cancelLike(this.secondLikeRecord[item.index])
      this.secondLikeIcon[item.index] = false;
      item.secondLikeCount--;
      this.$forceUpdate();
      this.reload()
    },
    async addFirstComment() {
      if (!this.user.userId) {
        this.$message.error("该功能需要登录才能使用")
        return false
      }
      if (this.myFirstComment != "" && this.myFirstComment.trim() != "") {
        let comment = {
          newsId: this.news.newsId,
          commentType: COMMENT_TYPE_FIRST_COMMENT,
          fromId: this.user.userId,
          toId: this.news.userId,
          content: this.myFirstComment,
        };
        const res = await this.addComment(comment);
        console.log(res);
        this.myFirstComment = "";
        this.reload()
        // console.log("1,comment",comment)
      } else {
        this.$message.error("评论内容不能为空");
        return false;
      }
    },
    async addSecondComment(item) {
      if (!this.user.userId) {
        this.$message.error("该功能需要登录才能使用")
        return false
      }
      if (
        this.mySecondComment[item.index] != "" &&
        this.mySecondComment[item.index].trim() != ""
      ) {
        let comment = {
          newsId: this.news.newsId,
          commentType: COMMENT_TYPE_SECOND_COMMENT,
          fromId: this.user.userId,
          toId: item.comment.fromId,
          content: this.mySecondComment[item.index],
          parentId: item.comment.commentId,
        };
        const res = await this.addComment(comment);
        console.log(res);
        this.mySecondComment[item.index] = "";
        this.reload()
        // console.log("2,comment",comment)
      } else {
        this.$message.error("评论内容不能为空");
        return false;
      }
    },
  },
};
</script>

<style scoped>
.detail {
  min-width: 500px;
}
.detail-title {
  font-weight: bold;
  font-size: 20px;
  text-align: left;
}
.detail-author {
  min-width: 660px;
  margin-top: 20px;
  text-align: left;
  font-size: 14px;
}
.detail-author-time,
.detail-author-readCount,
.detail-author-report {
  margin-left: 30px;
}
.detail-devide {
  margin-top: 20px;
  border-top: 1px solid #2c3e50;
  opacity: 0.3;
}
.detail-content {
  margin-top: 25px;
  font-size: 16px;
}
.detail-author-name span {
  transition: all ease 0.3s;
}
.detail-author-name span:hover {
  color: #409eff;
  cursor: pointer;
}
.my-comment {
  text-align: left;
  margin-top: 30px;
}
.my-comment-button {
  margin-top: 10px;
  text-align: right;
}
.comment-area {
  text-align: left;
  margin-top: 35px;
}
.comment-item {
  /* border-top: 1px dotted #2c3e50; */
  border-top: 1px dotted #607d9b;
  margin-bottom: 10px;
  min-width: 800px;
}
.item-left {
  display: inline-block;
  width: 100px;
  height: 80px;
  justify-content: center;
  /* background-color: rosybrown; */
  float: left;
  padding-left: 20px;
}
.left-avatar {
  margin-top: 10px;
  color: #fff;
  background-color: #409eff;
  opacity: 0.75;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  font-size: 15px;
  text-align: center;
  line-height: 70px;
}
.item-right {
  display: inline-block;
  /* float: right; */
  text-align: left;
  width: 70%;
  min-width: 580px;
}
.right-content {
  font-size: 17px;
  text-indent: 2em;
}
.right-content p {
  margin-bottom: 2px;
}
.right-like,
.right-comment,
.right-time {
  margin-top: 8px;
  display: inline-block;
  margin-right: 20px;
}
.right-like span {
  font-size: 15px;
}
.no-like {
  font-size: 18px;
  cursor: pointer;
}
.like {
  font-size: 22px;
  color: rgb(248, 7, 7);
  cursor: pointer;
}
.right-time {
  /* display: inline-block; */
  float: right;
  text-align: right;
  line-height: 30px;
}
.second-comment-item {
  margin-top: 20px;
  border-top: 1px dotted #666;
}
.second-left {
  display: inline-block;
  width: 60px;
  height: 50px;
  margin-top: 10px;
  float: left;
}
.second-left-avatar {
  background-color: #409eff;
  opacity: 0.85;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
}
.second-right {
  margin-left: 10px;
  display: inline-block;
  text-indent: 2em;
  max-width: 80%;
}
.second-right p {
  margin-bottom: 2px;
}
.second-time {
  margin-top: 5px;
  text-align: right;
  font-size: 14px;
}
.my-second-comment {
  margin-top: 20px;
  border-top: 1px dotted #666;
  padding-top: 12px;
}
</style>