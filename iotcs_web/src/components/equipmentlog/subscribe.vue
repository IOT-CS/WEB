<template>
	<div style="position:relative;height:calc(100% - 20px);box-sizing:border-box">
		<div style="margin: 20px;">
			<el-switch style="display: inline-block" v-model="command" active-color="#13ce66" inactive-color="#ff4949"
				active-text="开始" active-value="1" inactive-value="0" inactive-text="暂停" @change="start(command)">
			</el-switch>
			<span style="margin:0 10px 0 20px;vertical-align:center;">Topic: </span>
			<el-select v-model="topicVal" placeholder="请选择" size="mini" @change="clickTopic">
				<el-option
				v-for="item in topicOpt"
				:key="item"
				:label="item"
				:value="item">
				</el-option>
			</el-select>
		</div>
		<div class="total-content">
			<ul id="ul" style="background:black;color:white;height:100%;overflow:auto">
				<li v-for="(i,b) in total" :key="b">{{i}}<br /></li>
			</ul>
		</div>
	</div>
</template>


<script>
	export default {
		data() {
			return {
				topicVal: '',
				topicOpt: [],
				command: '',
				socket: "",
				loading: false,
				total: ['数据订阅日志，推送采集数据', ' '],
				websock: null,
				logCount:1
			}
		},
		computed: {
			paramsTopic() {
				let topic = ''
				if (this.$route.query.topic !== undefined && this.$route.query.topic !== '') {
					topic = this.$route.query.topic
				}
				return topic
			}
		},
		mounted() {
			this.socket = new this.$socket(WGURL.ws, WGURL.wsPort);
			//创建连接
			 this.socket.createConnection(); 
			 this.socket.setSubLog = (response) => {
				 if(this.command == "1"){
					if( this.total.length > 100){
						this.total.pop();
						this.total.pop();
					}
					var data = response.Data;
					var Topic = JSON.parse(data).Topic;

					if(this.topicVal === Topic || this.topicVal == '全部' ){
						this.total.unshift(' ')
						this.total.unshift(this.$formatDate(new Date()) +"------>"+ data)
					}
				 }
			}
			this.getTopicOpt()
		},
		methods: {
			getTopicOpt() {
				this.$get("rule/getTopics").then(res => {
					if (res.Successful) {
						if (res.Data) {
							this.topicOpt = ['全部'].concat(res.Data);
							if (this.paramsTopic !== '') {
								this.topicVal = this.paramsTopic
							} else {
								this.topicVal = this.topicOpt[0]
							}
						}
					}
				});
			},
			clickTopic(val) {
				
			},
			start(command){
			 }
		}
	}
</script>

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