import VueRouter from 'vue-router'
import Vue from 'vue'
const Home = () =>import('views/home/Home')
const Category = () =>import('views/category/Category')
const Cart = () =>import('views/cart/Cart')
const Profile = () =>import('views/profile/Profile')

//安装插件
Vue.use(VueRouter)
const routes=[
    {
        path:'',
        redirect:'/home'
    },
    {
        path:'/home',
        component: Home
    },
    {
        path:'/category',
        component:Category
    },
    {
        path:'/cart',
        component:Cart
    },
    {
        path:'/profile',
        component:Profile
    }
]
//创建路由对象
const router=new VueRouter({
    routes,
    mode: 'history'
})
export default router