<template>
  <el-menu-item :id=groupId @click="groupClick">
    <i class="el-icon-menu"></i>
    <span slot="title">{{groupName}}</span>
  </el-menu-item>
</template>
<script>
export default {
  name: 'GroupList',
  props: ["groupName","groupId","groupMumber"],
  data() {
    return {
      msg: ''
    }
  },
  methods: {
    groupClick() {
      this.$store.state.currentGroupName = this.groupName;
      this.$store.state.currentGroupMumber = this.groupMumber;
      alert(this.groupMumber);
      this.$router.push({ path: '/chat/'+this.groupId });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
