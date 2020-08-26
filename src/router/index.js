import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    component: () => import('../components/Home')
  }
]

const router = new VueRouter({
  routes
})

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path == "/login") return next();
  // console.log(from);
  const sToken = window.sessionStorage.getItem('token');
  if(sToken){
    next()
  }else{
    return next('/login')
  }
})

export default router
