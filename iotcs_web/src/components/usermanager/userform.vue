<template>
	<div class="div_user">
		<el-button size="small"  icon="el-icon-plus" title="添加" @click="addOpcua">新建
		</el-button>
		<div class="div_userTables">
			<el-table ref="multipleTable" highlight-current-row size="mini" stripe :data="userList"
				tooltip-effect="dark" style="width: 100%; height: 97%;cursor: pointer;"
				:default-sort="{ prop: 'date', order: 'descending' }" @row-click="selectRow" :row-style="rowStyle">
				<el-table-column type="index" label="序号" sortable width="180"></el-table-column>
				<el-table-column prop="UserName" label="用户名"></el-table-column>
				<el-table-column prop="DisplayName" label="姓名"></el-table-column>
				<el-table-column prop="PhoneNumber" label="手机号"></el-table-column>
				<el-table-column prop="Creator" label="创建人"></el-table-column>
				<el-table-column prop="CreateTime" label="创建日期"></el-table-column>
				<el-table-column fixed="right" label="操作" width="240" align="center">
					<template slot-scope="scope">
						<el-button  type="text" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" size="mini" style="color: rgb(247,137,137);">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-sizes="[5, 10, 20, 40]" :page-size="pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="userList.length">
			</el-pagination> -->
			<el-dialog :visible.sync="dialogFormVisible" v-dialogdrag :append-to-body="true" width="520px"
				:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
				v-if="dialogFormVisible">
				<div slot="title" class="header-title">
					<span v-html="dialogTitle"></span>
				</div>
				<el-form :model="formData" :rules="rules" :label-position="labelPosition" ref="formID"
					label-width="120px" style="margin: 0 30px;" class="demo-form">
					<el-form-item label="用户名" prop="UserName">
						<el-input v-model="formData.UserName"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="Password">
						<el-input v-model="formData.Password"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="DisplayName">
						<el-input v-model="formData.DisplayName"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="PhoneNumber">
						<el-input v-model.number="formData.PhoneNumber"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="submitForm('formID')">确定</el-button>
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
				userList: [],
				dialogFormVisible: false,
				formData: {},
				formType: "",
				queryString: "",
				labelPosition: "left",
				rules: {
					UserName: [{
						required: true,
						message: "用户名不能为空",
						trigger: "blur"
					}],
					Password: [{
						required: true,
						message: "密码不能为空",
						trigger: "blur"
					}]
				},
				dialogTitle: ""
			};
		},
		components: {},
		methods: {
			// 行鼠标点击事件
			    selectRow(row, column, event) {
			      this.name = row.name;
			    },
			    // 更改选中行背景色
			    rowStyle({ row }) {
			      if (this.name === row.name) {
			        return { 'background-color': 'rgb(255,255,255)', cursor: 'pointer' };
			      }
			      return { cursor: 'pointer' };
			    },

			// 初始页currentPage、初始每页数据数pagesize和数据data
			handleSizeChange: function(size) {
				this.pagesize = size;
				console.log(this.pagesize) //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				console.log(this.currentPage) //点击第几页
			},
			uuid() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},
			closeDialog() {
				this.dialogFormVisible = false;
			},
			handleDelete(index, row) {
				this.$confirm("确定要删除当前用户?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						/**
						 * 这里需要进行业务判断，是否可以删除
						 */
						this.$post("user/data/delete", {
							Id: row.Id,
							UserName:row.UserName
						}).then(res => {
							if (res.Successful) {
								this.initData();
								this.$Message.success({message: "数据配置成功！", duration: 800});
							} else {
									this.$Message.error({message: res.ErrorMessage, duration: 800});
							}
						});
					})
					.catch(() => {});
			},
			deleteRow(index, rows) {},
			addOpcua() {
				this.dialogTitle = "创建用户";
				this.formData= {},
				this.formType = "add";
				this.dialogFormVisible = true;
			},
			querySearch() {
				if (this.queryString) {
					let params = {
						OpcName: this.queryString
					};
					this.$post("opc/data/get", params).then(res => {
						if (res.Successful) {
							// this.opcuaList = res.Data;
						} else {}
					});
				}
			},
			handleSelectInput() {},
			createFilter(queryString) {
				return restaurant => {
					return (
						restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
						0
					);
				};
			},
			handleSelect(item) {
				console.log(item);
			},
			handleIconClick(ev) {
				console.log(ev);
			},
			submitForm(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						if (this.formType == "add") {
							this.formData.Id = this.uuid();
							this.$post("user/data/insert", this.formData).then(res => {
								if (res.Successful) {
									// console.log(res.data);
									this.initData();
									this.closeDialog();
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});
						} else {
							this.$post("drive/data/update", this.formData).then(res => {
								if (res.Successful) {
									// console.log(res.data);
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			initData() {
				this.$get("user/data/getUsers").then(res => {
					if (res.Successful) {
						this.userList = res.Data;
						// this.$Message.success({message: "数据获取成功", duration: 800});
					} else {
						this.$Message.error({message:res.ErrorMessage, duration: 800});
					}
				});
			}
		},
		mounted() {
			this.initData();
		}
	};
</script>
<style scoped>
	.el-dialog {
		width: 30%;
	}

	.div_user {
		height: 100%;
		/* background-color: #f8f8f8; */
	}

	.div_opcuaOpration {
		padding: 4px 10px;
		height: 40px;
		box-sizing: border-box;
	}

	.opcua_search {
		margin-left: 10px;
	}

	.div_userTables {
		margin-top: 20px;
		height: calc(100% - 60px);
	}

	.opcua_publish {
		height: calc(100% - 40px);
	}

	.dia {
		height: 500px !important;
	}

	.my-autocomplete {
		line-height: normal;
		padding: 7px;
	}

	.name {
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.addr {
		font-size: 12px;
		color: #b4b4b4;
	}

	.highlighted .addr {
		color: #ddd;
	}

	/* 删除单元格底部横线 */
	.div_userTables ::v-deep .el-table td {
		border-bottom: 0px solid #dfe6ec !important;
	}

	.div_userTables>>>.el-table th.is-leaf {
		/* 去除上边框 */
		border: none;
		background-color: rgb(242, 246, 255);
		color: #000000;
	}

	.div_userTables>>>.el-table::before {
		/* 去除下边框 */
		height: 0;
	}
</style>
