<template>
    <el-container class="home-container">
        <el-header>
            <div class="header-left">
                <a href="">
                    <img src="../assets/heima.png" alt="黑马">
                    <span>电商后台管理系统</span>
                </a>
            </div>
            <div class="header-right">
                <el-button type="info" @click="quit">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="collapse" @click="toggleCollapse">|||</div>
                <el-menu
                    router
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    class="el-menu-vertical-demo"
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    :default-active="activePath"
                >

                    <el-submenu  v-for="item1 in asideList" :key="item1.id" :index="item1.path" >
                        <template slot="title">
                            <i :class="iconsObj[item1.id]"></i>
                            <span>{{item1.authName}}</span>
                        </template>
                        <el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="'/'+item2.path" @click="activePathMethod('/'+item2.path)">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{item2.authName}}</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {

        data() {
            return {

                // 左侧菜单数据
                asideList:[],
                iconsObj:{
                    125:"iconfont icon-user",
                    103:"iconfont icon-tijikongjian",
                    101:"iconfont icon-3702mima",
                    102:"iconfont icon-danju",
                    145:"iconfont icon-baobiao"
                },
                // 伸缩条是否伸缩，默认为false
                isCollapse:false,
                // 当前默认激活的index
                activePath:''
            };
        },
        // 获取左侧菜单数据
        async created() {
            const { data:res } = await this.$http.get('menus')
            console.log(res.data);
            this.asideList = res.data
            this.activePath = window.sessionStorage.getItem('activePath')

        },
        methods: {
            // 点击退出按钮，退出登录
            quit() {
                // 清除sessionStorage中的数据
                window.sessionStorage.clear();
                // 手动访问/login路径
                this.$router.push('/login');
            },
            // 点击伸缩条，切换伸缩状态
            toggleCollapse(){

                this.isCollapse = !this.isCollapse
            },
            // 点击二级菜单，把当前的二级菜单激活
            activePathMethod(path){
                window.sessionStorage.setItem('activePath',path)
                this.activePath = path
            }
        }


    };
</script>
<style lang="less" scoped>

    .home-container{
        height: 100%;
    }
    .el-header {
        height: 60px;
        padding: 0 20px 0 0;
        background-color: #373D41;
    }

    .el-header::after {
        content: "";
        display: table;
        clear: both;

    }

    .el-header > .header-left {
        float: left;
    }

    .el-header > .header-right {
        float: right;
    }

    .el-button {
        margin-top: 10px;
    }

    .header-left a {
        display: block;
    }

    .header-left a img {
        float: left;
        height: 60px;

    }
    .header-left a span{
        float:left;
        height: 60px;
        line-height: 60px;
        color:#fff;
        font-size: 20px;
        margin-left: 10px;
    }
    .el-aside{
        height: 100%;
        background-color:#333744;
    }


    .collapse{
        height: 25px;
        line-height: 25px;
        background-color: #4A5064;
        color:#fff;
        text-align: center;
        font-size: 10px;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .el-menu{
        border-right-width: 0;
    }
    .el-submenu i{
        margin-right: 10px;
    }
    .el-main{
        background-color: #EAEDF1;
    }


</style>