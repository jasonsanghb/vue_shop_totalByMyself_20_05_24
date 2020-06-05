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
// 导入富文本编辑器js
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器css
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入nprogress的js
import NProgress from 'nprogress'
// 导入nprogress的css
import 'nprogress/nprogress.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置请求头信息
axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    return config
})
axios.interceptors.response.use(config=>{
    NProgress.done()
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-grid', ZkTable)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.filter('dateFormat',function(oldDate) {
    const date = new Date(oldDate)
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2,'0')
    const day = date.getDate().toString().padStart(2,'0')

    const hour = date.getHours().toString().padStart(2,'0')
    const minute = date.getMinutes().toString().padStart(2,'0')
    const second = date.getSeconds().toString().padStart(2,'0')

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`

})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
