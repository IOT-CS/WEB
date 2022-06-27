import Vue from 'vue'
import store from '@js/store'
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
import layout from '@com/layout'

const imp = ((path,url) =>{
    if(url == 1){
        return () =>import('@com/'+path)
    }
	else{
        return () =>import('@pon/'+path)
    }
})

Vue.use(Router)

const routes = [
    {path: '/login',name: '登录',component: imp('login',1),meta:{r: true}},
    {
        component: layout,
        path: '/home',
        children: [
            {path: '/home',name: '首页',component: imp('home',1)},
			{path: '/manager/drivemanager',name: '驱动管理',component: imp('groupmanager/drivemanager')},
			{path: '/manager/equipmentmanager',name: '设备管理',component: imp('groupmanager/equipmentmanager')},
			{path: '/manager/nodemanager',name: '设备变量配置',component: imp('groupmanager/nodemanager')},
            {path: '/log/diagnoseinfo',name: '诊断信息',component: imp('equipmentlog/diagnoseinfo')},
            {path: '/log/subscribe',name: '数据订阅',component: imp('equipmentlog/subscribe')},
            {path: '/rule/ruleform',name: '规则列表',component: imp('ruleengine/ruleform')},         
            {path: '/rule/resform',name: '资源管理',component: imp('ruleengine/resform')},
            {path:'/user/usermanager',name:'用户管理',component:imp('usermanager/userform')}
        ]
    },
    

    {path: '*/', redirect: '/home'}

]

const router = new Router({
    routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    if(!to.meta.r){
        if(store.getters.getInfo){
            next();
        }else{
            next({path: '/login'})
        }
    }else{
        next();
    }
    if(to.name){
        document.title = to.name + '-' + 'IOTCS采集平台'
    }
})

export default router