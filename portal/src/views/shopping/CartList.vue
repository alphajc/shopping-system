<template>
  <el-table
    ref="cartTable"
    :data="carts"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="name"
      label="商品"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="count"
      label="数量"
      width="120">
    </el-table-column>
    <el-table-column
      prop="price"
      label="单价（元）"
      width="120">
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-popconfirm
      confirmButtonText='确定'
      cancelButtonText='不了'
      icon="el-icon-info"
      iconColor="red"
      @confirm="deleteProduct"
      title="确定要从购物车中移除么？"
    >
      <template #reference>
        <el-button type="danger" :disabled="!this.selectIds">删除</el-button>
      </template>
    </el-popconfirm>
    <el-button @click="settlement" :disabled="!this.selectIds" type="primary">结算</el-button>
  </div>
  <teleport to="body">
  <el-dialog
      :title="orderForm.name"
      destroy-on-close
      v-model="dialogVisible"
      width="30%"
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
        <li>总价：{{totalPrice}} 元</li>
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
import { ElMessage } from 'element-plus';

export default {
  data() {
    const checkMobile = (rule, value, callback) =>
      value.match(/^1[3456789]\d{9}$/)
        ? callback()
        : callback(new Error("请输入 11 位有效手机号码"));
    const order = () => {
      this.$refs.orderForm.validate(valid => {
        if (valid) {
          const payload = {
            carts: this.selectIds,
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
          console.error("error submit!!");
          return false;
        }
      });
    };
    const pay = () => {
      this.axios.patch(`/api/orders/${this.order.id}/payment`).then(() => {
        ElMessage.success({
          message: "恭喜你，已成功购买了这些商品！",
          type: "success"
        });
        this.getCarts();
        this.dialogVisible = false;
        this.selectIds = [];
        this.active = 0;
      });
    };
    return {
      carts: [],
      selectIds: '',
      rules: {
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
      orderForm: {},
      dialogVisible: false,
      order: {},
      active: 0,
      totalPrice: 0
    };
  },
  created() {
    this.getCarts();
  },
  methods: {
    // 从购物车删除
    deleteProduct() {
      this.axios.delete(`/api/carts?ids=${this.ids}`).then(resp => {
        console.log(resp.data);
        ElMessage('已从购物车移除');
        this.selectIds = [];
        this.getCarts();
      });
    },
    // 结算
    settlement() {
      console.log(this.ids);
      this.dialogVisible = true;
    },
    handleSelectionChange(carts) {
      let totalPrice = 0;
      this.selectIds = carts.map(cart => {
        totalPrice += cart.count * cart.price;
        return cart.id;
      });
      this.totalPrice = totalPrice;
    },
    getCarts() {
      this.axios.get("/api/carts").then(resp => {
        this.carts = resp.data;
      });
    }
  },
  computed: {
    ids() {
      return this.selectIds.join(',')
    }
  }
};
</script>

<style>
</style>
