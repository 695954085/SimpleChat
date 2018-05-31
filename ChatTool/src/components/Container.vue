<template>
  <el-container class="container">
    <el-header class="header grid-content">
      <el-row>
        <el-col :offset="18" :span="2">
          <el-button type="primary">创建群聊</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="main-container">
      <el-aside width="200px" class="left-side">
        <el-menu class="group-list">
          <GroupList :groupId=groupItem.id :groupName=groupItem.name :key="groupItem.id" v-for="groupItem in groupLists"></GroupList>
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
  </el-container>
</template>
<script>
import GroupList from '@/components/GroupList'
export default {
  name: 'Container',
  components: {
    GroupList: GroupList
  },
  data() {
    return {
      msg: '',
      groupLists:[
        {id:"xxx",name:"xxx"},
        {id:"yyy",name:"yyy"},
        {id:"zzz",name:"zzz"},
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .header {
    height: 60px;
    background: #D3DCE6;
    ;
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
      .content-wrapper{
        height:100%;
      }
    }
    .group-list {
      height: 100%;
    }
  }
}
</style>
