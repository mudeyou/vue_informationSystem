import Vue from 'vue'
import { Button, Form, FormItem, Input } from 'element-ui'
// 消息弹框
import { Message } from 'element-ui'
//主页布局
import { Container, Header, Aside, Main } from 'element-ui'
// 主页侧边栏菜单
import { Menu, Submenu, MenuItem } from 'element-ui'
// 主页右侧菜单
import { Breadcrumb,BreadcrumbItem,Card,Row,Col,Tag,Pagination,Dialog,Cascader,Alert,Tabs, TabPane, Table, TableColumn, Steps, Step } from 'element-ui'
//弹窗
import { MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Steps)
Vue.use(Step)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
