<template>
  <div>
    <div>
      <el-button @click="goBack">退出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    goBack() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('已退出')
    }
  }
}
</script>

<style lang="less" scoped></style>
