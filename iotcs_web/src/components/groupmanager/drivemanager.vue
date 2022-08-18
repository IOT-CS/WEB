<template>
	<div class="div_opcua">
		<el-button size="small"  icon="el-icon-plus" title="添加" @click="addOpcua">新建
		</el-button>
		<div class="div_opcuaTables">
			<el-table ref="multipleTable" highlight-current-row size="mini" stripe :data="driveList"
				tooltip-effect="dark" style="width: 100%; height: 97%;cursor: pointer;"
				:default-sort="{ prop: 'date', order: 'descending' }" @row-click="selectRow" :row-style="rowStyle">
				<el-table-column type="index" label="序号" sortable width="180"></el-table-column>
				<el-table-column prop="DriveName" label="驱动名称"></el-table-column>
				<el-table-column prop="DriveType" label="驱动类型"></el-table-column>
				<el-table-column prop="Description" label="备注"></el-table-column>
				<el-table-column prop="CreaterBy" label="创建人"></el-table-column>
				<el-table-column prop="CreateTime" label="创建日期"></el-table-column>
				<!-- <el-table-column prop="Duration" label="采集周期(ms)" width="180"></el-table-column> -->
				
				<el-table-column fixed="right" label="操作" width="240" align="center">
					<template slot-scope="scope">
						<el-button  type="text" @click="handleEdit(scope.$index, scope.row)"   icon="el-icon-edit" size="mini" style="color: rgb(64,158,255);">编辑</el-button>
						<el-button  type="text" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" size="mini" style="color: rgb(247,137,137);">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog :visible.sync="dialogFormVisible" v-dialogdrag :append-to-body="true" width="520px"
				:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
				v-if="dialogFormVisible">
				<div slot="title" class="header-title">
					<span v-html="dialogTitle"></span>
				</div>
				<el-form :model="formData" :rules="rules" :label-position="labelPosition" ref="formID"
					label-width="120px" style="margin: 0 30px;" class="demo-form">
					<el-form-item label="驱动名称" prop="DriveName">
						<el-input v-model="formData.DriveName"></el-input>
					</el-form-item>
					<el-form-item label="驱动类型" prop="DriveType">
						<el-select v-model="formData.DriveType" placeholder="请选择" style="width:100%">
						<el-option v-for="item in driveType" :key="item.Id" :label="item.driveType"
							:value="item.driveType"></el-option>
					</el-select>
					</el-form-item>
					<el-form-item label="备注" prop="Description">
						<el-input v-model.number="formData.Description"></el-input>
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
				driveList: [],
				dialogFormVisible: false,
				driveType:[
					{
						Id:"01",
						driveType:"OPCUA"
					},
					{
						Id:"02",
						driveType:"ModbBus-TCP/UDP"
					},
					{
						Id:"03",
						driveType:"ModbBus-Serial"
					},
					{
						Id:"04",
						driveType:"SIEMENS-S7"
					}],
				formData: {
					Id: "",
					DriveName: "",
					DriveType: "",
					DriveParams: "",
					Description:"",
				},
				formType: "",
				queryString: "",
				labelPosition: "left",
				rules: {
					DriveName: [{
						required: true,
						message: "驱动名称不能为空",
						trigger: "blur"
					},{ min: 0, max: 20, message: '长度不能超过20字符', trigger: 'blur' }],
					DriveType: [{
						required: true,
						message: "驱动类型不能为空",
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
			handleEdit(index, row) {
				this.dialogTitle = "编辑驱动";
				this.formData = row;
				this.formType = "edit";
				this.dialogFormVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm("确定要删除当前驱动?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						/**
						 * 这里需要进行业务判断，是否可以删除
						 */
						this.$post("drive/data/delete", {
							Id: row.Id
						}).then(res => {
							if (res.Successful) {
								this.initData();
								this.$Message.success({message: "数据删除成功！", duration: 800});
							} else {
								this.$Message.error({message:"存在设备关联数据，删除失败！", duration: 800});
							}
						});
					})
					.catch(() => {});
			},
			deleteRow(index, rows) {},
			addOpcua() {
				this.dialogTitle = "创建驱动";
				this.formData= {
					Id: "",
					DriveName: "",
					DriveType: "",
					DriveParams: "",
					Description:"",
				},
				this.formType = "add";
				this.dialogFormVisible = true;
			},
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
							this.$post("drive/data/insert", this.formData).then(res => {
								if (res.Successful) {
									this.initData();
									this.closeDialog();
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
								
							}).catch(()=>{});
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
				this.$get("drive/data/getAllDrive").then(res => {
					if (res.Successful) {
						this.driveList = res.Data;
						// this.$Message.success({message: "数据获取成功", duration: 800});
					} else {
						console.log(res);
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

	.div_opcua {
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

	.div_opcuaTables {
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
	.div_opcuaTables ::v-deep .el-table td {
		border-bottom: 0px solid #dfe6ec !important;
	}

	.div_opcuaTables>>>.el-table th.is-leaf {
		/* 去除上边框 */
		border: none;
		background-color: rgb(242, 246, 255);
		color: #000000;
	}

	.div_opcuaTables>>>.el-table::before {
		/* 去除下边框 */
		height: 0;
	}
</style>
