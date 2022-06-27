import axios from 'axios'
import store from '@js/store'
import router from '@/router'
import { Message, Loading } from "element-ui"
import { setItem, getItem, remItem } from './com'
import qs from 'qs'

// 请求进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

let loading; //定义loading变量

function startLoading() {
  //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: "加载中...",
    background: "rgba(0, 0, 0, 0.7)"
  });
}
function endLoading() {
  //使用Element loading-close 方法
  loading.close();
}

const service = axios.create({
    baseURL: WGURL.api,
    timeout: 50000
});

service.interceptors.request.use(
    config => {
        config.headers = {
            //"Content-Type": "application/x-www-form-urlencoded"//application/json; charset=utf-8 application/x-www-form-urlencoded
			"Content-Type": "application/json;charset=utf-8",
            "XC-Token": getItem('token'),
            "LoginUser": getItem('userInfo')
        };
		// debugger
        // config.data = config.data?qs.stringify(config.data):'';
        NProgress.start();
		startLoading();
        return config;
    },
    err => {
        SandVS.$toast.center(err);
        return Promise.reject(err);
    }
);

service.interceptors.response.use(
    response => {
        const res = response;
        // token失效处理及用户登录未授权处理（状态码需与后台人员保持一致）
        if(/^(401|-1003|-1009)$/.test(res.data.resCode)){
            store.dispatch('clearAll');
        }
        if(res.status == 200 || res.status == 201) {
            if(
                res.data.resCode != 1 &&
                res.data.resCode != 10008 &&
                res.data.msg &&
                res.data.msg != ""
            ){
                // 错误统一提示语
                SandVS.$toast.center(res.data.msg);
            }
            NProgress.done();
			endLoading();
            return res.data;
        }
    },
    error => {
		NProgress.done();
		endLoading();
        if (error && error.response) {
            // 处理token失效
            if(error.response.status == 401 ) {
                store.dispatch('clearAll');
            }
            if(error.response.data) {
                let res = error.response.data;
                res.msg = res.msg?res.msg:'服务器通讯故障';
                return Promise.reject(res)
            }
        }else {
            return {ErrorMessage:'服务器通讯故障'}
        }
	}
);


export default service;
