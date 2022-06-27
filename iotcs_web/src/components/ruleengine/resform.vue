<template>
	<div class="div_res">
		<div class="div_ruleOpration">
			<el-button size="small" icon="el-icon-plus" title="添加" @click="addRes">添加</el-button>
		</div>
		<div class="div_resTables">
			<el-table ref="multipleTable"  :data="rulesList" tooltip-effect="dark" 
				style="width: 100%; height: 100%;cursor: pointer;" border size="mini"
				:default-sort="{ prop: 'date', order: 'descending' }" highlight-current-row>
				<el-table-column type="index" label="序号" sortable width="80" align="center"></el-table-column>
				<el-table-column prop="ResourceName" label="资源名称" align="center"></el-table-column>
				<el-table-column prop="ResourceType" label="资源类型" align="center"></el-table-column>
				<el-table-column prop="CreaterBy" label="创建人" width="100" align="center"></el-table-column>
				<el-table-column prop="CreateTime" label="创建日期" sortable width="180" align="center"></el-table-column>
				<el-table-column fixed="right" label="操作" width="300" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="handleView(scope.$index, scope.row)"   icon="el-icon-edit" size="mini" style="color: rgb(64,158,255);">查看</el-button>
						<el-button type="text" @click="handleEdit(scope.$index, scope.row)"   icon="el-icon-edit" size="mini" style="color: rgb(64,158,255);">编辑</el-button>
						<el-button  type="text" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" size="mini" style="color: rgb(247,137,137);">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-sizes="[5, 10, 20, 40]" :page-size="pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="rulesList.length">
			</el-pagination> -->
			<el-dialog v-dialogdrag :title="resourceTitle" width="36%" :visible.sync="dialogVisible"
				:append-to-body="true" :modal-append-to-body="false" :close-on-click-modal="false"
				:close-on-press-escape="false" v-if="dialogVisible" center>
				<resourceManagement :formType="formType" :formData="formData" @closeWin="closeWin" />
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import resourceManagement from "./resourceManagement.vue";
	export default {
		components: {
			resourceManagement
		},
		data() {
			return {
				currentPage: 1, //初始页
				pagesize: 10, //    每页的数据
				rulesList: [],
				dialogVisible: false,
				formType: "",
				formData: "",
				resourceTitle: "创建资源"
			};
		},
		mounted() {
			this.initData();
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
			handleView(index, row) {
				this.formType = "look";
				this.formData = row;
				this.resourceTitle = "查看资源";
				this.dialogVisible = true;
			},
			handleEdit(index, row) {
				this.formType = "edit";
				this.formData = row;
				this.resourceTitle = "配置资源";
				this.dialogVisible = true;
			},
			handleDelete(index, row) {
				this.$confirm("确定要删除当前资源?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						/**
						 * 这里需要进行业务判断，是否可以删除
						 */
						this.$post("resource/data/delete", {
							Id: row.Id
						}).then(res => {
							if (res.Successful) {
								this.initData();
								this.$Message.success({message: "资源删除成功！", duration: 800});
							} else {
								this.$Message.error({message:"当前资源存在规则配置，删除失败！", duration: 800});
							}
						});
					})
					.catch(() => {});
				return true;
			},
			addRes() {
				this.formType = "add";
				this.formData = "";
				this.resourceTitle = "创建资源";
				this.dialogVisible = true;
			},
			querySearch() {},
			handleSelectInput() {},
			closeWin(val) {
				this.dialogVisible = val;
				this.initData();
			},
			initData() {
				this.$post("resource/data/get").then(res => {
					if (res.Successful) {
						this.rulesList = res.Data;
						// this.$Message.success({message: "数据获取成功", duration: 800});
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

	.div_res {
		height: 100%;
		/* background-color: #f8f8f8; */
	}

	.div_ruleOpration {
		padding: 4px 10px;
		height: 40px;
		box-sizing: border-box;
	}

	.div_resTables {
		margin-top: 20px;
		height: calc(100% - 90px);
	}

	.rule_set {
		height: calc(100% - 40px);
	}
	
	/* 删除单元格底部横线 */
	.div_resTables ::v-deep .el-table td {
		border-bottom: 0px solid #dfe6ec !important;
	}
	
	.div_resTables>>>.el-table th.is-leaf {
		/* 去除上边框 */
		border: none;
		background-color: rgb(242, 246, 255);
		color: #000000;
	}
	
	.div_resTables>>>.el-table::before {
		/* 去除下边框 */
		height: 0;
	}
	
</style>
