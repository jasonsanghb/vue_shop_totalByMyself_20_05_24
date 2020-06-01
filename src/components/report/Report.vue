<template>
    <div>
        <!--        面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="main" style="height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
    import echarts from "echarts"
    import _ from 'lodash'
    export default {

        data(){
            return{
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                },
                anotherOptions:{}
            }
        },
        created() {

        },
        async mounted() {
            const {data:res} = await this.$http.get('reports/type/1')
            if(res.meta.status!==200){
                return this.$message.error('获取报表数据失败')
            }
            this.anotherOptions = res.data
            var myChart = echarts.init(document.getElementById('main'));

            const result = _.merge(this.options,this.anotherOptions)

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(result);
        }
    }
</script>
<style scoped lang="less"></style>