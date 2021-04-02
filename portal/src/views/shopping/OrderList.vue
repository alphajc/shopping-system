<template>

    <el-table
      :data="tableData"
      style="width: 1280px"
      class="main">
      <el-table-column
        prop="id"
        label="订单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="总金额"
        width="180">
      </el-table-column>
      <el-table-column
        prop="recipient"
        label="收件人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="收货地址">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="联系方式"
        width="180">
      </el-table-column>
    </el-table>

</template>

<script>
  export default {
      data() {
        return {
          tableData: []
        }
      },
      created() {
        this.axios.get('/api/orders').then(resp => {
          this.tableData = resp.data
        });
      },
    };
</script>

<style scoped>

.main {
  margin: 10px auto;
}

</style>
