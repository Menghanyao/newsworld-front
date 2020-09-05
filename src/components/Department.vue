<template>
  <div class="department" v-loading.fullscreen.lock="fullscreenLoading">
    <bread v-bind:msg="name"></bread>

    <div class="department-none" v-if="user.userLevel == none">
      <!-- 当没有部门时，可新建部门，可让leader邀请加入 -->
      <div class="none-text">您当前不属于任何部门，您可以:</div>
      <div class="none-collapase">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="联系 目标部门负责人 或者 管理员 ，通过手机号码邀请您加入" name="1">
            <div class="none-invite">
              您的号码：
              <strong>{{ user.userPhone }}</strong>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="none-create">
          <el-button class="none-create-button" type="text" @click="dialogFormVisible = true">创建部门</el-button>
          <el-dialog title="创建部门" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="部门名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <div class="none-create-notice">
                <i>请注意，部门创建后 名称不能修改</i>
              </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="createDepartment">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <div class="department-have" v-if="user.userLevel == common || user.userLevel == owner">
      <!-- 已经有部门 -->
      <div class="have-left">
        <h3>部门新闻</h3>
        <item :type="group"></item>
      </div>
      <div class="have-right">
        <div class="have-basic">
          <div class="basic-text">您已加入</div>
          <div class="basic-name">{{ department.groupName }}</div>
        </div>
        <div class="have-time">
          <span class="time-left">成立时间：</span>
          <span>{{ timestampToTime(department.gmtCreate).substring(0,11) }}</span>
        </div>
        <div class="have-scale">
          <span class="scale-left">部门规模：</span>
          <span>{{ department.groupScale }}人</span>
        </div>
        <div class="have-leader">
          <span class="leader-left">部门主管：</span>
          <span class="leader-right" @click="jumpToAuthor(boss)">{{ boss.userName }}</span>
        </div>
        <div class="have-invite" v-if="user.userLevel == owner">
          <el-button
            class="none-create-button invite-left"
            type="primary"
            plain
            @click="dialogInviteFormVisible = true;form.phone = ''"
          >邀请成员</el-button>
        </div>
        <el-dialog title="邀请成员" :visible.sync="dialogInviteFormVisible">
          <el-form :model="form">
            <el-form-item label="对方电话号码" :label-width="formLabelWidth">
              <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogInviteFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="inviteMember">确 定</el-button>
          </div>
        </el-dialog>
        <div
          class="have-exit"
          v-if="user.userLevel == common || user.userLevel == owner && department.groupScale == 1"
        >
          <el-button
            class="none-create-button invite-left"
            type="danger"
            plain
            @click="dialogExitFormVisible = true"
          >退出部门</el-button>
        </div>
        <el-dialog title="退出/解散部门" :visible.sync="dialogExitFormVisible">
          <span>你确定要退出该部门吗？</span>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogExitFormVisible = false">取 消</el-button>
            <el-button type="danger" @click="exitDepartment">确 定</el-button>
          </div>
        </el-dialog>
        <div class="have-mumbers">
          <span class="leader-left">部门成员：</span>
          <div class="member-rightr">
            <div
              class="member-item"
              v-for="item in colleagues"
              @click="jumpToAuthor(item)"
              :key="item.userId"
            >{{ item.userName }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="department-admin" v-if="user.userLevel == admin">
      <!-- 系统管理员 -->
      <el-table :data="groupList" height="250" border style="width: 100%">
        <el-table-column prop="groupName" label="部门名称" width="180"></el-table-column>
        <el-table-column prop="userName" label="管理员" width="100"></el-table-column>
        <el-table-column prop="groupScale" label="人 数" width="80"></el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" width="120">
          <template slot-scope="scope">{{ timestampToTime(scope.row.gmtCreate).substring(0,10) }}</template>
        </el-table-column>
        <el-table-column prop="gmtCreate" label="操 作" width="120">
          <template slot-scope="scope">
            <el-button @click="openAddForm(scope.row)" type="primary" size="small">添加成员</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-if="groupList.length != 0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <div class="no-content" v-if="groupList.length == 0">
        <none msg="抱歉，此分类下暂无内容"></none>
      </div>
      <el-dialog title="添加成员" :visible.sync="dialogAddFormVisible">
        <el-form :model="form">
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAddFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMember">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import None from "./None";
import Bread from "./Bread";
import Item from "./Item";

import {
  getUser,
  getGroup,
  colleagueList,
  timestampToTime,
  addGroup,
  exitGroup,
  invite,
  groupList,
  addMember,
} from "../configs/myAxios.js";

import {
  USER_LEVEL_NONE,
  USER_LEVEL_COMMON,
  USER_LEVEL_OWNER,
  USER_LEVEL_ADMIN,
  NEWS_RANGE_GROUP,
  GROUP_ADD_SUCCESS,
  EXIT_SUCCESS,
  INVITE_SUCCESS,
  GROUP_ADMIN_INVITE_SUCCESS,
} from "../configs/enum.js";

export default {
  components: {
    Bread,
    Item,
    None,
  },
  data() {
    return {
      name: "我的部门",
      user: Object,
      none: USER_LEVEL_NONE,
      common: USER_LEVEL_COMMON,
      owner: USER_LEVEL_OWNER,
      admin: USER_LEVEL_ADMIN,
      group: NEWS_RANGE_GROUP,
      department: Object,
      boss: Object,
      colleagues: Array,
      activeName: "",
      dialogFormVisible: false,
      dialogInviteFormVisible: false, //  邀请成员的对话框
      dialogExitFormVisible: false, //  退出部门的对话框
      dialogAddFormVisible: false, //  管理员邀请成员的对话框
      formLabelWidth: "120px",
      currentPage: 1,
      total: 1,
      form: {
        name: "",
        phone: Number,
        groupId: Number,
      },
      groupList: [],
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
      let axiosUser = await getUser(this.user.userId);
      this.user = axiosUser.data;
      if (this.user.userLevel == this.none) {
        return;
      } else if (
        this.user.userLevel == this.common ||
        this.user.userLevel == this.owner
      ) {
        this.initDepartment();
        this.initColleage();
      } else if (this.user.userLevel == this.admin) {
        this.initAdmin();
      }
    },
    async initDepartment() {
      console.log("初始化部门信息：");
      const department = await getGroup(this.user.groupId);
      this.department = department.data;
    },
    async initColleage() {
      console.log("初始化同事信息：");
      const colleagues = await colleagueList(this.user);
      this.colleagues = colleagues.data;
      this.boss = this.colleagues.filter(
        (item) => item.userLevel == this.owner
      )[0];
    },
    async initAdmin() {
      console.log("初始化管理员展示信息：");
      let pagination = {
        userId: this.user.userId,
        current: this.currentPage,
        total: this.total,
      };
      const groupResult = await groupList(pagination);
      this.groupList = groupResult.data.data;
      this.total = groupResult.data.total;
    },
    async createDepartment() {
      if (!this.form.name || this.form.name.trim() == "") {
        this.$message.error("请填写部门名称");
        return false;
      }
      let group = {
        groupName: this.form.name,
        userId: this.user.userId,
      };
      const addGroupResult = await addGroup(group);
      if (addGroupResult.code == GROUP_ADD_SUCCESS) {
        this.$message({
          message: addGroupResult.msg + this.form.name,
          type: "success",
        });
        this.dialogFormVisible = false;
        this.initData();
      } else {
        this.$message.error(addGroupResult.msg);
        return false;
      }
    },
    async inviteMember() {
      // 邀请成员加入部门
      if (this.form.phone.trim() == "" || isNaN(this.form.phone)) {
        this.$message.error("请输入正确的号码");
        return false;
      }
      let user = {
        userId: this.user.userId,
        userPhone: Number(this.form.phone.trim()),
      };
      const inviteResult = await invite(user);
      if (inviteResult.code == INVITE_SUCCESS) {
        this.$message({
          message: inviteResult.msg,
          type: "success",
        });
        this.dialogInviteFormVisible = false;
        this.initData();
        return true;
      } else {
        this.$message.error(inviteResult.msg);
        return false;
      }
    },
    async exitDepartment() {
      //退出部门
      let user = {
        userId: this.user.userId,
        groupId: this.user.groupId,
      };
      const exitResult = await exitGroup(user);
      if (exitResult.code == EXIT_SUCCESS) {
        this.$message({
          message: exitResult.msg,
          type: "success",
        });
        this.initData();
      } else {
        this.$message.error(exitResult.msg);
        return false;
      }
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
    timestampToTime(stamp) {
      return timestampToTime(stamp);
    },
    handleCurrentChange(para) {
      console.log(para);
      this.initData();
    },
    openAddForm(item) {
      this.dialogAddFormVisible = true;
      this.form.phone = "";
      this.form.groupId = item.groupId;
    },
    async addMember() {
      if (this.form.phone.trim() == "" || isNaN(this.form.phone)) {
        return false;
      }
      let user = {
        userId: this.user.userId,
        groupId: this.form.groupId,
        userPhone: Number(this.form.phone.trim()),
      };
      const addResult = await addMember(user);
      if (addResult.code == GROUP_ADMIN_INVITE_SUCCESS) {
        this.$message({
          message: addResult.msg,
          type: "success",
        });
        this.dialogAddFormVisible = false;
        this.initData();
      } else {
        this.$message.error(addResult.msg);
      }
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
.display-none {
  display: none;
}
.department-none {
  width: 80%;
  min-width: 500px;
  margin: 30px auto;
}
.none-collapase {
  margin-top: 20px;
}
.none-invite {
  font-size: 15px;
  padding-top: 10px;
}
.none-create {
  text-align: left;
}
.none-crete-button {
  float: left;
}
.none-create-notice {
  margin-left: 30px;
  color: rgb(214, 54, 54);
}
.have-left {
  display: inline-block;
  float: left;
}
@media screen and (min-width: 500px) {
  .have-left {
    width: 63%;
  }
}
.have-right {
  display: inline-block;
  max-width: 260px;
  float: right;
  margin-right: 20px;
  padding-right: 15px;
  padding-bottom: 15px;
  border-left: 1px dotted #333;
}
@media screen and (max-width: 880px) {
  .have-right {
    display: none;
  }
  .have-left {
    width: 80%;
  }
}
.have-basic {
  font-weight: bold;
  text-align: left;
}
.basic-text,
.basic-name {
  display: inline-block;
  margin-left: 10px;
}
.have-time,
.have-scale,
.have-leader,
.have-mumbers {
  margin-top: 10px;
  text-align: left;
  margin-left: 20px;
}
.time-left,
.scale-left,
.leader-left {
  margin-right: 20px;
}
.leader-right {
  transition: all linear 0.3s;
}
.leader-right:hover,
.member-item:hover {
  color: #409eff;
  cursor: pointer;
}
.member-item {
  margin-top: 3px;
  padding-left: 100px;
  transition: all linear 0.3s;
}
.invite-left {
  margin-top: 10px;
  font-size: 16px;
}
</style>