<template>
  <div class="user-item" :id=userId>
    <el-checkbox :label=userName></el-checkbox>
  </div>
</template>
<script>
export default {
  name: 'UserList',
  props:["userId","userName"],
  data() {
    return {
      msg: '',
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
