<template lang="pug">
	#app
		router-view
</template>

<script>
	import {
		mapGetters
	} from "vuex";

	export default {
		name: 'app',
		components: {

		},
		data() {
			return {

			}
		},
		computed: {
			...mapGetters([])
		},
	}
</script>

<style>
	/* 用来设置当前页面element全局table的内间距 */
	.el-table__row td {
		padding: 0;
	}

	/* 用来设置当前页面element全局table 选中某行时的背景色*/
	.el-table__body tr.current-row>td {
		background-color: rgba(50, 115, 242, .4) !important;

		/* color: #f19944; */
		/* 设置文字颜色，可以选择不设置 */
	}

	/* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
	.el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #f19944;
		/* color: #f19944; */
		/* 设置文字颜色，可以选择不设置 */
	}

	.el-tree-node__content {
		margin: 0px 0px 5px 0px;
		padding: 10px 20px;
	}

	.tree .el-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}

	.tree .el-icon-caret-right:before {
		content: "\e7a0";
		font-size: 18px;
	}

	.tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
		content: "\e7a2";
		font-size: 18px;
	}

	.el-tree--highlight-current .el-tree-node.is-checked>.el-tree-node__content {
		background-color: rgb(64, 158, 255);
		color: rgb(64, 158, 255);
	}

	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
		background-color: rgb(64, 158, 255);
		color: rgb(80, 80, 80);
	}
	.el-dialog {
		display: flex;
		flex-direction: column;
		margin: 0 !important;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/*height:600px;*/
		max-height: calc(100% - 30px);
		max-width: calc(70% - 30px);
	}
	.el-dialog .el-dialog__header .header-title span{
		float: left;
		font-weight: 900;
	}
	/* .el-dialog .el-form-item:last-child:not(.is-required) .el-form-item__content{
		float: right;
	} */
	.el-dialog .el-dialog__header .header-title span::before{
		content: "-";
		width: 10px;
		height: 100%;
		margin-right: 5px;
		color: rgb(50,115,242);
		background-color: rgb(50,115,242);
		font-size: 16px;
	}
	.el-dialog .el-dialog__body {
		flex: 1;
		overflow: auto;
		background-image: linear-gradient(rgb(235,235,235), rgb(212,226,231));
		/* background-color: rgba(50, 115, 242, .3) !important; */
	}
	.el-icon-plus{
		background: url('assets/images/add.png') center center no-repeat;
		background-size: 20px;
	}
	.el-icon-plus:before {
	    content: "替";
	    font-size: 16px;
	    visibility: hidden;
	}
	.el-icon-edit{
		background: url('assets/images/edit.png') center center no-repeat;
		background-size: 20px;
	}
	.el-icon-edit:before {
	    content: "替";
	    font-size: 16px;
	    visibility: hidden;
	}
	.el-icon-delete{
		background: url('assets/images/del.png') center center no-repeat;
		background-size: 20px;
	}
	.el-icon-delete:before {
	    content: "替";
	    font-size: 16px;
	    visibility: hidden;
	}
	.el-icon-check{
		background: url('assets/images/choose.png') center center no-repeat;
		background-size: 20px;
	}
	.el-icon-check:before {
	    content: "替";
	    font-size: 16px;
	    visibility: hidden;
	}
	.el-icon-view{
		background: url('assets/images/query.png') center center no-repeat;
		background-size: 20px;
	}
	.el-icon-view:before {
	    content: "替";
	    font-size: 16px;
	    visibility: hidden;
	}
	.el-icon-user{
		background: url('assets/images/user.png') center center no-repeat;
		background-size: 20px;
	}
	.el-icon-user:before {
	    content: "替";
	    font-size: 16px;
	    visibility: hidden;
	}
	.el-icon-unlock{
		background: url('assets/images/pwd.png') center center no-repeat;
		background-size: 20px;
	}
	.el-icon-unlock:before {
	    content: "替";
	    font-size: 16px;
	    visibility: hidden;
	}
	/* .el-icon-close{
		background: url('assets/images/chacha.png') center center no-repeat;
		background-size: 20px;
	} */
	.el-icon-close:before {
	    /* content: "替"; */
	    font-size: 16px;
	    /* visibility: hidden; */
	}
</style>
