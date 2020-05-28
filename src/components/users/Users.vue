<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片栏区域-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addUserDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="stateChange(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditUserDialog(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="deleteUser(scope.row)"></el-button>
                        <el-tooltip content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="showDistributeRoleDialog(scope.row)"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2, 3, 4]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>
        <!--        添加用户对话框区域-->
        <el-dialog
            title="添加用户"
            :visible.sync="addUserDialogVisible"
            width="50%"
            @close="closeAddUserDialog"
        >
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
        </el-dialog>
        <!--        修改用户信息对话框-->
        <el-dialog
            title="修改用户"
            :visible.sync="eidtUserDialogVisible"
            width="50%"
            @close="eidtUserDialogClosed"
        >
            <el-form :model="eidtUserForm" :rules="addUserFormRules" ref="eidtUserFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="eidtUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="eidtUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="eidtUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="eidtUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
        </el-dialog>
        <!--        分配角色对话框-->

        <el-dialog
            title="分配角色"
            :visible.sync="distributeRoleDialogVisible"
            width="50%"
            @close="distributeRoleDialogClosed"
        >
            <div>当前的用户：{{currentDistributeRoleUser.username}}</div>
            <div class="currentRole">当前的角色：{{currentDistributeRoleUser.role_name}}</div>
            <div>
                分配新角色：
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <span slot="footer" class="dialog-footer">
    <el-button @click="distributeRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="distributeRole">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {

        data() {
            const checkEmail = (rule, value, callback) => {

                const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                if (!regEmail.test(value)) {
                    return callback(new Error('请输入正确形式的邮箱'));
                }
                callback();

            };
            const checkMobile = (rule, value, callback) => {

                const regMobile = /^1[3456789]\d{9}$/;
                if (!regMobile.test(value)) {
                    return callback(new Error('请输入正确形式的手机'));
                }
                callback();

            };
            return {
                // 查询内容对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                // 当前页面上展示的用户列表数据
                userList: [],
                // 总共用户列表数据条数
                total: 0,
                // 添加用户对话框是否显示
                addUserDialogVisible: false,
                // 添加用户表单对象
                addUserForm: {},
                // 用户表单的验证规则
                addUserFormRules: {
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '请输入3-10个字符的用户名称', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入用户密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '请输入6-15个字符的用户密码', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入用户手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]

                },
                // 修改用户信息对话框
                eidtUserDialogVisible: false,
                // 修改用户信息表单对象
                eidtUserForm: {},
                // 控制分配角色对话框的显示与隐藏
                distributeRoleDialogVisible: false,
                // 当前正在分配角色的用户
                currentDistributeRoleUser: {},
                // 角色数组
                rolesList: [],
                // 已选中角色id
                selectedRoleId:''


            };
        },
        created() {
            this.getUserList();
        },
        methods: {
            // 处理分页规格发生变化时的函数
            handleSizeChange(val) {

                this.queryInfo.pagesize = val;
                this.getUserList();
            },
            // 处理分页页码数变化时的函数
            handleCurrentChange(val) {
                this.queryInfo.pagenum = val;
                this.getUserList();
            },
            async getUserList() {
                const { data: res } = await this.$http.get('users', { params: this.queryInfo });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户数据失败');
                }
                this.userList = res.data.users;
                this.total = res.data.total;
                console.log(res);
            },
            // 点击按钮，隐藏对话框
            closeAddUserDialog() {
                // 重置添加用户表单
                this.$refs.addUserFormRef.resetFields();
                this.addUserDialogVisible = false;
            },
            // 点击按钮，添加用户
            addUser() {
                this.$refs.addUserFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    }
                    // 发送请求
                    const { data: res } = await this.$http.post('users', this.addUserForm);
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加用户失败');
                    }
                    this.$message.success('添加用户成功');
                    this.addUserDialogVisible = false;
                    this.getUserList();


                });
            },
            // 点击按钮，改变该用户的状态
            async stateChange(user) {
                const { data: res } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
                if (res.meta.status !== 200) {
                    user.mg_state = !user.mg_state;
                    return this.$message.error('修改用户状态失败');
                }
                this.$message.success('修改用户状态成功');

            },
            // 点击按钮，修改用户信息
            showEditUserDialog(user) {
                this.eidtUserForm = user;
                console.log(this.eidtUserForm);
                this.eidtUserDialogVisible = true;
            },
            // 点击按钮，修改用户信息对话框关闭
            eidtUserDialogClosed() {
                this.$refs.eidtUserFormRef.resetFields();
            },
            // 点击按钮，发送修改用户请求
            editUser() {
                this.$refs.eidtUserFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    }
                    const { data: res } = await this.$http.put(`users/${this.eidtUserForm.id}`, {
                        email: this.eidtUserForm.email,
                        mobile: this.eidtUserForm.mobile
                    });
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改用户信息失败');
                    }
                    this.$message.success('修改用户信息成功');
                    this.eidtUserDialogVisible = false;
                    this.getUserList();
                });
            },
            // 点击按钮，删除用户
            async deleteUser(user) {

                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                // 取消删除用户
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消删除成功');

                }
                const { data: res } = await this.$http.delete(`users/${user.id}`);
                if (res.meta.status !== 200) {
                    return this.$message.error('删除用户失败');
                }
                this.$message.success('删除用户成功');
                this.getUserList();
            },
            // 点击按钮，展示分配角色对话框
            async showDistributeRoleDialog(user) {

                console.log(user);
                // 获取最新的角色数据
                const { data: res } = await this.$http.get('roles');
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色信息失败');
                }
                this.rolesList = res.data;

                // 把正在操作的用户放到data中
                this.currentDistributeRoleUser = user;

                this.distributeRoleDialogVisible = true;
            },
            // 点击按钮 分配权限对话框关闭
            distributeRoleDialogClosed() {

                this.currentDistributeRoleUser={};
                this.selectedRoleId= ''

            },
            // 点击按钮 分配角色
            async distributeRole() {

                // 先判断是否有选择新角色
                if (this.selectedRoleId) {

                    const { data: res } = await this.$http.put(`users/${this.currentDistributeRoleUser.id}/role`, { rid: this.selectedRoleId });
                    if (res.meta.status !== 200) {
                        return this.$message.error('设置角色失败');
                    }
                    this.$message.success('设置角色成功');
                    this.distributeRoleDialogVisible = false
                    this.getUserList()
                }

            }

        }
    };
</script>
<style lang="less" scoped>
    .currentRole {
        margin: 20px 0;
    }

</style>