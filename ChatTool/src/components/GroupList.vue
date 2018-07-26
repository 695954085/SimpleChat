<template>
  <el-menu-item :id=groupId @click="groupClick">
    <i class="el-icon-menu"></i>
    <span slot="title">{{groupName}}</span>
  </el-menu-item>
</template>
<script>
export default {
  name: "GroupList",
  props: ["groupName", "groupId", "groupMumber"],
  data() {
    return {
      msg: ""
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function(val) {
      console.log(val);
    },
    error: function(val){
      console.log(val);
    }
  },
  methods: {
    groupClick() {
      this.$store.state.currentGroupName = this.groupName;
      this.$store.state.currentGroupMumber = this.groupMumber;
      this.$store.state.currentGroupId = this.groupId;
      alert(this.$store.state.currentGroupId);
      this.$socket.emit("createRoom",this.groupId, data =>{
        console.log('createRoom')
      });
      this.$router.push({ path: "/chat/" + this.groupId });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
