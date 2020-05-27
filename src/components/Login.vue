<template>
    <div class="container">
        <div class="login-wrap">
            <div class="login-icon">
                <img src="../assets/logo.png" alt="logo">
            </div>
            <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="formWrap">
                <el-form-item class="form-item" prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item class="form-item" prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="form-item last-item">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                loginFormRules:{
                    username:[
                        { required: true , message : '请输入用户名称' , trigger:'blur' },
                        { min:3 , max:15, message : '请输入3-15个字符之间的用户名称' , trigger:'blur' }

                    ],
                    password:[
                        { required: true , message : '请输入用户密码' , trigger:'blur' },
                        { min:6 , max:15, message : '请输入6-15个字符之间的密码' , trigger:'blur' }
                    ]
                }
            };
        },
        methods: {
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields()
            },
            login(){
                this.$refs.loginFormRef.validate(async valid=>{
                    if(!valid){
                        return
                    }
                    const {data:res} = await this.$http.post('login',this.loginForm)
                    if(res.meta.status!==200){

                        return this.$message.error('登录失败')
                    }

                    // 把token存储到sessionStorage中
                    window.sessionStorage.setItem('token',res.data.token)
                    this.$router.push('/home')
                    this.$message.success('登录成功')
                })
            }
        }
    };
</script>
<style lang="less" scoped>

    .container {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #2B4B6B;
    }
    .login-wrap{
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        width: 450px;
        height: 300px;
        background-color: #fff;
    }
    .login-icon{
        position: absolute;
        top:0;
        left:50%;
        transform: translate(-50%,-50%);
        width: 130px;
        height: 130px;
        padding: 10px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 10px #ddd;

        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }

    }
    .formWrap{
        margin-top: 115px;
    }
    .form-item{
        position: relative;
        margin: 20px;
    }
    .last-item{
        position: absolute;
        bottom: 0;
        right:0;
    }

</style>