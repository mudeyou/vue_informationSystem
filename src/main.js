import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
// 全局css
import './assets/css/global.css'
// 字体图标导入
import './assets/font/iconfont.css'

// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})
Vue.prototype.$http = axios

Vue.component('table-tree', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
