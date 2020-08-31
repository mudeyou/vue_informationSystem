<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示框 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        align-center
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          @tab-click="tabClicked"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyGoodsList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyGoodsList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="提交" name="3">
              <el-button type="primary" class="addButton" @click="commit">
                  添加商品
              </el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属分类数组
        goods_cat: [],
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      //商品分类列表
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //商品参数
      manyGoodsList: [],
      //商品属性
      onlyGoodsList: []
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isGoodsId() {
      return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
    }
  },
  methods: {
    //   获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200)
        return this.$message.error('获取商品分类信息失败')
      this.catelist = res.data
    },
    //级联选择器变化触发函数
    handleChange() {
      console.log(this.addForm.goods_cat.length)
    },
    //获取many或者only函数
    async getDataList(str) {
      if (this.addForm.goods_cat.length != 0) {
        if (str == 'many') {
          const { data: res } = await this.$http.get(
            `categories/${this.isGoodsId}/attributes`,
            {
              params: { sel: 'many' }
            }
          )
          if (res.meta.status != 200) {
            return this.$message.error('获取动态参数列表失败')
          }
          this.manyGoodsList = res.data
        }
        if (str == 'only') {
          const { data: res } = await this.$http.get(
            `categories/${this.isGoodsId}/attributes`,
            {
              params: { sel: 'only' }
            }
          )
          if (res.meta.status != 200) {
            return this.$message.error('获取动态参数列表失败')
          }
          this.onlyGoodsList = res.data
        }
      }
    },
    //tab点击触发
    async tabClicked() {
      if (this.activeIndex == 1) {
        this.getDataList('many')
      }
      if (this.activeIndex == 2) {
        this.getDataList('only')
      }
    },
    //提交添加商品
    commit(){
        this.$refs.addFormRef.validate(async valid => {
            if(!valid) return this.$message.error('添加失败，请检查必要的输入信息')
            //loadsh 深度克隆数组
            const form = _.cloneDeep(this.addForm)
            form.goods_cat = form.goods_cat.join(',')
            //处理动态参数
            this.manyGoodsList.forEach(item => {
                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
            })
            //处理静态参数
            this.onlyGoodsList.forEach(item => {
                const newInfo = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
            })
            form.attrs = this.addForm.attrs
            form.goods_number = this.addForm.goods_weight
            const {data:res } = await this.$http.post('goods', form)
            console.log(res)
            if(res.meta.status != 201) return this.$message.error('添加商品失败')
            this.$message.success('添加商品成功')
            this.$router.push('/goods')
        })
    }
  }
}
</script>

<style scope>
.el-steps {
  margin: 20px 0;
}
.addButton{
    margin: 20px 0 0 20px;
}
</style>
