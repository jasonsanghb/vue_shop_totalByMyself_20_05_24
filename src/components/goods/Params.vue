<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区域-->
        <el-card>
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon
                :closable="false"
            >
            </el-alert>
            <el-row class="chooseCate">
                <el-col>
                    选择商品分类：
                    <el-cascader
                        v-model="selectedCateKeys"
                        :options="cateList"
                        @change="handleSelectedKeyChange"
                        :props="defaultProps"
                        clearable
                    >
                    </el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-row>
                        <el-col>
                            <el-button type="primary" size="mini" :disabled="isManyBtnDisabled" @click="showAddParamsDialog">添加参数</el-button>
                        </el-col>
                    </el-row>
                    <el-table  :data="manyParamsList" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag class="vals" v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="deleteAttrVal(scope.row,index)">{{item}}</el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditParamsDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-row>
                        <el-col>
                            <el-button type="primary" size="mini" :disabled="isOnlyBtnDisabled" @click="showAddParamsDialog">
                                添加属性
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-table  :data="onlyParamsList" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditParamsDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>
<!--        添加参数对话框-->
        <el-dialog
            :title="'添加'+activeTitleName"
            :visible.sync="addParamsDialogVisible"
            width="50%"
            @close="addParamsDialogClosed"
        >
            <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
                <el-form-item :label="activeTitleName" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
        </el-dialog>
<!--        修改动态参数-->
        <el-dialog
            :title="'修改'+activeTitleName"
            :visible.sync="editParamsDialogVisible"
            width="50%"
            @close="editParamsDialogClosed"
        >
            <el-form :model="editParamsForm" :rules="editParamsFormRules" ref="editParamsFormRef" label-width="100px">
                <el-form-item :label="activeTitleName" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="editParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {

                // 请求参数对象
                queryInfo: {

                    type: 3
                },
                // 商品分类列表
                cateList: [],
                // 级联选择器选中值的数组
                selectedCateKeys: [],
                // 级联选择器默认配置项
                defaultProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
                },
                // 当前处于激活状态的标签页名称
                activeName: 'many',
                // 设置添加参数按钮是否禁用
                isManyBtnDisabled: true,
                isOnlyBtnDisabled: true,
                // 动态参数列表
                manyParamsList:[],
                // 静态参数列表
                onlyParamsList:[],
                addParamsDialogVisible:false,
                // 添加参数表单对象
                addParamsForm:{},
                // 添加参数表单验证对象
                addParamsFormRules:{
                    attr_name:[
                        { required: true , message : '请输入参数名称' , trigger:'blur' }
                    ]
                },
                editParamsDialogVisible:false,
                editParamsForm:{},
                editParamsFormRules:{
                    attr_name:[
                        { required: true , message : '请输入参数名称' , trigger:'blur' }
                    ]
                }


            };
        },
        created() {
            this.getCateList();
        },
        methods: {
            // 获取商品分类列表
            async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: this.queryInfo });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类列表失败');
                }
                this.cateList = res.data;

            },
            // 级联选择器选中项发生变化
            handleSelectedKeyChange() {

                this.getParamsList()
            },
            // 获取动态参数或者静态属性
            async getParamsList(){
                if (this.selectedCateKeys.length > 0) {

                    // 发起请求
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数列表失败');
                    }
                    // 对attr_vals属性进行处理
                    res.data.forEach(item=>{
                        //控制文本框的显示与隐藏
                        item.inputVisible = false
                        //文本框中输入的值
                        item.inputValue = ''
                        item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[]
                    })
                    if (this.activeName === 'many') {
                        this.isManyBtnDisabled = false;
                        this.manyParamsList =res.data

                    } else {
                        this.isOnlyBtnDisabled = false;
                        this.onlyParamsList = res.data
                    }


                }
            },

            // 点击按钮，展示添加参数对话框
            showAddParamsDialog(){

                this.addParamsDialogVisible = true
            },
            // 点击按钮，关闭添加参数对话框
            addParamsDialogClosed(){
                console.log(this);
                this.$refs.addParamsFormRef.resetFields()
            },
            // 点击按钮添加参数和属性
            addParams(){
                this.$refs.addParamsFormRef.validate(async valid=>{
                    if(!valid){
                        return
                    }
                    const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{ attr_name:this.addParamsForm.attr_name,attr_sel:this.activeName })
                    if(res.meta.status!==201){
                        return this.$message.error('添加参数失败')
                    }
                    console.log(res);
                    this.$message.success('添加参数成功')
                    this.addParamsDialogVisible = false
                    this.getParamsList()
                })
               
                
            },
            // tabs发生点击事件
            handleTabsClick() {
                this.getParamsList()
            },
            // 动态编辑标签输入框输入完毕
            handleInputConfirm(params){
                if(params.inputValue.trim()){
                    // 把params.attr_vals改为以空格分隔的字符串，以发送请求
                    params.attr_vals.push(params.inputValue.trim())
                    // 向服务器发送请求
                    this.saveAttr(params)
                }
                // 关闭input，设置为tag
                params.inputVisible = false
                params.inputValue = ''
            },
            // 删除对应的attr_vals
            deleteAttrVal(params,index){
                params.attr_vals.splice(index,1)
                // 向服务器发送请求
                this.saveAttr(params)
            },
            // 向服务器发送请求保存attr
            async saveAttr(params){
                // 默认修改参数项成功
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${params.attr_id}`,{ attr_name:params.attr_name,attr_sel:params.attr_sel,attr_vals:params.attr_vals.join(' ')})
                if(res.meta.status!==200){
                    return this.$message.error('修改参数项失败')
                }
                this.$message.success('修改参数项成功')

            },
            // 单击动态编辑标签展示输入框
            showInput(params) {
                params.inputVisible = true;

                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 点击按钮，展示修改参数对话框
            async showEditParamsDialog(params){
                this.editParamsForm = params
                this.editParamsDialogVisible = true
            },
            // 点击按钮，关闭修改参数对话框
            editParamsDialogClosed(){
                this.$refs.editParamsFormRef.resetFields()
            },
            // 点击按钮修改参数
            editParams(){
                this.saveAttr(this.editParamsForm)
                this.editParamsDialogVisible = false
                this.getParamsList()
            },
            // 根据id删除对应的参数
            async removeParamsById(removeAttrId){
                const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
                if(confirmResult!=='confirm'){
                    return this.$message.info('取消删除该参数')
                }
                const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${removeAttrId}`)
                if(res.meta.status!==200){
                    return this.$message.error('删除该参数失败')
                }
                this.$message.success('删除该参数成功')
                this.getParamsList()

            }
        },
        computed:{
            // 获取选中商品分类的id
            cateId(){
                return this.selectedCateKeys[this.selectedCateKeys.length - 1];
            },
            activeTitleName(){
                return this.activeName==='many'?'动态参数':'静态属性'
            }
        }
    };
</script>
<style lang="less" scoped>
    .chooseCate {
        margin: 15px 0;
        line-height: 40px;
    }
    .vals{
        margin: 0 10px;
    }

    .input-new-tag{
        width: 90px;
    }
</style>