<template>
	<div style="position:relative;height:calc(100% - 20px);box-sizing:border-box">
		<div style="margin: 20px;">
			<el-switch style="display: block" v-model="command" active-color="#13ce66" inactive-color="#ff4949"
				active-text="开始" active-value="1" inactive-value="0" inactive-text="暂停" @change="start(command)">
			</el-switch>
		</div>
		<!-- <el-card id="card" class="box-card" style="background:black;color:white;max-height:27.2em;overflow:auto">
			<div id="text" style="background:black;color:white;">
				<ul id="ul">
					<li v-for="(i,b) in total" :key="b">{{i}}<br /></li>
				</ul>
			</div>
		</el-card> -->
		<div class="total-content">
			<!-- max-height:27.2em;overflow:auto -->
			<ul id="ul" style="background:black;color:white;height:100%;overflow:auto">
				<li v-for="(i,b) in total" :key="b">{{i}}<br /></li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
	.total-content{
		padding:20px;
		position:absolute;
		top:36px;
		left:10px;
		right:10px;
		bottom:10px;
		color:white;
		background:black;
	}
	ul {
		margin: 0px;
		padding: 0px;
		list-style: none;
	}

	.input_text .el-input__inner:focus {
		border: 1px solid black;
	}

	.input_text .el-input__inner:hover {
		border: 1px solid black;
	}

	.input_text .el-input__inner {
		color: green;
		border: 1px solid black;
		background-color: black;
	}

	.input_text .el-input-group__prepend {
		padding: 0px;
		color: white;
		border: 1px solid black;
		background-color: black;
	}
</style>

<script>
	export default {
		data() {
			return {
				command: '',
				socket: "",
				loading: false,
				total: ['服务诊断日志，推送服务异常信息', ' '],
				websock: null,
				logCount:1
			}
		},
		mounted() { 
			this.socket = new this.$socket(WGURL.ws, WGURL.wsPort);
			//创建连接
			 this.socket.createConnection(); 
			 this.socket.setDiagnosticLog = (response) => {
				 if(this.command == "1"){
					if(this.total.length > 100){
						this.total.pop();
						this.total.pop();
					}
					var data = response.Data;
					this.total.unshift(' ')
					this.total.unshift(this.$formatDate(new Date()) +"------>"+ data)
				 }
			}
		},
		methods: {
			start(command){
			// 	const  intval = this.setIntervalTotal()
			// 	if(command == "1"){
			// 		while(this.logCount < 30){
			// 			this.total.push("这是一条测试日志数据~")
			// 			this.logCount= this.logCount + 1
			// 		}
			// 		intval
			// 	}else{
			// 		clearInterval(intval)
			// 	}
			// },
			// setIntervalTotal() {
			// 	return intval = setInterval(() => {
			// 		this.total.unshift(new Date()+ "这是一条测试日志数据~")
			// 			// this.logCount= this.logCount + 1
			// 	},100)
			 }
		}
	}
</script>
