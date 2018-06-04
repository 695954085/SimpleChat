<template>
  <el-container class="container">
    <el-header class="header grid-content">
      <div class="header-introduction">
        <img class="simple-logo" src="../assets/logo.png" alt="" style="display:none;">
        <div class="header-title">SimpleChat</div>
      </div>
      <el-button type="primary" @click="selectFriend = true">选择用户</el-button>
    </el-header>
    <el-container class="main-container">
      <el-aside width="200px" class="left-side">
        <el-menu class="group-list">
          <GroupList :groupMumber=groupItem.mumber :groupId=groupItem.id :groupName=groupItem.name :key="groupItem.id" v-for="groupItem in groupLists"></GroupList>
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
        <UserList :userId=userItem.id :userName=userItem.name :key="userItem.id" v-for="userItem in userLists"></UserList>
      </el-checkbox-group>
      <el-input v-model="groupNameInput" placeholder="起个威风的群名"></el-input>
      <el-button type="primary" @click="createGroup">创建群聊</el-button>
    </el-dialog>
  </el-container>
</template>
<script>
import GroupList from '@/components/GroupList'
import UserList from '@/components/UserList'
export default {
  name: 'Container',
  components: {
    GroupList: GroupList,
    UserList: UserList,
  },
  data() {
    return {
      msg: '',
      selectFriend: false,
      checkList: [],
      groupLists: [],
      userLists: [
        { id: "xxx", name: "xxx" },
        { id: "yyy", name: "yyy" },
        { id: "zzz", name: "zzz" },
      ],
    }
  },
  methods: {
    createGroup() {
      if (this.groupNameInput != undefined && this.checkList != "") {
        console.log(this.groupNameInput + this.checkList);
        //随机生成一个串，，然后查库比对是否不存在，作为唯一的串赖标记一个群聊的id
        let groupId = Math.random().toString(36).substr(2);
        //从checkList映射回所有的好友数据
        let selectMumber = [];
        for (let i = 0; i < this.checkList.length; i++) {
          for (let j = 0; j < this.userLists.length; j++) {
            if (this.userLists[j].name === this.checkList[i]) {
              selectMumber.push(this.userLists[j]);
            }
          }
        }
        this.groupLists.push({ id: groupId, name: this.groupNameInput, mumber: selectMumber });
        this.selectFriend = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .header {
    height: 60px;
    overflow: hidden;
    background: rgb(238, 246, 246);
    display: flex;
    align-items: center;
    padding:0 10px;
    justify-content: space-between;
    .header-introduction {
      .simple-logo {
        height: 60px;
      }
      .header-title{
        font-weight: 700;
        font-size: 1.6rem;
        color:#18c79c;
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
