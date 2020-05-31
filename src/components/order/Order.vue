<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图区域-->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <el-table :data="orderList" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款"></el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" size="mini" @click="editAddressDialogVisible=true"></el-button>
                        <el-button icon="el-icon-location-outline" type="success" size="mini" @click="showkuaidiDialog(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
<!--        修改地址对话框-->
        <el-dialog
            title="修改地址"
            :visible.sync="editAddressDialogVisible"
            width="50%"
            >
            <el-form
                :model="editAddressForm"
                ref="editAddressFormRef"
                label-width="100px">
                <el-form-item label="省市区/县">
                    <el-cascader
                        v-model="editAddressForm.address1"
                        :options="citydata"
                        :props="defaultProps"
                        ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="editAddressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editAddressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
<!--        物流进度-->
        <el-dialog
            title="物流进度"
            :visible.sync="kuaidiDialogVisible"
            width="50%"
            >
            <el-timeline>
                <el-timeline-item
                    v-for="(item, index) in kuaidiList"
                    :key="index"
                    :timestamp="item.time"
                    >
                    {{item.context}}
                </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">
    <el-button @click="kuaidiDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="kuaidiDialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
    import citydata from './citydata'
    export default {
        data(){
            return{

                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10
                },
                orderList:[],
                total:0,
                editAddressForm:{
                    address1:[],
                    address2:''
                },
                citydata,
                defaultProps:{
                    expandTrigger:'hover',
                    value:'value',
                    label:'label',
                    children:'children'
                },
                editAddressDialogVisible:false,
                kuaidiDialogVisible:false,
                kuaidiList:[]
            }
        },
        created() {
            this.getOrderList()
        },
        methods:{
            async getOrderList(){
                const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
                if(res.meta.status!==200){
                    return this.$message.error('获取订单列表失败')
                }
                this.orderList = res.data.goods
                this.total = res.data.total
            },
            async showkuaidiDialog(order){
                const {data:res} = await this.$http.get('/kuaidi/1106975712662')
                if(res.meta.status!==200){
                    return this.$message.error('获取物流信息失败')
                }
                console.log(res);
                this.kuaidiList = res.data
                this.kuaidiDialogVisible = true
            }
        }
    }
</script>
<style scoped>
    .el-cascader{
        width: 100%;
    }
</style>