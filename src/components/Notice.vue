<template>
  <div class="notice" v-loading.fullscreen.lock="fullscreenLoading">
    <bread :msg="name"></bread>
    <div class="notice-user" v-if="user.userLevel != admin">
      <!-- 普通用户的消息 -->
      <div
        class="user-item"
        v-for="item in noticeList"
        :key="item.noticeId"
        :class="item.read ? 'read' : ''"
        @click="read(item)"
      >
        <el-divider></el-divider>
        <!-- <h4 class="notice-title">来自系统/部门的消息</h4> -->
        <h4 class="notice-title" v-if="item.fromId == 0">
          来自系统的消息
          <span v-if="item.read">[已读]</span>
          <span v-if="!item.read" class="unread-note">[未读]</span>
        </h4>
        <h4 class="notice-title" v-else>
          来自用户的消息
          <span v-if="item.read">[已读]</span>
          <span v-if="!item.read" class="unread-note">[未读]</span>
        </h4>
        <div class="notice-content">
          <!-- <p>您已加入部门“郑州铁路局”，欢迎您</p> -->
          <p>{{ item.content }}</p>
        </div>
        <div class="notice-time">
          <small>{{ timestampToTime(item.gmtCreate) }}</small>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="block" v-if="noticeList.length != 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div class="no-content" v-if="noticeList.length == 0">
        <none msg="抱歉，此分类下暂无内容"></none>
      </div>
    </div>
    <div class="notice-admin" v-if="user.userLevel == admin">
      <!-- 管理员的消息 -->
      <el-table :data="noticeList" height="250" border style="width: 100%">
        <el-table-column type="expand" label=" " width="120">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="作者姓名">
                <div>{{ scope.row.user.userName }}</div>
              </el-form-item>
              <el-form-item label="作者电话">
                <div>{{ scope.row.user.userPhone }}</div>
              </el-form-item>

              <el-form-item label="新闻发布时间">
                <span>{{ timestampToTime(scope.row.news.gmtCreate) }}</span>
              </el-form-item>
              <el-form-item label="新闻阅读数">
                <span>{{ scope.row.news.readCount }}</span>
              </el-form-item>
              <el-form-item label="新闻标题">
                <span>{{ scope.row.news.newsTitle }}</span>
              </el-form-item>
              <el-form-item label="新闻内容">
                <!-- <span>{{ scope.row.news.newsContent }}</span> -->
                <el-button type="text" @click="getDetail(scope.row.news)">点击查看</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column align="center" prop label="作者" width="120">
          <template slot-scope="scope">{{ scope.row.user.userName }}</template>
        </el-table-column>
        <el-table-column align="center" prop label="标题" width="150">
          <template slot-scope="scope">{{ scope.row.news.newsTitle }}</template>
        </el-table-column>
        <el-table-column align="center" prop="content" label="举报原因" width="200"></el-table-column>
        <el-table-column align="center" prop="gmtCreate" label="举报时间" width="120">
          <template slot-scope="scope">{{ timestampToTime(scope.row.gmtCreate).substring(0,10) }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              class="button-delete"
              type="danger"
              size="small"
              @click="deleteNews(scope.row)"
            >删除</el-button>
            <el-popover
              placement="top-start"
              title="注意"
              width="200"
              trigger="hover"
              content="选择忽略，即认为这条新闻没有问题，以后不再显示此举报信息"
            >
              <el-button type="info" size="small" @click="ignore(scope.row)" slot="reference">忽略</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <el-divider></el-divider>
      <div class="block" v-if="noticeList.length != 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div class="no-content" v-if="noticeList.length == 0">
        <none msg="抱歉，此分类下暂无内容"></none>
      </div>
    </div>
  </div>
</template>

<script>
import Bread from "./Bread";
import None from "./None";
import {
  noticeListInterface,
  timestampToTime,
  readNotice,
  addProcess,
} from "../configs/myAxios.js";
import {
  USER_LEVEL_ADMIN,
  NOTICE_LIST_MY,
  NOTICE_LIST_REPORT,
  NOTICE_PROCESS_SUCESS,
} from "../configs/enum.js";

export default {
  components: {
    Bread,
    None
  },
  props: {
    // user: Object,
  },
  data() {
    return {
      name: "消息中心",
      user: Object,
      currentPage: 1,
      total: 1,
      noticeList: [],
      admin: USER_LEVEL_ADMIN,
      fullscreenLoading: false,
    };
  },
  created() {
    this.openFullScreen();
    this.initData();
  },
  methods: {
    async initData() {
      this.user = JSON.parse(localStorage.getItem("localUser"));
      let pagination = {
        userId: this.user.userId,
        size: 20,
        current: this.currentPage,
      };
      const initDataResult = await noticeListInterface(pagination);
      if (
        initDataResult.code == NOTICE_LIST_MY ||
        initDataResult.code == NOTICE_LIST_REPORT
      ) {
        this.noticeList = initDataResult.data.data;
        console.log("result is ", initDataResult);
        console.log("noticeList is ", this.noticeList);
        console.log(typeof this.noticeList);
        this.total = initDataResult.data.total;
      } else {
        this.$message.error("获取失败，请联系管理员");
      }
    },
    handleCurrentChange(para) {
      console.log(para);
    },
    handleSizeChange(i) {
      console.log(i);
    },
    timestampToTime(stamp) {
      return timestampToTime(stamp);
    },
    read(item) {
      let notice = {
        noticeId: item.noticeId,
      };
      readNotice(notice);
      item.read = true;
    },
    ignore(item) {
      this.read(item);
      this.noticeList.splice(this.noticeList.indexOf(item) - 1, 1);
      this.$message.info("已忽略");
    },
    deleteNews(item) {
      console.log("即将删除item：", item);
      let notice = {
        noticeId: item.noticeId,
        newsId: item.news.newsId,
        fromId: item.fromId,
      };
      const deleteResult = addProcess(notice);
      if (deleteResult.code == NOTICE_PROCESS_SUCESS) {
        this.$message({
          message: deleteResult.msg,
          type: "success",
        });
      } else {
        this.$message.error(deleteResult.msg);
      }
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
    openFullScreen() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1000);
    },
  },
};
</script>

<style scoped>
.user-item,
.notice-title,
.notice-content {
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px;
  transition: all 0.6s;
  min-width: 500px;
}
.user-item:hover .notice-title,
.user-item:hover .notice-content {
  color: #3f88d1;
  cursor: pointer;
}
.read {
  color: #2e3e4e;
  opacity: 0.6;
}
.unread-note {
  color: #fa3030;
}
.block {
  margin-top: 20px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.button-delete {
  margin-right: 10px;
}
</style>