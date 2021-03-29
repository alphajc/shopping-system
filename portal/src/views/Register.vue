<template>
  <el-container>
    <el-header><h1>注册</h1></el-header>
    <el-row>
      <el-col :span="8"></el-col>
      <el-col :span="8">
        <el-main>
          <el-form
            :model="registerForm"
            status-icon
            ref="registerForm"
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
              <el-input v-model.number="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
              :rules="{
                required: true,
                validator: validatePass,
                trigger: 'blur'
              }"
            >
              <el-input
                type="password"
                v-model="registerForm.password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="确认密码"
              prop="password_confirmation"
              :rules="{
                required: true,
                validator: validatePass2,
                trigger: 'blur'
              }"
            >
              <el-input
                type="password"
                v-model="registerForm.password_confirmation"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('registerForm')"
                >提交</el-button
              >
              <el-button @click="resetForm('registerForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      registerForm: {
        password: "",
        password_confirmation: "",
        username: ""
      }
    };
  },
  methods: {
    validatePass(rule, value, callback) {
      console.log("validatePass");
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.password_confirmation !== "") {
          this.$refs.registerForm.validateField("password_confirmation");
        }
        callback();
      }
    },
    validatePass2(rule, value, callback) {
      console.log("validatePass2");
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
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
