<template>
  <div class="app-container div_group" id="deviceEquipment">
    <el-row :gutter="20">
      <el-col :sm="9" :md="7" :lg="5">
        <div class="device-left">
          <div class="_tree">
            <el-tree
              node-key="Id"
              :data="deviceList"
              :props="defaultProps"
              ref="deviceTree"
               :highlight-current="true"
              default-expand-all
              @node-click="handlerNode"
            />
          </div>
        </div>
      </el-col>
      <el-col :sm="15" :md="17" :lg="19">
        <div class="device-right">
          <div class="_search">
            <el-button
              size="small"
              icon="el-icon-plus"
              title="添加"
              @click="addNode"
              >添加点位</el-button
            >
          </div>
          <div class="grid-content bg-purple div_groupTables">
            <el-table
              height="71vh"
              ref="doitTable"
              highlight-current-row
              tooltip-effect="dark"
              style="width: 100%; height: 97%"
              @row-click="selectRow"
              :row-style="rowStyle"
              size="mini"
              :default-sort="{ prop: 'date', order: 'descending' }"
              :data="spotList"
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
                align="center"
              ></el-table-column>
              <el-table-column prop="DisplayName" label="变量名" align="center">
              </el-table-column>
               <el-table-column prop="NodePreStamp" label="前戳" align="center">
              </el-table-column>
              <el-table-column prop="NodeAddress" label="地址" align="center">
              </el-table-column>
               <el-table-column prop="NodeLength" label="长度" align="center">
              </el-table-column>
              <el-table-column prop="Attribute" label="特性" align="center">
              </el-table-column>
              <el-table-column prop="Expressions" label="表达式" align="center">
              </el-table-column>
              <el-table-column prop="Source" label="原值" align="center">
              </el-table-column>
              <el-table-column prop="Sink" label="点位值" align="center">
              </el-table-column>
              <el-table-column prop="Status" label="点位状态" align="center">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button type="text"
                    @click="edit_Diot(scope.row)"
                    icon="el-icon-edit"
                    size="small"
                    style="color: rgb(64, 158, 255)"
                    >编辑</el-button
                  >
                  <el-button type="text"
                    @click="remove_Diot(scope.row)"
                    icon="el-icon-delete"
                    size="small"
                    style="color: rgb(247, 137, 137)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogFormVisible" width="520px"
      v-dialogdrag :append-to-body="true"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-if="dialogFormVisible"
    >
      <div slot="title" class="header-title">
        <span v-html="dialogTitle"></span>
      </div>
      <el-form
        :model="formNodeData"
        label-position="left"
        ref="formID"
        label-width="120px"
        style="margin: 0 30px"
        class="demo-form"
         :rules="rules"
      >
        <el-form-item label="设备"  prop="DeviceName" v-show="formType=='add'">
          <el-cascader :options="deviceList"  
           ref="cascaderDevice" :props="{ value: 'Id', label: 'DeviceName'}"  @change="getChild()" :show-all-levels="false" style="width:100%"></el-cascader>
        </el-form-item>
        <el-form-item label="变量名" prop="DisplayName">
          <el-input v-model="formNodeData.DisplayName" :readonly="isLook"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="NodeAddress">
          <el-input v-model="formNodeData.NodeAddress"></el-input>
        </el-form-item>
         <el-form-item label="特性" prop="Attribute">
          <el-select v-model="formNodeData.Attribute" style="width:100%">
            <el-option v-for="item in attributeList" :key="item.value" :label="item.text"
								:value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="前戳" prop="NodePreStamp">
          <el-input v-model="formNodeData.NodePreStamp" placeholder="如西门子PLC:DB50"></el-input>
        </el-form-item>
        <el-form-item label="长度" prop="NodeLength">
          <el-input v-model="formNodeData.NodeLength"></el-input>
        </el-form-item>

         <el-form-item label="表达式" prop="Expressions">
          <el-input v-model="formNodeData.Expressions" placeholder="进行简单的计算,raw表示原值参与计算"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formID')"
            >确定</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import EditableCell from "@pon/directive/editableCell.vue";
export default {
  data() {
    return {
      isLook: false,
      currentPage: 1, //初始页
      pagesize: 10, //  每页的数据
      currentLivingId: "",
      deviceList: [],
      defaultProps: {
        children: "children",
        label: "DeviceName",
      },
      formInline: {
        groups: "",
      },
      rules: {
					DisplayName: [{
						required: true,
						message: "变量名不能为空",
						trigger: "blur"
					},{ min: 0, max: 50, message: '长度不能超过50字符', trigger: 'blur' }],
					NodeAddress: [{
						required: true,
						message: "地址不能为空",
						trigger: "blur"
					},{ min: 0, max: 50, message: '长度不能超过50字符', trigger: 'blur' }],
          NodeLength:[{validator:this.isNum}],
           Attribute:[{
            required: true,
						message: "Attribute不能为空",
						trigger: "blur"
          }]
				},
      formNodeData: {},
      groupList: [],
      attributeList:[
        {
          text:"Read",
          value:"Read"
        },
        {
          text:"Write",
          value:"Write"
        },
        {
          text:"Read/Write",
          value:"Read/Write"
        }
      ],
      spotList: [],
      dialogFormVisible: false,
      dynamicValidateFormModal: false,
      dialogVisible: false,
      dialogTitle: "",
      formType: "",
    };
  },
  components: {
    EditableCell,
  },

  computed: {},
  methods: {
    // 行鼠标点击事件
    selectRow(row, column, event) {
      this.name = row.name;
    },
    // 更改选中行背景色
    rowStyle({ row }) {
      if (this.name === row.name) {
        return {
          "background-color": "rgb(255,255,255)",
          cursor: "pointer",
        };
      }
      return {
        cursor: "pointer",
      };
    },
    isNum (rule, value, callback)  {
      if (value !== '' && value !== undefined){
        const age= /^[0-9]*$/
        if (!age.test(value)) {
          callback(new Error('必须为数字'))
        }else{
          callback()
        }
      }else{
        callback()
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    handlerNode(row) {
      const id = row.Id
      this.getData(id)
    },
    getData(id) {
      this.$post("datalocation/data/getNode", {
        ParentId: id,
      }).then((res) => {
        if (res.Successful) {
          this.spotList = res.Data;
        } else {
           this.$Message.error({message:res.ErrorMessage, duration: 800});
        }
      });
    },

    // 返回唯一标识
    getUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    ArrHasObj(Arr, obj) {
      let index = -1;
      Arr.forEach((item, ind) => {
        if (item.Id == obj.Id) {
          index = ind;
        }
      });
      return index;
    },

    remove_Diot(raw) {
      this.$confirm("确定要删除当前点位?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          /**
           * 这里需要进行业务判断，是否可以删除
           */
          this.$post("datalocation/data/delete", {
            Id: raw.Id,
          }).then((res) => {
            if (res.Successful) {
              this.getData(raw.ParentId);
              this.$Message.success({ message: "数据配置成功", duration: 800 });
            } else {
              this.$Message.error({message:"数据删除失败", duration: 800});
            }
          });
        })
        .catch(() => {});
    },
    edit_Diot(raw) {
      //编辑点位
      this.dialogTitle = "编辑点位";
      this.formNodeData = raw;
      this.formType = "edit";
      this.dialogFormVisible = true;
      this.isLook = true;
    },
    addNode() {
      this.formNodeData = {};
      this.formType = "add";
      this.dialogTitle = "创建点位";
      this.dialogFormVisible = true;
      this.isLook = false;
    },
    getChild(){
      var currNode = this.$refs['cascaderDevice'].getCheckedNodes()[0].value;
      this.formNodeData.ParentId=currNode;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formType == "add") {
            this.formNodeData.Id = this.getUUID();
            this.$post("datalocation/data/insert", this.formNodeData).then(
              (res) => {
                if (res.Successful) {
                  if (this.deviceList.length > 0) {
                    this.currentLivingId = this.formNodeData.ParentId; 
                    console.log(this.currentLivingId)
                    this.$nextTick(function () {
                      this.$refs.deviceTree.setCurrentKey(this.currentLivingId);
                    });
                  }
                  console.log(this.formNodeData.ParentId)
                  this.getData(this.formNodeData.ParentId);
                  this.$Message.success({
                    message: "数据配置成功",
                    duration: 800,
                  });
                  this.closeDialog();
                } else {
                  this.$Message.error({message:res.ErrorMessage, duration: 800});
                }
              }
            );
          } else {
            this.$post("datalocation/data/update", this.formNodeData).then(
              (res) => {
                if (res.Successful) {
                  this.getData(this.formNodeData.ParentId);
                  this.closeDialog();
                  this.$Message.success({
                    message: "数据配置成功",
                    duration: 800,
                  });
                } else {
                  this.$Message.error({message:res.ErrorMessage, duration: 800});
                }
              }
            );
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
    closeDialog() {
      this.dialogFormVisible = false;
    },
    initGroup() {
      this.$get("device/data/getAllDevice").then((res) => {
        if (res.Successful) {
          this.deviceList = res.Data;
          this.deviceList.forEach((item) => {
            item.children = item.Childrens;
            //item.hasChildren = item.HasChildren;
          });
          if (this.deviceList.length > 0) {
            this.currentLivingId = this.deviceList[0].Id;
            this.$nextTick(function () {
              this.$refs.deviceTree.setCurrentKey(this.currentLivingId);
            });
          }
          // this.$Message.success({message: "数据获取成功", duration: 800});
        } else {
         this.$Message.error({message:res.ErrorMessage, duration: 800});
        }
      });
    },
  },
  mounted() {
    this.initGroup();
    this.socket = new this.$socket(WGURL.ws, WGURL.wsPort);
			//创建连接
			 this.socket.createConnection(); 
			 this.socket.setNodeValue = (response) => {
        this.spotList.forEach(item => {
            if(item.Id == response.Id){
              item =  Object.assign(item,response)
            }
       });
			}
  },
};
</script>
<style>
/* 删除单元格底部横线 */
#deviceEquipment ::v-deep .el-table td {
  border-bottom: 0px solid #dfe6ec !important;
}

#deviceEquipment .el-table th.is-leaf {
  /* 去除上边框 */
  border: none;
  background-color: rgb(242, 246, 255);
  color: #000000;
}

#deviceEquipment .el-table::before {
  /* 去除下边框 */
  height: 0;
}
#deviceEquipment .div_groupTables {
  margin-top: 20px;
}
#deviceEquipment .el-cascader{
  width: 100%;
}
.app-container .el-col {
  height: calc(100vh - 190px);
}
.app-container .device-left {
  padding: 10px 22px;
  border: 1px solid #eee;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.app-container .el-tree-node__content {
  padding: 4px 20px;
}
</style>
