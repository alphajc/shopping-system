<template>
  <div class="banner">
    <img alt="logo" src="../assets/logo.png" object-fit="cover" />
  </div>
  <header>
    <el-menu
      :default-active="activeIndex"
      router
      mode="horizontal"
    >
      <el-menu-item index="/">购物大厅</el-menu-item>
      <el-menu-item index="/carts" disabled>购物车</el-menu-item>
      <el-menu-item index="/order-list">我的订单</el-menu-item>
    </el-menu>
    <section class="seller">
      <router-link to="/myshop"><i class="el-icon-help el-icon--right"/>卖家中心</router-link>
      <el-divider direction="vertical"></el-divider>
      <el-link @click="logOut" type="warning" plain><i class="el-icon-s-promotion el-icon--left"/>退出登录</el-link>
    </section>
      </header>
  <router-view />
</template>

<script>

export default {
  name: "Home",
  data() {
    return {
      activeIndex: '/'
    }
  },
  created() {
    this.activeIndex = this.$route.fullPath;
  },
  methods: {
    logOut() {
      console.log('logout')
      this.axios.post('/api/logout').then(() => {
        this.$router.push('/login');
      });
    }
  }
};
</script>

<style scope>

header .seller {
  float: right;
  top: -2.8rem;
  font-size: 14px;
  position: relative;
  margin: 0 10px;
}

body {
  width: 1280px;
  margin: 0 auto;
}

.banner img {
  max-width: 100%
}
</style>
