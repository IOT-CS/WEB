<template>
	<div class="div_rules">
		<div class="div_ruleOpration">
			<el-button size="small" icon="el-icon-plus" title="添加" @click="addRule" style="color: rgb(64,158,255);">添加</el-button>
		</div>
		<div class="div_ruleTables">
			<el-table ref="multipleTable" border size="mini"  :data="rulesList"
				tooltip-effect="dark" style="width: 100%; height: 96%"
				:default-sort="{ prop: 'date', order: 'descending' }" highlight-current-row>
				<el-table-column type="index" label="序号" sortable width="80"></el-table-column>
				<el-table-column prop="Topic" label="Topic"></el-table-column>
				<el-table-column prop="ResourceName" label="资源名称"></el-table-column>
				<el-table-column prop="CreaterBy" label="创建人" width="100"></el-table-column>
				<el-table-column prop="CreateTime" label="创建日期" sortable width="180"></el-table-column>
				<el-table-column fixed="right" label="操作" width="240" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEdit(scope.$index, scope.row)"   icon="el-icon-edit" size="mini" style="color: rgb(64,158,255);">编辑</el-button>
						<el-button  type="text" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" size="mini" style="color: rgb(247,137,137);">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-sizes="[5, 10, 20, 40]" :page-size="pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="rulesList.length">
			</el-pagination> -->

			<el-dialog title="Topic关联配置" width="520px" :visible.sync="dialogVisible" :append-to-body="true" 
				:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
				v-if="dialogVisible" :show-close="false" center class="dialog_box">
				<el-form :model="formData" :rules="rules" label-position="left" ref="formDeviceGroup" label-width="120px"
				style="margin: 0 30px;" class="demo-form">
				<el-form-item label="Topic" prop="Topic">
					<el-select v-model="formData.Topic" placeholder="请选择" style="width:100%">
						<el-option v-for="item in dataTopics" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="资源" prop="ResourceId">
					<el-select v-model="formData.ResourceId" placeholder="请选择" style="width:100%">
						<el-option v-for="item in dataResouces" :key="item.Id" :label="item.ResourceName"
							:value="item.Id"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitForm('formDeviceGroup')">确定</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</el-form-item>
			</el-form>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				currentPage: 1, //初始页
				pagesize: 10, //    每页的数据
				rulesList: [],
				dialogVisible: false,
				formType: "",
				nodeData: "",
				formData:{},
				dataTopics: [],
				dataResouces: [],
				rules: {
					Topic: [{
						required: true,
						message: "Topic不能为空",
						trigger: "blur"
					}],
					ResourceId: [{
						required: true,
						message: "资源不能为空",
						trigger: "blur"
					}]
				},
			};
		},
		mounted() {
			this.initData();
			this.initTopicAndResource();
		},
		methods: {
			// 初始页currentPage、初始每页数据数pagesize和数据data
			handleSizeChange: function(size) {
				this.pagesize = size;
				console.log(this.pagesize) //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				console.log(this.currentPage) //点击第几页
			},
			handleView(index, row) {},
			handleEdit(index, row) {
				this.formType = "edit";
				this.formData = row;
				this.resourceTitle = "配置资源";
				this.dialogVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm("确定要删除当前数据?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						/**
						 * 这里需要进行业务判断，是否可以删除
						 */
						//{RuleId:row.RuleId}
						row.lineList = "";
						row.name = "";
						row.nodeList = "";
						this.$post("rule/relationship/delete", {
							Id: row.Id
						}).then(res => {
							if (res.Successful) {
								this.initData();
								this.$Message.success({message: "数据配置成功！", duration: 800});
							} else {
								// this.$msgbox.alert('提示内容', '提示标题', {
								// 	confirmButtonText: '确定',
								// 	callback: action => {
								// 	}
								// });
							}
						});
					})
					.catch(() => {});
				return true;
			},
			// 返回唯一标识
			getUUID() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
					c
				) {
					var r = (Math.random() * 16) | 0,
						v = c == "x" ? r : (r & 0x3) | 0x8;
					return v.toString(16);
				});
			},
			submitForm(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						if(this.formType == 'add'){
							this.formData.Id = this.getUUID();
							this.$post("rule/relationship/insert", this.formData).then(res => {
								if (res.Successful) {
									this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									 this.$Message.error({message:res.ErrorMessage, duration: 800});

								}
							});

						}else{
							this.$post("rule/relationship/update", this.formData).then(res => {
								if (res.Successful) {
									this.initData();
									this.closeDialog();
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									 this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});

						}
							

					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			closeDialog() {
				this.dialogVisible = false;
			},
			addRule() {
				this.formType = "add";
				this.formData = {};
				this.dialogVisible = true;
			},
			querySearch() {},
			handleSelectInput() {},
			initTopicAndResource(){
				this.$post("resource/data/get").then(res => {
					if (res.Successful) {
						if (res.Data) {
						this.dataResouces = res.Data;
						}
						
					} else {
						this.$Message.error({message:res.ErrorMessage, duration: 800});

					}
				});
				this.$get("rule/getTopics").then(res => {
					if (res.Successful) {
						if (res.Data) {
							this.dataTopics = res.Data;
						}
					}
				});
			},
			initData() {
				this.$post("rule/relationship/get").then(res => {
					if (res.Successful) {
						this.rulesList = res.Data;
						// console.log(res)
					} else {
						this.$Message.error({message:res.ErrorMessage, duration: 800});
					}
				});
			}
		}
	};
</script>
<style scoped>

	.div_rules {
		height: 100%;
		/* background-color: #f8f8f8; */
	}

	.div_ruleOpration {
		padding: 4px 10px;
		height: 40px;
		box-sizing: border-box;
	}

	.rule_search {
		margin-left: 10px;
	}

	.div_ruleTables {
		margin-top: 20px;
		height: calc(100% - 60px);
	}

	.rule_set {
		height: calc(100% - 40px);
	}

	
	/* 删除单元格底部横线 */
	.div_ruleTables ::v-deep .el-table td {
		border-bottom: 0px solid #dfe6ec !important;
	}
	
	.div_ruleTables>>>.el-table th.is-leaf {
		/* 去除上边框 */
		border: none;
		background-color: rgb(242, 246, 255);
		color: #000000;
	}
	
	.div_ruleTables>>>.el-table::before {
		/* 去除下边框 */
		height: 0;
	}
</style>
<style>
 .dialog_box .el-dialog{
	 max-width: 99%;
 }
</style>
