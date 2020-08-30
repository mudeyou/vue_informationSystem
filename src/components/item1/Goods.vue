<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAdd">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <table-tree
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 是否有效 -->
        <template slot="istrue" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted == false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 目录 -->
        <template slot="isroot" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级目录</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 1"
            >二级目录</el-tag
          >
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level === 2"
            >三级目录</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="isedit" slot-scope="scope">
          <!-- <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCatelist"
            >编辑</el-button
          > -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCatelist(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </table-tree>
      <!-- 页脚 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="add"
      width="50%"
      @close="addCateClose"
    >
      <el-form
        :model="addform"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <!-- 分类名称 -->
        <el-form-item prop="cat_name" label="分类名称：">
          <el-input v-model="addform.cat_name"> </el-input>
        </el-form-item>

        <el-form-item label="父级名称：">
          <!-- 块联选择器 -->
          <!-- options指定数据源 -->
          <!-- props指定配置 -->
          <el-cascader
            v-model="selectValue"
            :options="parentCatelist"
            :props="cateProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类
      catelist: [],
      //   父级分类
      parentCatelist: [],
      //   块联选择器配置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选择后保存的值
      selectValue: [],
      //   总数据数量
      total: 0,
      //   定义table_tree列的参数配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'istrue'
        },
        {
          label: '目录',
          type: 'template',
          template: 'isroot'
        },
        {
          label: '操作',
          type: 'template',
          template: 'isedit'
        }
      ],
      //   查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //   对话框的显示与隐藏
      add: false,
      addform: {
        //   将要添加分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类等级
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCatelist()
    this.getParentCatelist()
  },
  methods: {
    async getCatelist() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status == 200) {
        this.catelist = res.data.result
        this.total = res.data.total
      } else {
        this.$message.error('获取商品分类信息失败')
      }
    },
    // 获取父级分类
    async getParentCatelist() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status == 200) {
        this.parentCatelist = res.data
      } else {
        this.$message.error('获取父级商品分类信息失败')
      }
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatelist()
    },
    // 监听pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCatelist()
    },
    // 展示对话框
    showAdd() {
      this.getParentCatelist()
      this.add = true
    },
    // 选择项发生变法触发
    parentCateChange() {
      if (this.selectValue.length > 0) {
        this.addform.cat_pid = this.selectValue[this.selectValue.length - 1]
        this.addform.cat_level = this.selectValue.length
        return
      } else {
        this.addform.cat_pid = 0
        this.addform.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addform)
        if (res.meta.status == 201) {
          return this.$message.success('添加分类成功！')
          this.getCatelist()
        } else {
          return this.$message.error('添加分类失败！')
        }
      })
      this.add = false
    },
    addCateClose() {
      this.addform.cat_level = 0
      this.addform.cat_pid = 0
      this.addform.cat_name = ''
      this.selectValue = []
    },
    deleteCatelist(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const a = await this.$http.delete('categories/' + id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCatelist()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style scoped>
.el-button {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
