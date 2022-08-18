<template>
	<div class="div_group">
		<!-- <el-button size="small" icon="el-icon-plus" title="添加" @click="addDeviceGroup">添加设备组
		</el-button> -->
		<el-button size="small" icon="el-icon-plus" title="添加" @click="addDevice">添加设备
		</el-button>
		<div class="div_groupTables">
			<el-table ref="multipleTable" highlight-current-row :data="groupList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
				tooltip-effect="dark" style="width: 100%; height: 97%"
				:default-sort="{ prop: 'date', order: 'descending' }" 
				border
				size="mini"
   			    default-expand-all
				row-key="Id"
    			:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
				 @row-click="selectRow" :row-style="rowStyle">
				<!-- <el-table-column type="index" label="序号" sortable width="80"></el-table-column> -->
				<el-table-column prop="DeviceName" label="名称"></el-table-column>
				<el-table-column prop="Topic" label="Topic"></el-table-column>
				<!-- <el-table-column prop="DriveType" label="驱动类型"></el-table-column> -->
				<el-table-column prop="Duration" label="采集周期"  :formatter="convertDuration"></el-table-column>
				<el-table-column prop="DriveName" label="驱动名称"></el-table-column>
				<el-table-column prop="InUse" label="启用" :formatter="convertInUse" ></el-table-column>
				<el-table-column prop="Description" label="描述"></el-table-column>
				<el-table-column prop="CreaterBy" label="创建者" width="100"></el-table-column>
				<el-table-column prop="CreateTime" label="创建时间" sortable width="180"></el-table-column>
				<el-table-column fixed="right" label="设备参数" width="120" align="center">
					<template slot-scope="scope" >
						<el-button type="text" @click="handleDeviceConfig(scope.$index, scope.row)" v-if="scope.row.ParentId =='' || scope.row.ParentId== null"  icon="el-icon-edit" size="mini" style="color: rgb(64,158,255);">详情</el-button>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="240" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="addDeviceGroup(scope.$index, scope.row)" v-if="scope.row.ParentId =='' || scope.row.ParentId== null"  icon="el-icon-circle-plus-outline" size="mini" style="color: green; font-size:14px">新增Group</el-button>
						<el-button type="text" @click="handleEdit(scope.$index, scope.row)"   icon="el-icon-edit" size="mini" style="color: rgb(64,158,255); font-size:14px">编辑</el-button>
						<el-button type="text" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" size="mini" style="color: rgb(247,137,137); font-size:14px">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="currentPage" :page-sizes="[5, 10, 20, 40]" :page-size="pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="groupList.length">
			</el-pagination> -->
		</div>

		<!-- 设备组 -->
		<el-dialog :visible.sync="dialogDeviceGroupVisible" v-dialogdrag :append-to-body="true"  width="520px"
			:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
			v-if="dialogDeviceGroupVisible">
			<div slot="title" class="header-title">
				<span v-html="dialogTitle"></span>
			</div>
			<el-form :model="formData" :rules="rules" label-position="left" ref="formDeviceGroup" label-width="120px"
				style="margin: 0 30px;" class="demo-form">
				
				<el-form-item label="Group名称" prop="DeviceName">
					<el-input v-model="formData.DeviceName" ></el-input>
				</el-form-item>
				<el-form-item label="采集周期(ms)" prop="Duration">
					<el-input v-model="formData.Duration" ></el-input>
				</el-form-item>
				<el-form-item label="Topic" prop="Topic"> 
					<el-input v-model="formData.Topic" ></el-input>
				</el-form-item>
				<el-form-item label=" 描述" prop="Description">
					<el-input v-model="formData.Description" ></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitGroup('formDeviceGroup')">确定</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>




		<el-dialog :visible.sync="dialogFormVisible" v-dialogdrag :append-to-body="true"  width="520px"
			:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
			v-if="dialogFormVisible">
			<div slot="title" class="header-title">
				<span v-html="dialogTitle"></span>
			</div>
			<el-form :model="formData" :rules="rules" label-position="left" ref="formDevice" label-width="120px"
				style="margin: 0 30px;" class="demo-form">
				<!-- <el-form-item label="父级" prop="ParentId">
					<el-select v-model="formData.ParentId" placeholder="请选择" style="width:100%">
						<el-option v-for="item in DeviceGroup" :key="item.Id" :label="item.DeviceGroupName"
							:value="item.Id"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="设备名称" prop="DeviceName">
					<el-input v-model="formData.DeviceName" ></el-input>
				</el-form-item>
				
				<el-form-item label="驱动名称" prop="DriveId">
					<el-select v-model="formData.DriveId" placeholder="请选择" style="width:100%">
						<el-option v-for="item in DrivesName" :key="item.Id" :label="item.DriveName"
							:value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="描述" prop="Description">
					<el-input v-model="formData.Description" ></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="InUse">
					<el-switch style="display: block" v-model="formData.InUse" active-color="#13ce66" inactive-color="#ff4949"
						active-text="启用" :active-value=1 :inactive-value=0 inactive-text="关闭">
					</el-switch>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('formDevice')">确定</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- OPC设备参数设置 -->
		<el-dialog :visible.sync="dialogOpcDeviceConfigVisible" v-dialogdrag :append-to-body="true"  width="520px"
			:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
			>
			<div slot="title" class="header-title">
				<span v-html="dialogTitle"></span>
			</div>
			<el-form :model="opcDeviceConfig"  :rules="rules" label-position="left" ref="formOpcDeviceConfig" label-width="120px"
				style="margin: 0 30px;" class="demo-form">
				
				<el-form-item label="OPC地址" prop="OPCAddr">
					<el-input v-model="opcDeviceConfig.OPCAddr"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitConfigForm('formOpcDeviceConfig')">确定</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>


		<!-- SIEMENS-S7 -->
		<el-dialog :visible.sync="dialogSIEMENSS7DeviceConfigVisible" v-dialogdrag :append-to-body="true"  width="520px"
			:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
			>
			<div slot="title" class="header-title">
				<span v-html="dialogTitle"></span>
			</div>
			<el-form :model="SIEMENSS7DeviceConfig"  :rules="rules" label-position="left" ref="formSIEMENSS7DeviceConfig" label-width="120px"
				style="margin: 0 30px;" class="demo-form">
				
				<el-form-item label="IP地址" prop="IPAddress">
					<el-input v-model="SIEMENSS7DeviceConfig.IPAddress"></el-input>
				</el-form-item>
				<el-form-item label="端口" prop="Port">
					<el-input v-model="SIEMENSS7DeviceConfig.Port"></el-input>
				</el-form-item>
				<el-form-item label="卡槽" prop="SLOT">
					<el-input v-model="SIEMENSS7DeviceConfig.SLOT"></el-input>
				</el-form-item>
				<el-form-item label="超时时间" prop="TimeOut">
					<el-input v-model="SIEMENSS7DeviceConfig.TimeOut"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitSIEMENSS7ConfigForm('formSIEMENSS7DeviceConfig')">确定</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- ModBus设备参数设置 -->
		<el-dialog :visible.sync="dialogModBusTcpDeviceConfigVisible" v-dialogdrag :append-to-body="true"  width="520px"
			:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
			>
			<div slot="title" class="header-title">
				<span v-html="dialogTitle"></span>
			</div>
			<el-form :model="modbusTcpUdpDeviceConfig"  :rules="rules" label-position="left" ref="formModBusTcpDeviceConfig" label-width="120px"
				style="margin: 0 30px;" class="demo-form">
				
				<el-form-item label="名称" prop="Name">
					<el-input v-model="modbusTcpUdpDeviceConfig.Name"></el-input>
				</el-form-item>
				<el-form-item label="Host" prop="Host">
					<el-input v-model="modbusTcpUdpDeviceConfig.Host"></el-input>
				</el-form-item>
				<el-form-item label="Port" prop="Port">
					<el-input v-model="modbusTcpUdpDeviceConfig.Port"></el-input>
				</el-form-item>
				<el-form-item label="超时(ms)" prop="TimeOut">
					<el-input v-model="modbusTcpUdpDeviceConfig.TimeOut"></el-input>
				</el-form-item>
				<el-form-item label="方法" prop="Method">
					<el-select v-model="modbusTcpUdpDeviceConfig.Method">
						<el-option v-for="item in modbusTcpUdpMethods" :key="item.name" :label="item.name"
							:value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="ByteOrder" prop="ByteOrder">
					<el-input v-model="modbusTcpUdpDeviceConfig.ByteOrder"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitModBusTcpUdpConfigForm('formModBusTcpDeviceConfig')">确定</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- ModBus_Rtu设备参数设置 -->
		<el-dialog :visible.sync="dialogModBusRTUDeviceConfigVisible" v-dialogdrag :append-to-body="true"  width="520px"
			:modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false"
			>
			<div slot="title" class="header-title">
				<span v-html="dialogTitle"></span>
			</div>
			<el-form :model="modbusRTUDeviceConfig"  :rules="rules" label-position="left" ref="formModBusRTUDeviceConfig" label-width="120px"
				style="margin: 0 30px;" class="demo-form">
				
				<el-form-item label="名称" prop="Name">
					<el-input v-model="modbusRTUDeviceConfig.Name"></el-input>
				</el-form-item>
				<el-form-item label="Port" prop="Port">
					<el-input v-model="modbusRTUDeviceConfig.Port"></el-input>
				</el-form-item>
				<el-form-item label="Baudrate" prop="Baudrate">
					<el-input v-model="modbusRTUDeviceConfig.Baudrate"></el-input>
				</el-form-item>
				<el-form-item label="StopBits" prop="StopBits">
					<el-input v-model="modbusRTUDeviceConfig.StopBits"></el-input>
				</el-form-item>
				<el-form-item label="ByteSizes" prop="ByteSizes">
					<el-select v-model="modbusRTUDeviceConfig.ByteSizes">
						<el-option v-for="item in modbusRTUByteSizes" :key="item.name" :label="item.name"
							:value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Parity" prop="Parity">
					<el-select v-model="modbusRTUDeviceConfig.Parity">
						<el-option v-for="item in modbusRTUParity" :key="item.name" :label="item.name"
							:value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Strict" prop="Strict">
					<el-input v-model="modbusRTUDeviceConfig.Strict"></el-input>
				</el-form-item>
				<el-form-item label="超时(ms)" prop="TimeOut">
					<el-input v-model="modbusRTUDeviceConfig.TimeOut"></el-input>
				</el-form-item>
				<el-form-item label="方法" prop="Method">
					<el-select v-model="modbusRTUDeviceConfig.Method">
						<el-option v-for="item in modbusRTUMethods" :key="item.name" :label="item.name"
							:value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="ByteOrder" prop="ByteOrder">
					<el-input v-model="modbusRTUDeviceConfig.ByteOrder"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitModBusRTUConfigForm('formModBusRTUDeviceConfig')">确定</el-button>
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
				currentPage: 1, //初始页
				pagesize: 10, //    每页的数据
				equipmentInfo_visible: false,
				equipmentList: [],
				spotList: [],
				groupList: [],
				dialogFormVisible: false,
				dialogDeviceGroupVisible:false,
				dialogOpcDeviceConfigVisible:false,
				dialogModBusTcpDeviceConfigVisible:false,
				dialogModBusRTUDeviceConfigVisible:false,
				dialogSIEMENSS7DeviceConfigVisible:false,
				deivceGroupInfo:{
					ParentId:''
				},
				dialogTitle: "",
				opcDeviceConfig:{
					OPCAddr:""
				},
				modbusTcpUdpDeviceConfig:{
					Name:"",
					Host:"",
					Port:"",
					TimeOut:"",
					Method:"",
					ByteOrder:""
				},
				modbusRTUDeviceConfig:{
					Name:"",
					Method:"",
					Port:"",
					Baudrate:"",
					StopBits:"",
					ByteSizes:"",
					Parity:"",
					Strict:"",
					TimeOut:"",
					ByteOrder:""
				},
				SIEMENSS7DeviceConfig:{
					IPAddress:"",
					Port:"",
					SLOT:"",
					TimeOut:""
				},
				formData: {
					Id:"",
					Topic: "",
					DeviceName: "",
					Description:"",
					DriveId: "",
					DriveType: "",
					DeviceType:"",
					ParentId:""
				},
				modbusTcpUdpMethods:[
					{name:"Socket"},{name:"RTU"}
				],
				modbusRTUMethods:[{name:"RTU"},{name:"Ascii"}],
				modbusRTUByteSizes:[{name:"5"},{name:"6"},{name:"7"},{name:"8"}],
				modbusRTUParity:[{name:"E"},{name:"O"},{name:"N"}],
				formType: "",
				rules: {
					Topic: [{
						required: true,
						message: "Topic不能为空",
						trigger: "blur"
					},{ min: 0, max: 50, message: '长度不能超过50字符', trigger: 'blur' }],
					DeviceName: [{
						required: true,
						message: "名称不能为空",
						trigger: "blur"
					},{ min: 0, max: 50, message: '长度不能超过50字符', trigger: 'blur' }],
					ParentId: [{
						required: true,
						message: "父级不能为空",
						trigger: "blur"
					}],
					DriveId: [{
						required: true,
						message: "驱动不能为空",
						trigger: "blur"
					}],
					OPCAddr: [{
						required: true,
						message: "驱动地址不能为空",
						trigger: "blur"
					},{ min: 0, max: 500, message: '长度不能超过500字符', trigger: 'blur' }],
					Duration:[{
						required: true,
						message: "周期不能为空",
						trigger: "blur"
					},{validator:this.isNum}],
					Description:[{
						required:false
						
					}]
				},
				DrivesType: [{
						key: "OPC",
						value: "OPC"
					},
					{
						key: "PLC",
						value: "PLC"
					}
				],
				form: {
					name: "",
					address: "",
					region: "",
					collectCycle: ""
				},
				dialogVisible: false,
				restaurants: [],
				state: "",
				DrivesName: [],
				DeviceGroup:[]
			};
		},
		mounted() {},
		components: {
			EditableCell
		},
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
			isNum (rule, value, callback)  {
              console.log(value)
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
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				console.log(this.currentPage) //点击第几页
			},

			getDeviceGroup(){
				if(this.DeviceGroup.length == 0){
						this.$get("device/data/getDeviceGroup").then(res => {
							if (res.Successful) {
								if (res.Data) {
									res.Data.forEach(item => {
										this.DeviceGroup.push({
											DeviceGroupName: item.DeviceName,
											Id: item.Id
										});
									});
								}
							} else {
								this.$Message.error({message:res.ErrorMessage, duration: 800});
							}
						});
				}
			},


			getAllData() {
				console.log(this.equipmentList);
			},
			handlerNode(data) {
				this.spotList = data.spotList;
			},
			save(data) {
				//保存设备节点
				if (this.$trim(data.label)) {
					data.showInput = false;
				} else {
					this.$msgbox.alert("设备名称不能为空！", "提示", {
						confirmButtonText: "确定",
						callback: action => {}
					});
				}
			},
			edit(data) {
				//编辑设备节点
				data.showInput = true;
			},
			/**
			 * 添加设备和点位节点
			 * @param data
			 * @param data 被添加的节点对象
			 * @param
			 */
			append(data) {
				if (data.id == "0") {
					//添加设备
					let id = this.getUUID();
					const newChild = {
						id: id,
						label: "",
						showInput: true,
						spotList: []
					};
					if (!data.children) {
						this.$set(data, "children", []);
					}
					data.children.push(newChild);
				} else {
					//添加点位

					let Index = this.ArrHasObj(this.equipmentList[0].children, data);
					if (Index !== -1) {
						console.log(this.equipmentList[0].children[Index]);
						this.equipmentList[0].children[Index].spotList.push({
							id: data.id,
							label: data.label,
							NodeInfo: "",
							NodeId: "",
							doitdata: "",
							doitstatus: ""
						});
						this.spotList = this.equipmentList[0].children[Index].spotList;
					}
				}
			},

			remove(node, data) {
				const parent = node.parent;
				const children = parent.data.children || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				children.splice(index, 1);
				this.spotList = [];
			},

			//获得焦点
			focus(event) {
				// console.log(event);
				event.currentTarget.select();
			},
			//修改功能   inp
			inp(value, data) {
				data.label = value;
			},
			//失去焦点后
			alters(node, data) {
				console.log(data.label);
				data.showInput = !data.showInput;
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

			ArrHasObj(Arr, obj) {
				let index = -1;
				Arr.forEach((item, ind) => {
					if (item.id == obj.id) {
						index = ind;
					}
				});
				return index;
			},

			remove_Diot(raw) {
				let Index = this.ArrHasObj(this.equipmentList[0].children, raw);
				if (Index !== -1) {
					let index = this.equipmentList[0].children[Index].spotList.indexOf(raw);
					this.equipmentList[0].children[Index].spotList.splice(index, 1);
					this.spotList = this.equipmentList[0].children[Index].spotList;
				}
			},
			openEquipmentInfo(data) {
				// console.log(data)
				this.equipmentList = [];
				this.equipmentInfo_visible = true;
				this.equipmentList.push({
					id: "0",
					label: data.GroupName,
					showInput: false,
					children: []
				});
				let id = this.getUUID();
				const newChild = {
					id: id,
					label: data.equipment,
					showInput: false,
					spotList: []
				};

				this.equipmentList[0].children.push(newChild);
				this.spotList = [];
			},
			addGroup(index,row){

			},
			handleEdit(index, row) {
				this.formData = row;
				this.formType = "edit";
				this.dialogTitle = "编辑分组";
				if(row.DeviceType == 1){
					this.dialogDeviceGroupVisible = true;
				}else{
					this.dialogFormVisible = true;
				}
				//this.getDriveData();
				this.getDeviceGroup();
			},
			handleDeviceConfig(index,row){
				this.dialogTitle = "设备参数配置";
				// this.opcDeviceConfig={};
				//查询配置数据
				this.$post("device/config/getDeviceConfig",{DeviceId:row.Id}).then(res=>{
					if(res.Successful){
						if(res.Data.DriveType == "OPCUA"){
							this.dialogOpcDeviceConfigVisible = true;

							if(res.Data.ConfigJson == null){
								this.opcDeviceConfig.Id="";
								this.opcDeviceConfig.DeviceId=row.Id;
								this.opcDeviceConfig.OPCAddr="";
								this.opcDeviceConfig.Duration="";
								this.formType = "add";
							}else{
								this.opcDeviceConfig= JSON.parse(res.Data.ConfigJson);
								this.opcDeviceConfig.Id=res.Data.Id;
								this.opcDeviceConfig.DeviceId= res.Data.DeviceId;
								this.formType = "edit";
							}
						}else if(res.Data.DriveType == "ModbBus-TCP/UDP"){
								this.dialogModBusTcpDeviceConfigVisible = true;
							if(res.Data.ConfigJson == null){
								this.modbusTcpUdpDeviceConfig.Id="";
								this.modbusTcpUdpDeviceConfig.DeviceId=row.Id;
								this.modbusTcpUdpDeviceConfig.Name="";
								this.modbusTcpUdpDeviceConfig.Host="";
								this.modbusTcpUdpDeviceConfig.Port="";
								this.modbusTcpUdpDeviceConfig.TimeOut="";
								this.modbusTcpUdpDeviceConfig.Method="";
								this.modbusTcpUdpDeviceConfig.ByteOrder="";
								this.formType = "add";
							}else{
								this.modbusTcpUdpDeviceConfig= JSON.parse(res.Data.ConfigJson);
								this.modbusTcpUdpDeviceConfig.Id=res.Data.Id;
								this.modbusTcpUdpDeviceConfig.DeviceId= res.Data.DeviceId;
								this.formType = "edit";
							}
						}else if(res.Data.DriveType == "ModbBus-Serial"){
							this.dialogModBusRTUDeviceConfigVisible = true;
							if(res.Data.ConfigJson == null){
								this.modbusRTUDeviceConfig.Id="";
								this.modbusRTUDeviceConfig.DeviceId=row.Id;
								this.modbusRTUDeviceConfig.Name="";
								this.modbusRTUDeviceConfig.Baudrate="";
								this.modbusRTUDeviceConfig.StopBits="";
								this.modbusRTUDeviceConfig.ByteSizes="";
								this.modbusRTUDeviceConfig.Parity="";
								this.modbusRTUDeviceConfig.Strict="";
								this.modbusRTUDeviceConfig.Port="";
								this.modbusRTUDeviceConfig.TimeOut="";
								this.modbusRTUDeviceConfig.Method="";
								this.modbusRTUDeviceConfig.ByteOrder="";
								this.formType = "add";
							}else{
								this.modbusRTUDeviceConfig= JSON.parse(res.Data.ConfigJson);
								this.modbusRTUDeviceConfig.Id=res.Data.Id;
								this.modbusRTUDeviceConfig.DeviceId= res.Data.DeviceId;
								this.formType = "edit";
							}
						}else if(res.Data.DriveType == "SIEMENS-S7"){
							this.dialogSIEMENSS7DeviceConfigVisible = true;
							if(res.Data.ConfigJson == null){
								this.SIEMENSS7DeviceConfig.Id="";
								this.SIEMENSS7DeviceConfig.DeviceId=row.Id;
								this.SIEMENSS7DeviceConfig.IPAddress="";
								this.SIEMENSS7DeviceConfig.Port="";
								this.SIEMENSS7DeviceConfig.SLOT="";
								this.SIEMENSS7DeviceConfig.TimeOut="";
								this.formType = "add";
							}else{
								this.SIEMENSS7DeviceConfig= JSON.parse(res.Data.ConfigJson);
								this.SIEMENSS7DeviceConfig.Id=res.Data.Id;
								this.SIEMENSS7DeviceConfig.DeviceId= res.Data.DeviceId;
								this.formType = "edit";
							}
						}
					}

				})
			},


			handleDelete(index, row) {
				this.$confirm("确定删除设备，删除设备会同步删除设备配置及变量?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						closeOnClickModal: false
					})
					.then(() => {
						this.$post("device/data/delete", {
							Id: row.Id
						}).then(res => {
							if (res.Successful) {
								this.initData();
								this.DeviceGroup= [];
								this.$Message.success({message: "数据配置成功！", duration: 800});
							} else {
							}
						});
					})
					.catch(() => {});
			},
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			querySearch() {},
			getCommitObj() {},
			getTypeIcon() {},

			handleSelectInput() {},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ?
					restaurants.filter(this.createFilter(queryString)) :
					restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
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
			convertInUse(row,column){
				if(row.DeviceType == 1){
					return '';
				}
				if(row.InUse == 0){
					return "否";
				}else{
					return "是";
				}
			},
			convertDuration(row,column){
				if(row.DeviceType == 0){
					return '';
				}
				return row.Duration;
			},
			submitConfigForm(formName){
				this.$refs[formName].validate(valid => {
					if (valid) {
					if(this.formType == "add"){

					this.$post("device/config/insert",{Id:this.getUUID(),
													DeviceId:this.opcDeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({OPCAddr:this.opcDeviceConfig.OPCAddr,Duration:this.opcDeviceConfig.Duration})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});

				}else{
							this.$post("device/config/update",{Id:this.opcDeviceConfig.Id,
													DeviceId:this.opcDeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({OPCAddr:this.opcDeviceConfig.OPCAddr,Duration:this.opcDeviceConfig.Duration})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});
				}
					}
								
				})
			},


			submitModBusTcpUdpConfigForm(formName){
				this.$refs[formName].validate(valid => {
					if (valid) {
					if(this.formType == "add"){
					this.$post("device/config/insert",{Id:this.getUUID(),
													DeviceId:this.modbusTcpUdpDeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({Name:this.modbusTcpUdpDeviceConfig.Name,
																			   Host:this.modbusTcpUdpDeviceConfig.Host,
																			   Port:this.modbusTcpUdpDeviceConfig.Port,
																			   TimeOut:this.modbusTcpUdpDeviceConfig.TimeOut,
																			   Method:this.modbusTcpUdpDeviceConfig.Method,
																			   ByteOrder:this.modbusTcpUdpDeviceConfig.ByteOrder})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});

				}else{
							this.$post("device/config/update",{Id:this.modbusTcpUdpDeviceConfig.Id,
													DeviceId:this.modbusTcpUdpDeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({Name:this.modbusTcpUdpDeviceConfig.Name,
																			   Host:this.modbusTcpUdpDeviceConfig.Host,
																			   Port:this.modbusTcpUdpDeviceConfig.Port,
																			   TimeOut:this.modbusTcpUdpDeviceConfig.TimeOut,
																			   Method:this.modbusTcpUdpDeviceConfig.Method,
																			   ByteOrder:this.modbusTcpUdpDeviceConfig.ByteOrder})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});
				}
					}
								
				})
			},


			submitSIEMENSS7ConfigForm(formName){
				this.$refs[formName].validate(valid => {
					if (valid) {
					if(this.formType == "add"){
					this.$post("device/config/insert",{Id:this.getUUID(),
													DeviceId:this.SIEMENSS7DeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({IPAddress:this.SIEMENSS7DeviceConfig.IPAddress,
																			   Port:this.SIEMENSS7DeviceConfig.Port,
																			   TimeOut:this.SIEMENSS7DeviceConfig.TimeOut,
																			   SLOT:this.SIEMENSS7DeviceConfig.SLOT})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});

				}else{
							this.$post("device/config/update",{Id:this.SIEMENSS7DeviceConfig.Id,
													DeviceId:this.SIEMENSS7DeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({IPAddress:this.SIEMENSS7DeviceConfig.IPAddress,
																			   Port:this.SIEMENSS7DeviceConfig.Port,
																			   TimeOut:this.SIEMENSS7DeviceConfig.TimeOut,
																			   SLOT:this.SIEMENSS7DeviceConfig.SLOT})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});
				}
					}
								
				})
			},



			submitModBusRTUConfigForm(formName){
				this.$refs[formName].validate(valid => {
					if (valid) {
					if(this.formType == "add"){
					this.$post("device/config/insert",{Id:this.getUUID(),
													DeviceId:this.modbusRTUDeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({Name:this.modbusRTUDeviceConfig.Name,
																			   Baudrate:this.modbusRTUDeviceConfig.Baudrate,
																			   StopBits:this.modbusRTUDeviceConfig.StopBits,
																			   ByteSizes:this.modbusRTUDeviceConfig.ByteSizes,
																			   Parity:this.modbusRTUDeviceConfig.Parity,
																			   Strict:this.modbusRTUDeviceConfig.Strict,
																			   Port:this.modbusRTUDeviceConfig.Port,
																			   TimeOut:this.modbusRTUDeviceConfig.TimeOut,
																			   Method:this.modbusRTUDeviceConfig.Method,
																			   ByteOrder:this.modbusRTUDeviceConfig.ByteOrder})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});

				}else{
							this.$post("device/config/update",{Id:this.modbusTcpUdpDeviceConfig.Id,
													DeviceId:this.modbusTcpUdpDeviceConfig.DeviceId,
													ConfigJson:JSON.stringify({Name:this.modbusTcpUdpDeviceConfig.Name,
																			   Host:this.modbusTcpUdpDeviceConfig.Host,
																			   Port:this.modbusTcpUdpDeviceConfig.Port,
																			   TimeOut:this.modbusTcpUdpDeviceConfig.TimeOut,
																			   Method:this.modbusTcpUdpDeviceConfig.Method,
																			   ByteOrder:this.modbusTcpUdpDeviceConfig.ByteOrder})}).then(res => {
								if (res.Successful) {
									//this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});
				}
					}
								
				})
			},
			submitGroup(formName){
				this.$refs[formName].validate(valid => {
						if (valid) {
							if (this.formType == "add") 
							{
								this.formData.Id = this.getUUID();
								this.formData.ParentId = this.deivceGroupInfo.ParentId;
								this.formData.DeviceType=1;
								this.$post("device/data/insert", this.formData).then(res => {
									if (res.Successful) {
										this.initData();
										this.closeDialog(); 
										this.$Message.success({message: "数据配置成功！", duration: 800});
									} else {
										this.$Message.error({message:res.ErrorMessage, duration: 800});
									}
								});
							}
							else
							{
								this.$post("device/data/update", this.formData).then(res => {
									if (res.Successful) {
										this.initData();
										this.closeDialog(); 
										this.$Message.success({message: "数据配置成功！", duration: 800});
									} else {
										this.$Message.error({message:res.ErrorMessage, duration: 800});
									}
								});

							}
						}
				})
			},
			submitForm(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.DrivesName.forEach(item => {
							if (item.DriveId == this.formData.DriveId) {
								this.formData.DriveName = item.DriveName;
							}
						});

						if (this.formType == "add") {
							this.formData.Id = this.getUUID();
							this.formData.DeviceType=0;

							this.$post("device/data/insert", this.formData).then(res => {
								if (res.Successful) {
									this.initData();
									this.closeDialog(); 
									this.$Message.success({message: "数据配置成功！", duration: 800});
								} else {
									this.$Message.error({message:res.ErrorMessage, duration: 800});
								}
							});
						} else {
							this.$post("device/data/update", this.formData).then(res => {
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			closeDialog() {
				this.dialogFormVisible = false;
				this.dialogDeviceGroupVisible =false;
				this.dialogOpcDeviceConfigVisible = false;
				this.dialogModBusTcpDeviceConfigVisible = false;
				this.dialogModBusRTUDeviceConfigVisible = false;
				this.dialogSIEMENSS7DeviceConfigVisible = false;
			},
			closeDeviceGroupDialog(){
				this.dialogOpcDeviceConfigVisible = false;
			},
			closeOpcDeviceConfigDialog(){
				this.dialogOpcDeviceConfigVisible = false;
			},
			addDevice() {
				this.formData = {};
				this.formType = "add";
				this.dialogTitle = "创建设备";
				this.dialogFormVisible = true;
				this.getDeviceGroup();
			},
			addDeviceGroup(index,row) {
				this.formData = {};
				this.formType = "add";
				this.dialogTitle = "新建Group";
				this.deivceGroupInfo.ParentId = row.Id;
				this.dialogDeviceGroupVisible = true;
			},
			initData() {
				this.$get("device/data/getAllDevice").then(res => {
					if (res.Successful) {
						this.groupList = res.Data;
						console.log(this.groupList);
						this.groupList.forEach(item=>{
							item.children = item.Childrens;
						})
						console.log(this.groupList)
					} else {
						this.$Message.error({message:res.ErrorMessage, duration: 800});
					}
				});

				this.$get("drive/data/getAllDrive").then(res => {
					if (res.Successful) {
						this.DrivesName = res.Data;
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
	.div_group .el-dialog {
		width: 50%;
	}

	.el-tree--highlight-current .el-tree-node.is-checked>.el-tree-node__content {
		background-color: rgb(255, 255, 255);
		color: rgb(64, 158, 255);
	}

	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
		background-color: rgb(255, 255, 255);
		color: rgb(64, 158, 255);
	}

	.el-tree-node__content {
		margin: 5px 0px;
		padding: 5px 20px;
	}

	.custom-tree-node span {
		font-size: 18px;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding: 8px;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.div_group {
		height: 100%;
		background-color: #FFF;
	}

	.div_group .el-dialog {
		width: 80%;
	}

	.div_opcuaOpration {
		padding: 4px 10px;
		height: 40px;
		box-sizing: border-box;
	}

	.div_groupTables {
		margin-top: 20px;
		height: calc(100% - 60px);
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

	div.el-select {
		width: 100%;
	}
	
	/* 删除单元格底部横线 */
	.div_group ::v-deep .el-table td {
		border-bottom: 0px solid #dfe6ec !important;
	}
	
	.div_group>>>.el-table th.is-leaf {
		/* 去除上边框 */
		border: none;
		background-color: rgb(242, 246, 255);
		color: #000000;
	}
	
	.div_group>>>.el-table::before {
		/* 去除下边框 */
		height: 0;
	}

</style>
