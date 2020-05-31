<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图区域-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="searchInfo">
                        <el-button slot="append" icon="el-icon-search" @click="searchInfo"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table stripe border :data="goodsList">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="150px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            分页区域-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 15, 20, 25]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>
<script>
    export default {
        data(){
            return {

                // 查询参数对象
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                },
                // 商品列表对象
                goodsList:{},
                total:0
            }
        },
        created() {
            this.getGoodsList()
        },
        methods:{

            async getGoodsList(){

                const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
                if(res.meta.status!==200){
                    return this.$message.error('获取商品列表失败')
                }
                this.total = res.data.total
                this.goodsList = res.data.goods

            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getGoodsList()

            },
            handleCurrentChange(newPage){

                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            },
            // 点击按钮 查询对应信息
            searchInfo(){
                this.getGoodsList()
            },
            // 点击按钮 跳转到添加商品页面
            addGoods(){
                this.$router.push('/goods/add')
            }

        }
    }
</script>
<style lang="less" scoped></style>