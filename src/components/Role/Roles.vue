<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片视图区域-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" stripe border>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id"
                                :class="['hasBorderBottom','vcenter',index1===0?'hasBorderTop':'']">
                            <el-col :span="4">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-row v-for="(item2,index2) in item1.children" :key="item2.id"
                                        :class="['vcenter',index2===0?'':'hasBorderTop']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id"
                                                @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                                   @click="showDistributeRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
        <!--        分配权限对话框-->
        <el-dialog
            title="分配权限"
            :visible.sync="distributeRightDialogVisible"
            width="50%"
            @close="distributeRightDialogClosed"
        >
            <el-tree
                :data="rightsList"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="checkedKeys"
                :props="defaultProps"
                ref="treeRef"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="distributeRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="distributeRight">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {

        data() {
            return {

                // 角色信息列表
                rolesList: [],
                // 分配权限对话框是否显示
                distributeRightDialogVisible: false,
                // 权限列表
                rightsList: [],
                // 树形控件默认配置
                defaultProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 树形控件默认选中的id数组
                checkedKeys: [],
                // 当前需要分配权限的角色
                currentRole: {}

            };
        },
        created() {
            this.getRolesList();
        },
        methods: {
            // 获取角色信息列表
            async getRolesList() {
                const { data: res } = await this.$http.get('roles');
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色信息失败');
                }
                this.rolesList = res.data;
                console.log(res.data);
            },

            // 点击tag上的关闭按钮，根据id删除对应right
            async removeRightById(role, rightId) {

                const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消删除权限成功');
                }
                const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败');
                }
                this.$message.success('删除权限成功');
                // this.getRolesList()
                role.children = res.data;


            },
            // 点击按钮，显示分配权限对话框，参数为当前角色所拥有的权限
            async showDistributeRightDialog(role) {

                const { data: res } = await this.$http.get(`rights/tree`);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限列表失败');
                }
                this.currentRole = role;

                this.rightsList = res.data;

                // 通过递归的方式找到所有应该展开项的id和应该选中项的id
                const findId = arr => {

                    arr.forEach(item => {
                        // 如果当前arr是三级权限，那么没有children属性
                        if (!item.children) {
                            this.checkedKeys.push(item.id);
                        } else {
                            // 当前arr不是三级权限
                            findId(item.children);
                        }
                    });

                };
                findId(role.children);
                console.log(this.checkedKeys);

                this.distributeRightDialogVisible = true;

            },
            // 点击按钮，关闭分配权限对话框
            distributeRightDialogClosed() {
                // 在通过通过递归的方式找到所有应该展开项的id和应该选中项的id之前要先清空一下expandedKeys和checkedKeys的值
                this.checkedKeys = [];
            },
            // 点击按钮，分配权限
            async distributeRight(){

                const afterDistributedCheckedKeys = this.$refs.treeRef.getCheckedKeys()
                const afterDistributedHalfCheckedKeys = this.$refs.treeRef.getHalfCheckedKeys()
               const arr = [...afterDistributedCheckedKeys,...afterDistributedHalfCheckedKeys]
                const rids = arr.join(',')
                const {data:res} = await this.$http.post(`roles/${this.currentRole.id}/rights`,{rids})
                if(res.meta.status!==200){
                    return this.$message.error('角色授权失败')
                }
                this.$message.success('角色授权成功')
                this.distributeRightDialogVisible = false
                this.getRolesList()

            }
        }
    };
</script>
<style lang="less" scoped>
    .el-tag {
        margin: 10px;
    }

    .hasBorderBottom {
        border-bottom: 1px solid #ddd;
    }

    .hasBorderTop {
        border-top: 1px solid #ddd;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }

</style>