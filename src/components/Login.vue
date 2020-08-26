<template>
  <div class="container-bg">
    <div class="login-box">
      <!-- 头像 -->
      <div class="login-img">
        <img src="../assets/头像.png" alt="" />
      </div>
      <!-- 表单登录 -->
      <el-form
        class="form"
        label-width="0px"
        :model="form"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item class="form-item" prop="username">
          <el-input
            suffix-icon="iconfont icon-yonghu"
            v-model="form.username"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="form-item" prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            suffix-icon="iconfont icon-mima"
            v-model="form.password"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const result = await this.$http.post('login', this.form)
          const data = result.data
          if (data.meta.status == 200) {
            this.$message.success('登录成功！')
            console.log(data)
            // 将成功的token保存在sessionStorage中
            window.sessionStorage.setItem('token', data.data.token)
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败！')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container-bg {
  width: 100%;
  height: 100%;
  background: #cccccc55;
}
.login-box {
  width: 500px;
  height: 330px;
  background: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .login-img {
    width: 150px;
    height: 150px;
    background: #ffb;
    border: 1px solid #ddd;
    border-radius: 50%;
    box-shadow: 0 0 10px #ccc;
    padding: 8px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .form {
    padding-top: 120px;
    text-align: center;
    .form-item {
      margin: 0px 30px 30px 20px;
    }
  }
}
</style>
