import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入login.vue组件
import Login from '../components/Login'
// 导入Home.vue组件
import Home from '../components/Home'
// 导入Welcome.vue组件
import Welcome from '../components/Welcome'
// 导入Users.vue组件
import Users from '../components/users/Users'
import Role from '../components/Role/Roles'
import Rights from '../components/Role/Rights'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import List from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'
Vue.use(VueRouter)

const routes = [
    { path:'/login',component:Login },
    { path:'/',redirect:'/login' },
    {
        path:'/home',
        component:Home,
        redirect:'/welcome',
        // 子路由规则
        children:[
            { path:'/welcome',component:Welcome },
            { path:'/users',component:Users },
            { path:'/roles',component:Role },
            { path:'/rights',component:Rights },
            { path:'/categories',component:Cate },
            { path:'/params',component:Params },
            { path:'/goods',component:List },
            { path:'/goods/add',component:Add },
            { path:'/orders',component:Order }
            
        ]
    }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
    
    // 如果要去login页面，放行
    if(to.path==='/login'){
        return next()
    }
    // 如果是sessionStorage中拥有token的，放行
    if(window.sessionStorage.getItem('token')){
        return next()
    }
    // 不放行
    next('/login')
    
})

export default router
