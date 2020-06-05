import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
// import Home from '../components/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
// import Welcome from '../components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')


// import Users from '../components/user/Users'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/users/Users')
// import Rights from '../components/power/Rights'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Role/Rights')
// import Roles from '../components/power/Roles'
const Role = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Role/Roles')


// import Cate from '../components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate')
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params')


// import GoodsList from '../components/goods/List'
const List = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/List')
// import Add from '../components/goods/Add'
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add')


// import Order from '../components/order/Order'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order')
// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report')

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
            { path:'/orders',component:Order },
            { path:'/reports',component:Report }
            
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
