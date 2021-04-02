<template>
  <el-container>
    <el-header><h1>登录</h1></el-header>
    <el-row>
      <el-col :span="8"></el-col>
      <el-col :span="8">
        <el-main>
          <el-form
            :model="loginForm"
            status-icon
            ref="loginForm"
            label-width="100px"
            label-position="left"
          >
            <el-form-item
              label="用户名"
              prop="username"
              :rules="{
                required: true,
                message: '用户名不能为空',
                trigger: 'blur'
              }"
            >
              <el-input v-model.number="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
              :rules="{
                required: true,
                message: '请输入密码',
                trigger: 'blur'
              }"
            >
              <el-input
                type="password"
                v-model="loginForm.password"
                @keyup.enter="submitForm('loginForm')"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')"
                >登录</el-button
              >
              <el-button @click="resetForm('loginForm')">重置</el-button>
              <el-row>还没有账号？快来<router-link to="/register">注册</router-link
                >一个吧!</el-row
              >
            </el-form-item>
          </el-form>
        </el-main>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </el-container>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      loginForm: {
        password: "",
        username: ""
      }
    };
  },
  methods: {
    login() {
      this.$store.dispatch('AUTH_REQUEST', this.loginForm).then(() => {
        this.$router.push("/");
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('AUTH_REQUEST', this.loginForm)
          .then(() => {
            this.$router.push("/");
          }).catch(() => {
            ElMessage.error('认证失败，请检查你的账号密码！');
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style></style>
