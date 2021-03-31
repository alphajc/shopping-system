<template>
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
  <teleport to="body">
    <el-dialog
      :title="orderForm.name"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="orderForm"
        :rules="rules"
        ref="orderForm"
        label-width="100px"
      >
        <el-form-item label="购买数量" prop="count">
          <el-input
            type="number"
            min="1"
            :max="maxCount"
            v-model="orderForm.count"
          ></el-input>
        </el-form-item>
        <el-form-item label="收件人" prop="recipient">
          <el-input v-model="orderForm.recipient"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="orderForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="orderForm.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">下 单</el-button>
        </span>
      </template>
    </el-dialog>
  </teleport>
</template>

<script>
import ProductItem from "@/components/ProductItem.vue";
import { ElMessage } from "element-plus";

export default {
  name: "product-list",
  props: {
    msg: String
  },
  components: {
    ProductItem
  },
  data() {
    const checkMobile = (rule, value, callback) =>
      value.match(/^1[3456789]\d{9}$/)
        ? callback()
        : callback(new Error("请输入 11 位有效手机号码"));
    const checkCount = (rule, value, callback) =>
      value < 1 || value > this.maxCount
        ? callback(new Error(`count ~ [1, ${this.maxCount}]`))
        : callback();
    return {
      q: "",
      product: [],
      dialogVisible: false,
      maxCount: 1,
      orderForm: {
        id: NaN,
        name: "",
        count: 1,
        address: "",
        mobile: "",
        recipient: ""
      },
      rules: {
        count: [
          { required: true, message: "请输入要购买的数量", trigger: "blur" },
          { validator: checkCount, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入收货地址", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ],
        recipient: [
          { required: true, message: "请填写收件人姓名", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getProduct();
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
      if (product.id !== this.orderForm.id) {
        this.orderForm.count = 1;
      }
      this.orderForm.id = product.id;
      this.orderForm.name = product.name;
      this.maxCount = product.count;
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    confirm() {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          const payload = {
            product: [{ id: this.orderForm.id, count: this.orderForm.count }],
            address: this.orderForm.address,
            mobile: this.orderForm.mobile,
            recipient: this.orderForm.recipient
          };

          this.axios.post("/api/orders", payload).then(resp => {
            console.log(resp);
            console.log("下单成功！");
            ElMessage.success({
              message: "恭喜你，已成功购买了这件商品！",
              type: "success"
            });
            this.getProduct();
          });

          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getProduct() {
      this.axios.get("/api/product").then(resp => {
        this.product = this.allProduct = resp.data;
      });
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
  width: 100%;
}

</style>
