<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只可以为最小等级分类添加参数" type="warning">
      </el-alert>

      <!-- 选择商品分类 -->
      <el-row class="chooseCase">
        <el-col>
          <span class="font">请选择商品分类：</span>
          <!-- 级联选择器 -->
          <!-- options指定数据源 -->
          <!-- props指定配置 -->
          <el-cascader
            v-model="selectValue"
            :options="catelist"
            :props="cateProps"
            @change="CateChange"
            clearable
          ></el-cascader>
          <!-- 标签页 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 动态参数按钮 -->
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addDialogVisible = true"
                >添加参数</el-button
              >
              <!-- 动态参数表格 -->
              <el-table :data="manyTableData" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  label="参数名称"
                  prop="attr_name"
                ></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="onlyEdit(scope.row.attr_id)"
                      >修改</el-button
                    >
                    <el-button size="mini" type="danger" icon="el-icon-delete"  @click="removeData(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 静态参数按钮 -->
            <el-tab-pane label="静态参数" name="only">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addDialogVisible = true"
                >添加参数</el-button
              >
              <el-table :data="onlyTableData" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  label="参数名称"
                  prop="attr_name"
                ></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      @click="onlyEdit(scope.row.attr_id)"
                      >修改</el-button
                    >
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeData(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFormClosed"
    >
      <!-- 添加对话框 -->
      <el-form
        ref="formRef"
        :model="form"
        label-width="80px"
        :rules="formRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormTrue">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="editformRules"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      selectValue: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      form: {
        attr_name: ''
      },
      //修改的表单数据对象
      editForm: {
        attr_name: ''
      },
      formRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          }
        ]
      },
      //修改的表单规则
      editformRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getCatelist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品参数失败')
      }

      this.catelist = res.data
    },
    CateChange() {

      this.getAllCatelist()
    },
    handleClick() {
      this.getAllCatelist()
    },
    async getAllCatelist() {
      if(this.selectValue.length <= 0){
        this.selectValue = [],
        this.manyTableData = []
        this.onlyTableData = []
        return
      }else
      {
        const { data: res } = await this.$http.get(
          `categories/${this.isId}/attributes`,
          {
            params: { sel: this.activeName }
          }
        )
        if (res.meta.status == 200) {
        } else {
          return this.$message.error('获取商品参数失败')
        }
        if (this.activeName == 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    //监听关闭对话框事件
    addFormClosed() {
      this.form.attr_name = ''
    },
    //重置修改表单
    editFormClosed() {
      this.editForm.attr_name = ''
    },
    addFormTrue() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.isId}/attributes`,
          {
            attr_name: this.form.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          this.$message.error('添加信息失败')
        } else {
          this.$message.success('添加信息成功')
        }
        this.addDialogVisible = false
        this.getAllCatelist()
      })
    },
    //点击确定按钮修改参数
    editFormTrue() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.isId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 200) {
          if(res.data.length>0){
            return this.$message.error('修改参数失败')
          }
        }
        this.$message.success('修改参数成功')
        this.getAllCatelist()
        this.editDialogVisible = false
      })
    },
    //修改触发事件
    async onlyEdit(id) {
      // 查询当前参数信息
      const { data: res } = await this.$http.get(
        `categories/${this.isId}/attributes/${id}`,
        {
          parmas: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('获取信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    removeData(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const a = await this.$http.delete(`categories/${this.isId}/attributes/${id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getAllCatelist()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  computed: {
    isBtnDisabled() {
      return this.selectValue.length <= 0 ? true : false
      // return false
    },
    isId() {
      if (this.selectValue.length == 3) {
        return this.selectValue[this.selectValue.length - 1]
      }
      return this.selectValue[this.selectValue.length - 1]
    },
    titleText() {
      if (this.activeName == 'many') return '动态参数'
      else return '静态参数'
    }
  },
  created() {
    this.getCatelist()
  }
}
</script>

<style lang="less" scoped>
.chooseCase {
  margin: 20px 0 20px 20px;
  .font {
    font-size: 14px;
  }
  .el-cascader {
    width: 300px;
    margin-bottom: 15px;
  }
}
.el-button {
  margin-bottom: 20px;
}
</style>
