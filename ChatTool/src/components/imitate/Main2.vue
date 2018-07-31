<template>
<div class="chat-main" @click="showOnline = false">
  <div class="chat-container">
    <div class="chat-container-left" v-show="loginState">
      <img class="chat-component-avatar avatar" src="../../assets/defaultAvatar.jpg" @click="setAvatar">
      <ButtonList></ButtonList>
    </div>
    <div class="chat-container-right">
      <div class="chat-container-feature" v-show="loginState">
        <div class="chat-container-search">
          <input class="chat-search-text" type="text" placeholder="搜索群组/用户" autocomplete="false">
          <div class="chat-container-search-plus">
            <i class="el-icon-circle-plus"></i>
          </div>
        </div>
        <LinkMan :groupLists = "groupLists" :activeId="activeId"></LinkMan>
      </div>
      <div class="chat-container-chatpanel">
          <transition name="fade" mode="out-in">
            <router-view/>
          </transition>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import ButtonList from "@/components/imitate/ButtonList";
import LinkMan from "@/components/imitate/LinkMan";

export default {
  name: "Main2",
  components: {
    ButtonList: ButtonList,
    LinkMan: LinkMan,
  },
  data() {
    return {
      loginForm: {
        account: "",
        checkPass: ""
      },
      registerForm: {
        account: "",
        checkPass: "",
        email: ""
      },
    };
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
          console.log("xxx");
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
        return [{ id: this.$store.state.userId, name: userName }];
      }
      return null;
    },
    setAvatar() {
      alert(this.$store.state.userName);
    }
  },
  mounted() {
    // this.groupLists.push({
    //   id: "all_public_connect",
    //   name: "所有用户",
    //   mumber: this.queryMumber("all_public_connect")
    // });
    // this.groupLists.push({
    //   id: "room_01",
    //   name: "房间一",
    //   mumber: this.queryMumber("room_01")
    // });
  },
  computed:{
    loginState(){
      return this.$store.state.loginState;
    },
    groupLists(){
      return this.$store.state.groupLists;
    },
    activeId(){
      return this.$store.state.currentGroupId;
    }
  }
};
</script>
<style lang="scss" scoped>

/*头像样式*/
.chat-component-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
}
/*头像样式*/

.chat-main {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/bg.jpg);
}
.chat-container {
  width: 70%;
  position: absolute;
  left: 15%;
  height: 85%;
  top: 7.5%;
  background-color: rgba(255, 255, 255, 0.5);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  display: flex;
  border-radius: 10px;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
  .chat-container-left {
    width: 80px;
    background-color: $theme-color;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    .avatar {
      margin-top: 50px;
      cursor: pointer;
    }
    .chat-container-buttonList {
      position: absolute;
      bottom: 40px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: center;
      align-items: center;
    }
  }
  .chat-container-right {
    display: flex;
    flex: 1;
    .chat-container-feature {
      width: 300px;
      height: 100%;
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      background-color: $theme-color-light;
      .chat-container-search {
        display: -ms-flexbox;
        display: flex;
        height: 70px;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 12px;
        position: relative;
        //文本框样式
        .chat-search-text {
          -ms-flex: 1;
          flex: 1;
          height: 36px;
          border-radius: 18px;
          border: none;
          background-color: hsla(0, 0%, 100%, 0.5);
          padding-left: 35px;
          padding-right: 15px;
          padding-top: 2px;
          font-size: 14px;
          color: #333;
          outline: none;
        }
        //加号按钮
        .chat-container-search-plus {
          width: 40px;
          height: 40px;
          margin-left: 5px;
          .el-icon-circle-plus {
            font-size: 38px;
            line-height: 40px;
            color: hsla(0, 0%, 100%, 0.5);
          }
        }
      }
    }
    .chat-container-chatpanel {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      flex: 1;
      flex-direction: column;
      background-color: hsla(0, 0%, 95%, 0.6);
      overflow: hidden;
      position: relative;
    }
  }
}
</style>

