import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@js/store'
import VueCodemirror from 'vue-codemirror'
import socket from '@js/websocket'
Vue.prototype.$socket = socket

// 引入echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 引入样式和公共js
import '@styl/app.styl'
import '@js/index.js'

// 按需引入组件
import element from '@js/element'
// import ElementUI from 'element-ui';
// Vue.component(ElementUI);
//引入python编辑器插件
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror)
Vue.use(element)

//引入滚动条插件
// import { HappyScroll } from 'vue-happy-scroll'
// //自定义组件名
// Vue.component('happy-scroll', HappyScroll)
// // 引入css
// import 'vue-happy-scroll/docs/happy-scroll.css'

// 水波纹
import waves from '@pon/directive/waves'

// toast提示
import Toast from 'vue2-toast';
import 'vue2-toast/lib/toast.css';
import './utils/directives.js';
Vue.use(Toast);

Vue.config.productionTip = false

SandVS = new Vue({
    router,
    store,
    render: h => h(App),
    data: {
        eventHub: new Vue()
    }
}).$mount('#app')
