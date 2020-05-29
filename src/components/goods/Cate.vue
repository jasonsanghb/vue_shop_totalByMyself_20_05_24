<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片视图区域-->
        <el-card>
            <el-row>
                <el-col :span="4">
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
<!--            树形表格区域-->
            <tree-grid
                class="treeGrid"
                :data="cateList"
                :columns="columnsProp"
                stripe border
                show-index
                index-text="#"
                :selection-type="false"
                :expand-type="false"
                :show-row-hover="false"
            >

                <template slot="isUseful" scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <template slot="rank" scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag v-else>三级</el-tag>
                </template>
                <template slot="operation" scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>

            </tree-grid>
<!--            分页区域-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
<!--        添加分类对话框-->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed"
        >
            <el-form
                :model="addCateForm"
                :rules="addCateFormRules"
                ref="addCateFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="defaultProp"
                        clearable
                        @change="selectedKeyChanged"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>

    </div>
</template>
<script>
    export default {

        data(){
            return {

                // 查询对象
                queryInfo:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                // 商品分类列表总条数
                total:0,
                // 商品分类列表
                cateList:[],
                // 树形表格每列的配置对象数组
                columnsProp:[
                    { label: '分类名称', prop: 'cat_name' },
                    { label: '是否有效', type: 'template', template: 'isUseful' },
                    { label: '排序' ,type: 'template', template: 'rank'},
                    { label: '操作', type: 'template', template: 'operation' }
                ],
                addCateDialogVisible:false,
                addCateForm:{
                    cat_pid:'',
                    cat_name:'',
                    cat_level:''
                },
                addCateFormRules:{
                    cat_name:[
                        { required: true , message : '请输入分类名称' , trigger:'blur' }
                    ]
                },
                // 父级分类列表，级联选择器数据
                parentCateList:[],
                // 级联选择器配置对象
                defaultProp:{
                    label:'cat_name',
                    value:'cat_id',
                    children:'children',
                    checkStrictly:true,
                    expandTrigger: 'hover'
                },
                // 级联选择器选中项绑定的值
                selectedKeys:[]
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            // 获取商品分类列表
            async getCateList(){
                const { data:res } = await this.$http.get('categories',{ params:this.queryInfo })
                if(res.meta.status!==200){
                    return this.$message.error('获取商品分类列表失败')
                }
                this.cateList = res.data.result
                this.total = res.data.total
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            async showAddCateDialog(){
                // 获取级联选择器数据
                const { data:res } = await this.$http.get('categories',{ params: { type:2 }})
                if(res.meta.status!==200){
                    return this.$message.error('获取级联选择器数据失败')
                }

                this.parentCateList = res.data
                console.log(res.data);
                this.addCateDialogVisible = true
            },
            // 添加分类对话框关闭事件
            addCateDialogClosed(){
                this.$refs.addCateFormRef.resetFields()
                this.addCateForm.cat_pid = ''
                this.addCateForm.cat_level = ''
                this.selectedKeys = []
            },
            // 级联选择器选中项发生改变
            selectedKeyChanged(){

                if(this.selectedKeys.length>0){
                    // 如果this.selectedKeys有选中
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]+''
                }else{
                    // this.selectedKeys没有选中
                    this.addCateForm.cat_pid = '0'
                }

                this.addCateForm.cat_level = this.selectedKeys.length


            },
            // 发送添加分类请求
            addCate(){
                this.$refs.addCateFormRef.validate(async valid=>{
                    if(!valid){
                        return
                    }

                    const {data:res} = await this.$http.post('categories',this.addCateForm)
                    console.log(res);
                    if(res.meta.status!==201){
                        return this.$message.error('添加分类失败')
                    }
                    this.$message.success('添加分类成功')
                    this.addCateDialogVisible = false
                    this.getCateList()

                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .treeGrid{
        margin: 20px 0;
    }
    .el-cascader{
        width: 100%;
    }

</style>