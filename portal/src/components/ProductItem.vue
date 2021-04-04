<template>
  <el-card class="box-card">
    <template #header>
      <section class="card-header">
        <el-button class="button" disabled type="text" @click="$emit('add-to-cart', {id, count, name, price})">加入购物车</el-button>
        <el-button class="button" type="text" @click="$emit('place-an-order', {id, count, name, price})">下单</el-button
        >
      </section>
    </template>
    <el-row>
      <el-col :span="8">
        <el-image
          src="https://www.oracle.com/us/assets/obic-industries-consumer-goods-3889581.svg"
        ></el-image>
      </el-col>
      <el-col :span="16" class="product-attr">
        <section class="product-title">
          <strong>{{ name }}</strong>
        </section>
        <section class="product-desc">
          <small>{{ description }}</small>
        </section>
        <section class="product-price">${{ price }}</section>
        <section class="product-count">库存：{{ count }}</section>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "product-item",
  emits: ["add-to-cart", "place-an-order"],
  props: {
    id: Number,
    name: String,
    price: Number,
    count: Number,
    description: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 25em;
  margin: 1em 0;
}

.product-attr {
  text-align: left;
}

.product-price {
  color: red;
  font-weight: bold;
  font-size: 1.2rem;
}

.product-title {
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.product-desc {
  text-overflow: ellipsis;
  overflow: hidden;
  height: 4rem;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.product-count {
  font-size: 0.8rem;
  color: grey;
}
</style>
