<template>
  <div class="view">
    <div class="product">
      <div class="product-iWrap">
        <div class="productImg-wrap">
          <router-link class="productImg" to="#">
            <img
                src="//img.alicdn.com/bao/uploaded/i2/1670985886/O1CN01yCTMS21tLppLl98uq_!!0-item_pic.jpg"
              />
          </router-link>
        </div>

        <p class="productPrice">
          <em :title="price"><b>¥</b>{{ price }}</em>
        </p>

        <p class="productTitle">
          <a
            href="//detail.tmall.com/item.htm?id=581803526073&amp;skuId=4611686600230913977&amp;areaId=440300&amp;user_id=1670985886&amp;cat_id=53636001&amp;is_b=1&amp;rn=cfc46760a6d98d49834abf8391fac01b"
            target="_blank"
            :title="name"
          >
            {{ name }}
          </a>
        </p>

        <p class="productOpt">
        <span><em>加入购物车</em></span>
        <span><em>下单</em></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "product-item",
  props: {
    name: String,
    price: Number,
    count: Number,
    description: String
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
    margin: 0;
    padding: 0;
}

h3 {
  margin: 40px 0 0;
}

div {
  display: block;
}

.product {
  position: relative;
  float: left;
  padding: 0;
  margin: 0 0 20px;
  line-height: 1.5;
  overflow: visible;
  z-index: 1;
}

.product-iWrap {
  position: absolute;
  background-color: #fff;
  margin: 0;
  padding: 4px 4px 0;
  font-size: 0;
  border: 1px solid #f5f5f5;
  border-radius: 3px;
  min-height: 98%;
  width: 210px;
}

.productImg-wrap {
  position: relative;
  display: table;
  table-layout: fixed;
  height: 210px;
  width: 100%;
  padding: 0;
  margin: 0 0 5px;
}

.product-iWrap {
  min-height: 98%;
  width: 210px;
}

.product-iWrap * {
  font-size: 12px;
}

.clearfix:after, .headerCon:after {
    clear: both;
}

.clearfix,
.headerCon {
  zoom: 1;
}

.clearfix:after, .clearfix:before, .headerCon:after, .headerCon:before {
    display: table;
    content: "";
    overflow: hidden;
}

.productAttrs,
.productIcons,
.productPrice,
.productOpt,
.productTitle {
  display: block;
  overflow: hidden;
  margin-bottom: 3px;
}

.productPrice {
  font-family: arial, verdana, sans-serif !important;
  color: #ff0036;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  margin: 0 0 5px;
  letter-spacing: normal;
  overflow: inherit !important;
  white-space: nowrap;
}

.productTitle {
  display: block;
  color: #666;
  height: 14px;
  line-height: 12px;
  margin-bottom: 3px;
  word-break: break-all;
  font-size: 0;
  position: relative;
}

.productImg {
  display: table-cell;
  width: 100%;
  text-align: center;
}

img {
  border: 0;
}

.productImg-wrap a,
.productImg-wrap img {
  max-width: 100%;
  max-height: 210px;
}

.productImg img {
  display: block;
  margin: 0 auto;
}

address,
cite,
dfn,
em,
var {
  font-style: normal;
}

.productPrice * {
  height: 30px;
}

.productPrice em {
  float: left;
  font-family: arial;
  font-weight: 400;
  font-size: 20px;
  color: #ff0036;
}

a {
  outline: 0;
  text-decoration: none;
}
.productTitle * {
  font-size: 12px;
  font-family: \5fae\8f6f\96c5\9ed1;
  line-height: 14px;
}

.productTitle a {
  color: #333;
}

.productOpt {
    position: relative;
    height: 32px;
    border: none;
    border-top: 1px solid #eee;
    margin-bottom: 0;
    color: #999;
}

.productOpt span {
    float: left;
    display: inline-block;
    border-right: 1px solid #eee;
    width: 45%;
    padding: 10px 1px;
    margin-left: 10px;
    line-height: 12px;
    text-align: left;
    white-space: nowrap;
}

.product .productOpt span {
    white-space: nowrap;
}

.view {
    margin-top: 10px;
}

@media (min-width: 600px) and (max-width: 800px) and (orientation: portrait) .view .product {
  width: 220px;
  margin-right: 35px;
}

@media (min-width: 600px) and (max-width: 800px) and (orientation: portrait) .view {
  width: 775px;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
