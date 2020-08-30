<template>
  <!-- 主页 -->
  <el-container class="container">
    <!-- 导航栏 -->
    <el-header>
      <div>
        <h1>超市信息管理系统</h1>
      </div>
      <el-button @click="goBack">退出</el-button>
    </el-header>
    <!-- 主页 -->
    <el-container>
      <!-- 左边区域 -->
      <el-aside width="210px">
        <el-menu
          background-color="#d7f1e6"
          v-for="item in menulist"
          :key="item.id"
          @click="chooseId = item.id"
          :class="{
            color: item.id === chooseId
          }"
          :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu index="'/'+item.path">
            <template slot="title">
              <i class="el-icon-s-unfold"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              @click="chooseId = items.id"
              v-for="items in item.children"
              :key="items.id"
              :class="{
                color: items.id === chooseId
              }"
              :index="'/'+items.path"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ items.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边区域 -->
      <el-main>
          <!-- 重定向 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenu()
  },
  data() {
    return {
      menulist: [],
      chooseId: 0
    }
  },
  methods: {
    goBack() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('已退出')
    },
    async getMenu() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status == 200) {
        // this.menulist = res.data
        this.menulist.push(res.data[2])
        this.menulist.push(res.data[3])
        this.menulist.push(res.data[4])
      } else {
        return this.$message.error(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.el-header {
  background: #bbe6d6;
  height: 70px !important;
  .el-button {
    float: right;
    margin: 15px;
  }
  div {
    float: left;
    height: 70px;
    color: #007c7c;
    font-weight: bold;
    text-align: left;
  }
}
.color {
  color: #1c78c0;
}
.el-aside {
  background: #e4f5ef;
}
.el-main {
  background: #c8ebdf;
  //   #d7f1e6;
}
</style>
