<template>
  <div>
    <img alt="logo" src="../assets/logo.png" object-fit="cover" />
  </div>
  <product-list msg="欢迎来到网上购物中心"/>
</template>

<script>
// @ is an alias to /src
import ProductList from "@/components/ProductList.vue";

export default {
  name: "Home",
  components: {
    ProductList
  }
};
</script>
