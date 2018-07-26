<template>
  <el-container class="container">
    <el-header class="header grid-content">
      <el-row>
        <el-col :span="4">
          <div class="header-introduction">
            <div class="header-title">SimpleChat</div>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="selectFriend = true">选择用户</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="createRoom">创建群组</el-button>
        </el-col>
        <el-col :offset="12" :span="2">
          <span>{{sysUserName}}</span>
        </el-col>
        <el-col :span="2" class="userinfo">
          <el-dropdown trigger="hover">
            <img class="el-dropdown-link userinfo-inner" src="../assets/user.png" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="main-container">
      <el-aside width="200px" class="left-side">
        <el-menu class="group-list">
          <GroupList v-for="(groupItem,index) in groupLists" :key="groupItem.id" :groupIndex="index" :groupMumber="groupItem.mumber" :groupId="groupItem.id" :groupName="groupItem.name"></GroupList>
        </el-menu>
      </el-aside>
      <el-main class="grid-content right-side">
        <el-col :span="24" class="content-wrapper">
          <transition name="fade" mode="out-in">
            <router-view/>
          </transition>
        </el-col>
      </el-main>
    </el-container>
    <el-dialog title="选择好友" :visible.sync="selectFriend" width="30%">
      <el-checkbox-group v-model="checkList" class="user-list">
        <UserList :userId="userItem.id" :userName="userItem.name" :key="userItem.id" v-for="userItem in userLists"></UserList>
      </el-checkbox-group>
      <el-input v-model="groupNameInput" placeholder="起个威风的群名"></el-input>
      <el-button type="primary" @click="createGroup">创建群聊</el-button>
    </el-dialog>
  </el-container>
</template>
<script>
import GroupList from "@/components/GroupList";
import UserList from "@/components/UserList";

export default {
  name: "Container",
  components: {
    GroupList: GroupList,
    UserList: UserList
  },
  data() {
    return {
      msg: "",
      sysUserName: "",
      selectFriend: false,
      checkList: [],
      groupLists: [],
      userLists: [
        { id: "aaa", name: "aaa" },
        { id: "bbb", name: "bbb" },
        { id: "ccc", name: "ccc" }
      ],
      groupNameInput: "default"
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function(val) {
      console.log(val);
    }
  },
  methods: {
    createGroup() {
      if (this.groupNameInput != undefined && this.checkList != "") {
        console.log(this.groupNameInput + this.checkList);
        //随机生成一个串，，然后查库比对是否不存在，作为唯一的串赖标记一个群聊的id
        let groupId = Math.random()
          .toString(36)
          .substr(2);
        //创建房间
        this.$socket.emit("createRoom", groupId, data => {
          console.log('xxx')
        });
        //从checkList映射回所有的好友数据
        let selectMumber = [];
        for (let i = 0; i < this.checkList.length; i++) {
          for (let j = 0; j < this.userLists.length; j++) {
            if (this.userLists[j].name === this.checkList[i]) {
              selectMumber.push(this.userLists[j]);
            }
          }
        }
        this.groupLists.push({
          id: groupId,
          name: this.groupNameInput,
          mumber: selectMumber
        });
        this.selectFriend = false;
      }
    },
    createRoom() {
      //测试一下创建房间(this.$socket.id)
    },
    queryMumber(groupId) {
      //应该是要emit一个客户端
      if (groupId === "all_public_connect") {
        return [
          { id: "aaa", name: "aaa" },
          { id: "bbb", name: "bbb" },
          { id: "ccc", name: "ccc" }
        ];
      }
      if (groupId === "room_1") {
        return [{ id: this.state.$store.userId, name: userName },];
      }
      return null;
    }
  },
  mounted() {
    this.sysUserName = this.$store.state.userName;
    var params = new URLSearchParams();
    params.append("userId", this.$store.state.userid);
    //axios请求该用户的群聊情况
    // this.$http({
    //   url: `http://127.0.0.1:3000/v1/group`,
    //   method: 'post',
    //   data: params,
    // }).then((res) => {
    //   console.log(res);
    //   if (res.status === 200) {
    //     //解析返回的数据触发groupList的值变化
    //   }
    // }).catch((res) => {
    //   console.log('请求组信息: ', res);
    // });
    // for (let i = 0; i < 10; i++) {
    //   let groupId = Math.random().toString(36).substr(2);
    //   this.groupLists.push({ id: groupId, name: groupId, mumber: [{ id: "xxx", name: "xxx" }, { id: "yyy", name: "yyy" }] })
    // }
    this.groupLists.push({
      id: "all_public_connect",
      name: "所有用户",
      mumber: this.queryMumber("all_public_connect")
    });
    this.groupLists.push({
      id: "room_01",
      name: "房间一",
      mumber: this.queryMumber("room_01")
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .header {
    height: 60px;
    overflow: hidden;
    background: rgb(238, 246, 246);
    .header-introduction {
      .simple-logo {
        height: 60px;
      }
      .header-title {
        font-weight: 700;
        font-size: 1.6rem;
        color: #18c79c;
      }
    }
    .userinfo {
      .userinfo-inner {
        cursor: pointer;
        width: 60px;
        border-radius: 50%;
      }
    }
  }
  .main-container {
    height: calc(100% - 60px);
    display: flex;
    align-content: flex-start;
    .left-side {
      height: 100%;
    }
    .right-side {
      height: 100%;
      width: calc(100% - 200px);
      .content-wrapper {
        height: 100%;
      }
    }
    .group-list {
      height: 100%;
    }
  }
}
</style>
