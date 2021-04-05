<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item title="未付款" name="not-pay">
      <el-table :data="notPayOrders" class="main">
        <el-table-column prop="id" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="price" label="总金额（元）" width="180">
        </el-table-column>
        <el-table-column prop="recipient" label="收件人" width="180">
        </el-table-column>
        <el-table-column prop="address" label="收货地址"> </el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="180">
        </el-table-column>
        <el-table-column width="80px">
          <template #default="scope">
            <el-button type="text" @click="pay(scope.row.id)">去支付</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item title="已付款" name="paid">
      <el-table :data="paidOrders" class="main">
        <el-table-column prop="id" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="price" label="总金额（元）" width="180">
        </el-table-column>
        <el-table-column prop="recipient" label="收件人" width="180">
        </el-table-column>
        <el-table-column prop="address" label="收货地址"> </el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="180">
        </el-table-column>
        <el-table-column width="80px">
          <template #default="scope">
            <el-button type="text" @click="checkDelivery(scope.row.id)">查看物流</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-collapse-item>
  </el-collapse>

  <teleport to="body">
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <el-timeline>
        <el-timeline-item
          v-for="(delivery, index) in deliveries"
          :key="index"
          :timestamp="formatDate(delivery.time)">
          {{delivery.step}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </teleport>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      orders: [],
      dialogVisible: false,
      activeName: "not-pay",
      deliveries: []
    };
  },
  created() {
    this.axios.get("/api/orders").then(resp => {
      this.orders = resp.data;
    });
  },
  methods: {
    checkDelivery(id) {
      this.axios.get(`/api/orders/${id}/deliveries`).then(res => {
        this.deliveries = JSON.parse(res.data[0].detail);
        this.dialogVisible = true;
        console.log(res.data);
      });
    },
    pay(id) {
      this.axios.patch(`/api/orders/${id}/payment`).then(() => {
        ElMessage.success({
          message: '支付成功！',
          type: 'success'
        });
        const idx = this.orders.findIndex(order => order.id === id);
        this.orders[idx].pay_stat = true;
      });
    },
    formatDate(datetime) {
      return new Date(datetime).toLocaleString('zh-CN');
    }
  },
  computed: {
    paidOrders() {
      return this.orders.filter((order) => order.pay_stat);
    },
    notPayOrders() {
      return this.orders.filter((order) => !order.pay_stat);
    }
  }
};
</script>

<style>
.main {
  margin: 10px auto;
}

.el-collapse-item__header {
  width: 100%
}
</style>
