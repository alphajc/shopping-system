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
        v-for="item in productList"
        :key="item.id"
        v-bind="item"
        @place-an-order="handelPlaceAnOrder"
      />
    </el-main>
  </el-container>
  <teleport to="body">
    <el-dialog
      :title="orderForm.name"
      destroy-on-close
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
    <el-steps :active="active" finish-status="success">
      <el-step title="确认订单"></el-step>
      <el-step title="付款"></el-step>
    </el-steps>
    <el-divider />
    <el-form
      :model="orderForm"
      :rules="rules"
      v-if="active === 0"
      ref="orderForm"
      label-width="100px"
    >
      <el-form-item label="购买数量" prop="count">
        <el-input
          type="number"
          min="1"
          :max="product.count"
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
    <section v-if="active === 1">
      <ul>
        <li>数量：{{orderForm.count}}</li>
        <li>总价：{{totalPrice}}</li>
      </ul>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="steps[active].ok">{{ steps[active].okTitle }}</el-button>
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
      value < 1 || value > this.product.count
        ? callback(new Error(`count ~ [1, ${this.product.count}]`))
        : callback();

    const order = () => {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          const payload = {
            product: [{ id: this.orderForm.id, count: this.orderForm.count }],
            address: this.orderForm.address,
            mobile: this.orderForm.mobile,
            recipient: this.orderForm.recipient
          };

          this.axios.post("/api/orders", payload).then((res) => {
            this.active++;
            console.log(res.data);
            this.order = res.data;
          });

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const pay = () => {
      this.axios.patch(`/api/orders/${this.order.id}/payment`).then(() => {
        ElMessage.success({
          message: "恭喜你，已成功购买了这件商品！",
          type: "success"
        });
        this.getProduct();
        this.dialogVisible = false;
        this.active = 0;
      });
    }
    return {
      q: "",
      productList: [],
      dialogVisible: false,
      active: 0,
      // 订单表单
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
      },
      steps: [
        {okTitle: '下 单', ok: order},
        {okTitle: '去支付', ok: pay}
      ],
      product: null,
      // 生成的订单
      order: null
    };
  },
  created() {
    this.getProduct();
  },
  watch: {
    q(qstring) {
      this.productList = qstring
        ? this.allProduct.filter(
            p => p.name.toLowerCase().indexOf(qstring.toLowerCase()) >= 0
          )
        : this.allProduct;
    }
  },
  computed: {
    totalPrice() {
      return this.orderForm.count * this.product.price;
    }
  },
  methods: {
    handelPlaceAnOrder(product) {
      this.product = product;
      if (product.id !== this.orderForm.id) {
        this.orderForm.count = 1;
      }
      this.orderForm.id = product.id;
      this.orderForm.name = product.name;
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    getProduct() {
      this.axios.get("/api/product").then(resp => {
        this.productList = this.allProduct = resp.data;
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
