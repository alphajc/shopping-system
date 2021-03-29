<template>
  <el-container>
    <el-aside width="200px">
      <div>
        <h1>{{ msg }}</h1>
      </div>
      <el-input v-model="q" placeholder="商品搜索"></el-input>
    </el-aside>
    <el-main><product-item v-for="item in product" :key="item.id" v-bind="item" /></el-main>
  </el-container>
</template>

<script>
import ProductItem from "@/components/ProductItem.vue";

export default {
  name: "product-list",
  props: {
    msg: String
  },
  components: {
    ProductItem
  },
  data() {
    return {
      q: "",
      product: []
    };
  },
  created() {
    this.axios.get("http://shopping.local/api/warehouse/product").then(resp => {
      this.product = this.allProduct = resp.data;
      console.log(this.product)
    });
  },
  updated() {
    console.log(this.product)
  },
  watch: {
    q(qstring) {
      this.product = qstring
        ? this.allProduct.filter(
            p => p.name.toLowerCase().indexOf(qstring.toLowerCase()) === 0
          )
        : this.allProduct;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-main {
  overflow: visible;
}
</style>
