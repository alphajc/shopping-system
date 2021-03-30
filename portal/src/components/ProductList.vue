<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <el-container>
        <el-aside width="200px">
          <div>
            <h1>{{ msg }}</h1>
          </div>
          <el-input v-model="q" placeholder="商品搜索"></el-input>
        </el-aside>
        <el-main>
          <product-item
            v-for="item in product"
            :key="item.id"
            v-bind="item"
            @place-an-order="handelPlaceAnOrder"
          />
        </el-main>
      </el-container>
    </el-col>
  </el-row>
  <teleport to="body">
    <el-dialog
      title="输入下单信息"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-input
        v-model.number="count"
        type="number"
        min="1"
        :max="maxCount"
        @input="handleInputCount"
      ></el-input>
      <el-alert v-if="dialogError" :title="dialogErrorContent" type="error">
      </el-alert>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm" :disabled="dialogError"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </teleport>
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
      product: [],
      dialogVisible: false,
      maxCount: 1,
      id: -1,
      count: 1,
      dialogError: false,
      dialogErrorContent: ""
    };
  },
  created() {
    this.axios.get("http://shopping.local/api/product").then(resp => {
      this.product = this.allProduct = resp.data;
    });
  },
  watch: {
    q(qstring) {
      this.product = qstring
        ? this.allProduct.filter(
            p => p.name.toLowerCase().indexOf(qstring.toLowerCase()) >= 0
          )
        : this.allProduct;
    }
  },
  methods: {
    handelPlaceAnOrder(product) {
      console.log(product);
      if (product.id !== this.id) {
        this.count = 1;
        this.dialogError = false;
      }
      this.id = product.id;
      this.maxCount = product.count;
      this.dialogVisible = true;
    },
    handleClose() {},
    handleInputCount(value) {
      value = parseInt(value);
      if (value > this.maxCount) {
        this.dialogErrorContent = `${value}已经超过了${this.maxCount}！`;
        console.error(this.dialogErrorContent);
        this.dialogError = true;
      } else if (!value) {
        console.error("非法输入！");
        this.dialogErrorContent = "非法输入！";
        this.dialogError = true;
      } else {
        this.count = value;
        this.dialogError = false;
      }
    },
    confirm() {
      this.dialogVisible = false;
      this.count = 1;
      console.log(`${this.id}: ${this.count}`);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-main {
  overflow: visible;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  flex-basis: content;
  align-items: center;
}

.el-container {
  width: 1280;
}
</style>
