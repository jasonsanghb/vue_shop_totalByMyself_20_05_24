import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入阿里图标
import './assets/fonts/iconfont.css'

// 导入axios
import axios from 'axios'
// 导入第三方插件vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置请求头信息
axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios

Vue.component('tree-grid', ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
