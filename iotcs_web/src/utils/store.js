import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import { post, get, setItem, getItem, remItem } from './com'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: getItem('token') ? getItem('token') : null,
        userInfo: getItem('userInfo') ? getItem('userInfo') : null,
        menuList: getItem('menuList') ? getItem('menuList') : null,
        bgColor: getItem('bgColor') ? getItem('bgColor') : '#191A23'
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_USER: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_BGCOLOR: (state, bgColor) => {
            state.bgColor = bgColor;
        },
        SET_MENULIST: (state, menuList) => {
            state.menuList = menuList;
        }
    },
    getters: {
        getInfo: state => state.userInfo,
        menuList: state => state.menuList,
        bgColor: state => state.bgColor
    },
    actions: {
        // 账户登录
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                post('edge/login', userInfo).then(res => {
                    if (res && res.State_Code == 200) {
                        setItem('token', res.Data.Token);
                        setItem('userInfo', { UserName: res.Data.UserName, DisplayName: res.Data.DisplayName })
                        commit('SET_TOKEN', res.Data.Token);
                        commit('SET_USER', JSON.stringify({ UserName: res.Data.UserName, DisplayName: res.Data.DisplayName }));
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 拉取菜单列表
        MenuList({ commit }, id) {
            return new Promise((resolve, reject) => {
                post('user/listMenu', id).then(res => {
                    if (res && res.resCode == 1) {
                        setItem('menuList', res.resObj);
                        commit('SET_MENULIST', res.resObj);
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 清除所有的本地缓存
        clearAll({ commit }) {
            return new Promise((resolve) => {
                remItem();
                //清除储存在state中的值
                commit('SET_TOKEN', null);
                commit('SET_USER', null);
                // commit("SET_MENULIST", null)
                router.push('/login')
                resolve()
            })
        }
    }
})

export default store
