<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!--    卡片视图区域-->
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                :closable="false"
                show-icon
                center
            >
            </el-alert>
            <!--            步骤条区域-->
            <el-steps align-center space="200px" :active="+activeIndexStr" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品照片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!--            标签页区域-->
            <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-position="top">
                <el-tabs tab-position="left" :before-leave="beforeLeave" v-model="activeIndexStr"
                         @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                                v-model="addGoodsForm.goods_cat"
                                :options="cateList"
                                :props="defaultProps"
                                clearable
                            ></el-cascader>
                        </el-form-item>

                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item class="attrRow" :label="item1.attr_name" v-for="item1 in manyParamsList" :key="item1.attr_id">

                            <el-checkbox-group v-model="item1.attr_vals">
                                <el-checkbox :label="item2" v-for="(item2,index) in item1.attr_vals" :key="index" border></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyParamsList" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="uploadHeaders"
                            :on-success="uploadSuccess"
                            :before-upload="beforeUpload"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor class="quillEditor"
                            v-model="addGoodsForm.goods_introduce"
                        />
                        <el-button type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>

            </el-form>

        </el-card>
<!--        图片预览对话框-->
        <el-dialog
            title="图片预览"
            :visible.sync="picPreviewDialogVisible"
            width="50%"
        >
            <img :src="uploadSuccessUrl" alt="" class="prePic">
            
        </el-dialog>
    </div>

</template>
<script>
    import _ from 'lodash'
    export default {

        data() {
            return {
                // 当前激活的步骤
                activeIndexStr: '0',
                addGoodsForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat:[],
                    // 富文本编辑器绑定的内容
                    goods_introduce:'',
                    // 上传的图片临时路径
                    pics:[],
                    attrs:[]


                },
                addGoodsFormRules: {

                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ]
                },
                // 商品分类列表
                cateList: [],

                // 级联选择器默认配置
                defaultProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                manyParamsList: [],
                onlyParamsList:[],
                // 上传图片请求头信息对象
                uploadHeaders:{},
                // 控制图片预览对话框的显示与隐藏
                picPreviewDialogVisible:false,
                // 图片上传成功后，后台发送的数据中的url
                uploadSuccessUrl:''

            };

        },
        created() {
            this.getCateList();
        },
        methods: {
            async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: { type: 3 } });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败');
                }
                this.cateList = res.data;

            },

            // tab页发生切换之前触发的函数
            beforeLeave(activeName, oldActiveName) {
                // 证明是想要从基本信息tab切换到别的tab
                if (oldActiveName === '0') {
                    // 证明级联选择器没有选中
                    if (!this.addGoodsForm.goods_cat.length) {
                        this.$message.error('请先选择商品分类');
                        return false;
                    }
                }

            },
            // 点击切换tab页
            async handleClick() {
                console.log(this.activeIndexStr);
                if (this.activeIndexStr === '1') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } });
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取商品参数失败');
                    }
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    });
                    this.manyParamsList = res.data;
                    console.log(res.data);
                } else if (this.activeIndexStr === '2') {
                    const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } });
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取商品属性失败');
                    }
                    this.onlyParamsList = res.data

                }
            },

            // 图片上传状态改变时
            uploadSuccess(response){

                const picObj = {}
                picObj.pic = response.data.tmp_path
                this.addGoodsForm.pics.push(picObj)
                this.uploadSuccessUrl = response.data.url
                console.log(this.addGoodsForm.pics);

            },
            // 上传图片之前在请求头中添加信息
            beforeUpload(){
                this.uploadHeaders.Authorization = window.sessionStorage.getItem('token')
            },
            // 图片预览方法
            handlePreview(){

                this.picPreviewDialogVisible = true
            },
            // 删除已上传图片
            handleRemove(file){
                const index = this.addGoodsForm.pics.findIndex(item=>{
                    return item.pic === file.response.data.tmp_path
                })
                this.addGoodsForm.pics.splice(index,1)
                console.log(this.addGoodsForm.pics);
            },
            // 点击按钮 添加商品
            addGoods(){

                // console.log(this.addGoodsForm);
                // goods_cat


                this.$refs.addGoodsFormRef.validate(async valid=>{
                    if(!valid){
                        return this.$message.error('请填写必要的字段')
                    }
                    // const newAddGoodsForm = Object.assign({},this.addGoodsForm,{})
                    const newAddGoodsForm = _.cloneDeep(this.addGoodsForm)
                    newAddGoodsForm.goods_cat = newAddGoodsForm.goods_cat.join(',')
                    console.log(newAddGoodsForm);
                    const {data:res} = await this.$http.post('goods',newAddGoodsForm)
                    console.log(res);
                    if(res.meta.status!==201){
                        return this.$message.error('添加商品失败')
                    }
                    this.$message.success('添加商品成功')
                    this.$router.push('/goods')
                })
            }

        },
        computed: {
            cateId() {
                if (this.addGoodsForm.goods_cat) {
                    return this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1];
                }
                return '';
            }
        }
    };
</script>
<style lang="less" scoped>
    .el-steps {
        margin: 20px 0;
    }

    .attrRow {
        margin: 20px 0;
    }

    .attrName {
        margin-bottom: 20px;
    }

    .el-checkbox {
        margin: 0 20px 0 0 !important;
    }
    .prePic{
        width: 100%;
    }
    .quillEditor{
        margin-bottom: 20px;
    }


</style>
