<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<div class="grid-content cont-top cont-left-top">
					<div class="chartTitle"><i class="ti"></i>服务器性能</div>
					<el-row :gutter="5">
						<el-col :span="12">
							<div class="grid-content">
								<div id="gauge1"></div>
								<div style="text-align: center;position:absolute;bottom: 76px;left:0;right:0">
									<el-button type="primary" @click="reloadConfig" size="small" icon="el-icon-refresh-right">重载服务配置数据</el-button>
								</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="grid-content">
								<div id="gauge2">

									<el-card class="box-card" shadow="never" style="width: 95%;height: 90%; text-align: center;">
										<!-- <div slot="header" class="clearfix">
											<span>服务器状态信息</span>
										</div> -->
										<div style="margin-top: 30px;">
											<el-row>
												<el-col :span="12">
													<el-progress type="circle" :stroke-width="15"
														:percentage="Performance.CpuRate" :color="colors"></el-progress>
														<el-tag type="success">CPU占有率</el-tag>
												</el-col>
												<el-col :span="12">
													<el-progress type="circle" :stroke-width="15"
														:percentage="Performance.MemoryRate" :color="colors">
													</el-progress>
													<el-tag type="success">内存占有率</el-tag>
												</el-col>
											</el-row>
										</div>
										<div>
											<ul>
												<li id="unAv">
													<el-progress :stroke-width="25" :percentage="100" :text-inside="true" color="#999"
														:format="AvailableMemory"></el-progress>
												</li>
												<li>
													<el-progress :stroke-width="25" :percentage="100" :text-inside="true" :format="Memory">
													</el-progress>
												</li>
											</ul>
										</div>
									</el-card>
								</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="grid-content cont-top cont-right-top">
					<div class="chartTitle"><i class="ti"></i>驱动状态</div>
					<div id="gauge3">
						<el-table stripe :data="Connections" tooltip-effect="dark" max-height="250">
							<el-table-column prop="OpcName" label="驱动名称"></el-table-column>
							<el-table-column prop="OpcUrl" label="驱动地址"></el-table-column>
							<el-table-column prop="ConnectTime" label="连接时间"></el-table-column>
							<el-table-column prop="IsConnected" label="连接状态" width="180">
								<template #default="scope">
									<el-tag :type="scope.row.IsConnected === '已断开' ? 'danger' : 'success'"
										disable-transitions>{{ scope.row.IsConnected }}</el-tag>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20" style="margin-bottom: 0px;">
			<el-col :span="24">
				<div class="grid-content cont-bottom">
					<div class="chartTitle"><i class="ti"></i>设备节点信息</div>
					<!-- <div id="linesChart"></div> -->
					<el-table ref="multipleTable" highlight-current-row :data="groupList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
						tooltip-effect="dark" style="margin-top:56px;width: 100%;" height="calc(100% - 56px)"
						:default-sort="{ prop: 'date', order: 'descending' }" 
						border
						size="mini"
						default-expand-all
						row-key="Id"
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
						<!-- @row-click="selectRow" :row-style="rowStyle"> -->
						<!-- <el-table-column type="index" label="序号" sortable width="80"></el-table-column> -->
						<el-table-column prop="DeviceName" label="名称"></el-table-column>
						<el-table-column prop="Topic" label="Topic"></el-table-column>
						<!-- <el-table-column prop="DriveType" label="驱动类型"></el-table-column> -->
						<el-table-column prop="DriveName" label="驱动名称"></el-table-column>
						<el-table-column prop="InUse" label="启用" :formatter="convertInUse"></el-table-column>
						<el-table-column prop="Description" label="描述"></el-table-column>
						<el-table-column fixed="right" label="操作" width="240" align="center">
							<template slot-scope="scope">
								<el-button type="text" @click="subLogEdit(scope.$index, scope.row)" v-if="scope.row.ParentId !='' && scope.row.ParentId!= null"  icon="el-icon-edit" size="mini" style="color: rgb(64,158,255); font-size:14px">数据订阅日志</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'

	export default {
		components: {

		},
		data() {
			return {
					currentPage: 1, //初始页
				pagesize: 10, //    每页的数据
				colors: [{
						color: '#5cb87a',
						percentage: 20
					},
					{
						color: '#6f7ad3',
						percentage: 40
					},
					{
						color: '#1989fa',
						percentage: 60
					},
					{
						color: '#e6a23c',
						percentage: 80
					},
					{
						color: '#f56c6c',
						percentage: 100
					}
				],
				groupList: [],
				socket: "",
				Performance: {
					AvailableMemory: 0,
					CpuRate: 0,
					Memory: 0,
					MemoryRate: 0,
					UnAvMeRate:0,
				},
				Connections: [
					// ConnectTime: "",
					// IsConnected: "",
					// OpcName: "",
					// OpcUrl: ""
				],
				ResourceType: "HTML",
				resourceType: [{
					value: 'HTML',
					label: 'HTML'
				}, {
					value: 'CSS',
					label: 'CSS'
				}, {
					value: 'JavaScript',
					label: 'JavaScript'
				}],

				title: '',
				xRows: [],
				allData: [],
				lineTitle: [],
				colorArr: ['#435ae5', '#cc9d1f', '#835aa9']
			}
		},
		mounted() {
			this.socket = new this.$socket(WGURL.ws, WGURL.wsPort);
			console.log(this.socket)
			//创建连接
			this.socket.createConnection();
			this.socket.update = (response) => {
				var data = response.Performance;
				this.Performance.AvailableMemory = Number((data.AvailableMemory / 1024 / 1024 / 1024).toFixed(2));
				this.Performance.Memory = (data.Memory / 1024 / 1024 / 1024).toFixed(2);
				this.Performance.CpuRate = Number((data.CpuRate * 100).toFixed(2));
				this.Performance.MemoryRate = Number(((data.Memory - data.AvailableMemory) / data.Memory * 100).toFixed(2));
				this.Performance.UnAvMeRate = Number((data.AvailableMemory / data.Memory * 100).toFixed(2));
				var data1 = response.Connections;
				this.Connections = [];
				data1.forEach(item => {
					this.Connections.push({
						ConnectTime: this.transformTimestamp(item.ConnectTime),
						IsConnected: item.IsConnected == true ? "已连接" : "已断开",
						OpcName: item.OpcName,
						OpcUrl: item.OpcUrl,
					});
				})
			}
			this.initGroupData();
		},
		computed: {
			...mapGetters(['getInfo'])
		},
		methods: {
			AvailableMemory(percentage) {
				return "可用内存：" + this.Performance.AvailableMemory + " Gb";
			},
			Memory(percentage) {
				return "总内存：" + this.Performance.Memory + " Gb";
			},
			//时间转换
			transformTimestamp(timestamp) {
				let a = new Date(timestamp).getTime();
				const date = new Date(a);
				const Y = date.getFullYear() + '-';
				const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
				const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
				// const s = date.getSeconds(); // 秒
				const dateString = Y + M + D + h + m;
				// console.log('dateString', dateString); // > dateString 2021-07-06 14:23
				return dateString;
			},
			convertInUse(row,column){
				if(row.DeviceType == 0){
					return'';
				}
				if(row.InUse == 0){
					return "否";
				}else{
					return "是";
				}
			},
			initGroupData() {
				this.$get("device/data/getAllDevice").then(res => {
					if (res.Successful) {
						this.groupList = res.Data;
						this.groupList.forEach(item=>{
							item.children = item.Childrens;
							//item.hasChildren = item.HasChildren;
						})
						console.log(this.groupList);
						// this.$Message.success({message: "数据获取成功", duration: 800});
					} else {
						// this.$msgbox.alert('提示内容', '提示标题', {
						// 	confirmButtonText: '确定',
						// 	callback: action => {
						// 	}
						// });
					}
				});
				},
			chartInit() {
				let myChart3 = this.$echarts.init(document.getElementById("linesChart"));
				// 绘制图表
				var item_type = ['已接收', '成功处理', '异常数据'];
				myChart3.setOption({
					title: {
						text: this.title,
						textStyle: {
							color: '#00ce7d'
						},
						top: 20
					},
					tooltip: {
						trigger: 'axis',
						appendToBody: true,
						axisPointer: {
							type: 'shadow'
						},
						textStyle: {
							fontSize: 14,
							color: "#fff"
						},
						backgroundColor: "rgb(50,115,242)",
						formatter: function(value, index, c) {
							try {
								return item_type[0] + "：" + value[0].value + " <br/>" + item_type[1] + "：" +
									value[1].value + " <br/>" + item_type[2] + "：" +
									value[2].value + "";
							} catch (e) {
								return "";
							}
						}
					},

					legend: {
						data: this.lineTitle,
						textStyle: {
							color: '#00ce7d',
							// color: "#fff",
							fontStyle: "normal",
							fontFamily: "微软雅黑",
							fontSize: 16
						},
						left: 20,
						top: 30
					},
					// grid: {
					// 	top: "bottom",
					// 	left: 86,
					// 	width: "90%",
					// 	height: "75%",
					// 	containLabel: true
					// },
					grid: {
						top: "bottom",
						// left: 56,
						left: "center",
						// right: 55,
						width: "90%",
						height: "75%",
						containLabel: true
					},
					axisPointer: {
						show: true,
						type: 'line',
						label: {
							show: false,
						},
					},
					xAxis: [{
						type: 'category',
						data: this.xRows,
						axisLine: {
							lineStyle: {
								color: 'rgba(255,255,0,0.8)'
							}
						},
						splitLine: {
							lineStyle: {
								color: 'rgba(0,255,255,0.8)'
							}
						},
						axisLabel: {
							interval: 0,
							rotate: 40,
							textStyle: {
								color: "#000",
								fontSize: 14
							}
						},
						axisTick: {
							show: true,
							alignWithLabel: true,
							inside: true
						}
					}],
					yAxis: [{
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#00ce7d'
							},
						},
						splitLine: {
							"show": false
						},
						axisLabel: {
							textStyle: {
								color: "#000",
								fontSize: 14,
							},
							formatter: function(value) {
								return value + ""
							},
						},
						axisTick: {
							show: true,
							alignWithLabel: true,
							inside: true
						}
					}],
					series: this.allData
				});
				window.addEventListener("resize", function() {
					myChart3.resize();
				});
			},
			subLogEdit(index, row) {
				this.$router.push({
					path: '/log/subscribe',
					query: { topic: row.Topic }
				})
			},
			reloadConfig(){
					this.$confirm("确定重新加载配置数据?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						this.$post("config/data/publish")
						.then(res => {
							if (res.Successful) {
								this.$Message.success({message: "加载成功", duration: 800});
							} else {
								 this.$Message.error({message:"加载失败", duration: 800});
							}
						});
					})
					.catch(() => { });
			}
		}
	}
</script>

<style scoped>

	.el-row {
		margin-bottom: 20px;
	}
	.el-row:last-child {
		margin-bottom: 0;
	}
	.el-col {
		border-radius: 4px;
	}

	.cont-top {
		height: 40vh;
	}

	.cont-bottom {
		height: 37vh;
		margin-bottom: 0;
	}

	.grid-content {
		position: relative;
		border-radius: 4px;
		min-height: 333px;
		background-color: #f9fafc;
		overflow: hidden;
	}

	#gauge1 {
		background: url(../../assets/images/device.png) no-repeat center center;
		background-size: 85% auto;
		height: 100%;
	}

	#gauge1,
	#gauge2 {
		width: 98%;
		height: 42vh;
		min-height: 348px;
		padding: 10px;
	}

	#gauge3 {
		position: absolute;
		width: 97%;
		margin: 20px;
		top: 40px;


	}
	#gauge2 ul li {
		margin: 10px 0;
		text-align: center;
		padding: 5px 5px;
		/* font-size: 16px; */
		color: #F56C6C;
		/* border: solid 1px red; */
		border-radius: 10px;
		background-color: #ddd;
	}
	#linesChart {
		width: 98%;
		height: 33vh;
		padding: 10px;
	}

	.chartTitle {
		position: absolute;
		left: 1.25rem;
		top: 0.9375rem;
		color: #000;
		z-index: 2;
		padding-left: 15px;
		font-weight: 900;
	}

	.chartTitle .ti {
		list-style: none;
		display: block;
		position: absolute;
		left: 2px;
		top: 0;
		width: 5px;
		height: 90%;
		background-color: rgb(50, 115, 242);
	}

	#topicSelect {
		position: absolute;
		right: 1.25rem;
		top: 0.9375rem;
	}
</style>
