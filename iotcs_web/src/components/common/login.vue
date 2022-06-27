<template>
    <div class="login">
		<div class="left_bg"></div>
        <div class="model">
            <div class="box">
				<div class="login_logo"></div>
				<!-- <div class="login_name"></div> -->
                <h3>IOTCS</h3> 
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item prop="userName">
                      <el-input v-model="ruleForm.userName" placeholder="请输入用户名" clearable="clearable">
                        <template slot="prepend"><i class="el-icon-user" style="color: #0000FF;"></i></template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" clearable="clearable" show-password="show-password">
                        <template slot="prepend"><i class="el-icon-unlock" style="color: #0000FF;"></i></template>
                      </el-input>
                    </el-form-item>
                    <!-- <el-checkbox class="remember" v-model="ruleForm.checked" @change="remPassword">记住密码
                    </el-checkbox> -->
					<el-form-item style="margin-top: 20px;">
					  <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" v-waves style="border-radius: 20px;">登录</el-button>
					</el-form-item>
				</el-form>		
			</div>			
		</div>				
    </div>    
</template>

<script>
    import md5 from 'js-md5'
    import { mapGetters } from 'vuex'
    export default {
        components: {

        },
        data () {
            return {
                ruleForm: {
                    userName: '',
                    password: '',
					checked:false,
                },
                rules: {
                    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
                loading: false,
                getInfoes: {
                    userName: null,
                    loginIp: '192.168.2.45',
                    loginTime: Date.now(),
                    ipAddr: '亚洲'
                }
            }
        },
        mounted(){
            if(this.getInfo&&(/^\/login$/).test(this.$route.path)){
                this.$link('/home')
            }
        },
        computed: {
            ...mapGetters(['getInfo'])
        },
        methods:{
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.loading = true;
                        // this.ruleForm.password = md5(this.ruleForm.password);
                        // 以下仅本地测试
                        // this.getInfoes.userName = this.ruleForm.userName;
                        // this.$setItem('getInfo', this.getInfoes);
                        // this.$store.commit('SET_GETINFO', this.getInfoes);
                        // this.loading = false;
                        // this.$link('/home');

                        // 以下正式操作
                        this.$store.dispatch('Login', {UserName: this.ruleForm.userName, Password: this.ruleForm.password }).then(res =>{
                          if(res.State_Code == 200)
                          {
                                this.$toast.center('登录成功');
                                 // this.$store.dispatch('MenuList',{userId: res.resObj.userId}).then(res =>{})

                            setTimeout(() => {

                                this.$link('/home')
                            }, 800)

                            this.loading = false;
                          }else{
                                 this.$toast.center('登录失败');
                                   this.loading = false;
                          }
                         
                           
                        }).catch(res =>{
                            this.loading = false;
                        })
                    }else{
                        this.loading = false;
                        return false;
                    }
                });
            },
            remPassword(val){
                 console.log(val)
				 console.log(this.ruleForm)
            }
        }
    }
</script>

<style scoped>
.login{
	background-size: 100% 100%;
    background-image: url("../../assets/images/bg.png");
} 
.login .left_bg{
	width: 624px;
	height: 483px;
	position: absolute;
	left: 15%;
	top: 20%;
	background-size: 100% 100%;
	background-image: url("../../assets/images/login_bg.png");
}
 .model .login_logo{
	width: 105px;
	height: 106px;
	margin: 40px auto 10px;
	background-size: 100% 100%;
	background-image: url("../../assets/images/logo.png"); 
 }
 .model .login_name{
 	width: 94px;
 	height: 23px;
 	margin: 0px auto 10px;
 	background-size: 100% 100%;
 	background-image: url("../../assets/images/IOTCS.png"); 
 }
</style>
