<template>
  <div>
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
      <el-menu-item index="/order-list">订单管理</el-menu-item>
    </el-menu>
    <el-button class="seller" type="warning" plain><i class="el-icon-upload el-icon--right"/>卖家中心</el-button>
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
    console.log(this.$route);
  },
};
</script>

<style scope>
header {
  width: 1440px;
  margin: 0 auto;
}

header .seller {
  float: right;
  top: -3.3rem;
  position: relative;
  margin: 0 10px;
}
</style>
