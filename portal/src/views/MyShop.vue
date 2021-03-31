<template>
  <el-affix :offset="15">
    <el-button type="primary" @click="isAdding = true">新品上架</el-button>
    <router-link to="/"><el-button class="return" type="info" plain>返回购物中心</el-button></router-link>
  </el-affix>
  <el-divider></el-divider>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column fixed prop="id" label="编号" width="50"> </el-table-column>
    <el-table-column prop="name" label="名称" width="150"> </el-table-column>
    <el-table-column prop="description" label="描述" width="600">
    </el-table-column>
    <el-table-column prop="price" label="单价" width="120"> </el-table-column>
    <el-table-column prop="count" label="库存量" width="120"> </el-table-column>
    <el-table-column
      prop="created_at"
      :formatter="dateFormat"
      label="上架时间"
      width="120"
    >
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template #default="scope">
        <el-popconfirm
          title="下架后顾客将无法购买，确定需要执行该操作吗？"
          @confirm="OffShelf(scope.row)"
        >
          <template #reference>
            <el-button type="text" size="small">下架</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <teleport to="body">
    <el-dialog
      title="添加商品"
      v-model="isAdding"
      width="45%"
      destroy-on-close
      center
    >
      <el-form
        :mode="productForm"
        ref="productForm"
        label-width="100px"
      >
        <el-form-item label="商品名" prop="name">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="productForm.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="count">
          <el-input
            type="number"
            v-model.number="productForm.count"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input
            v-model.float="productForm.price"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isAdding = false">取 消</el-button>
          <el-button type="primary" @click="onShelf">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </teleport>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  methods: {
    handleClick(row) {
      console.log(row);
    },
    getMyProduct() {
      this.axios.get("/api/admin/product").then(resp => {
        console.log(resp.data);
        this.tableData = resp.data;
      });
    },
    dateFormat(row) {
      const date = new Date(row.created_at);
      return date.toLocaleString();
    },
    OffShelf(row) {
      this.axios.delete(`/api/product/${row.id}`).then(() => {
        ElMessage.success({
          message: `${row.name} 已成功下架`,
          type: "success"
        });
        this.getMyProduct();
      });
    },
    onShelf() {
      this.axios.post(`/api/product`, this.productForm).then(resp => {
        ElMessage.success({
          message: `${resp.data.name} 已上架`,
          type: "success"
        });
        this.getMyProduct();
        this.isAdding = false;
      });
    }
  },
  data() {
    return {
      tableData: [],
      isAdding: false,
      productForm: {
        name: "",
        description: "",
        count: 1,
        price: 999999
      },
      productRules: {
        name: [{ required: true, message: "请输入商品名", trigger: "blur" }],
        description: [
          { required: true, message: "请输入商品描述信息", trigger: "blur" }
        ],
        count: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            message: "需要大于 1 的整数",
            trigger: "blur"
          }
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          {
            validator: (rule, value, cb) =>
              isNaN(value) ? cb(new Error("输入不合规")) : cb(),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getMyProduct();
  }
};
</script>

<style>
body {
  width: 1024px;
  margin: 0 auto;
}

.el-affix {
  text-align: left;
}

.return {
  float: right;
}

</style>
