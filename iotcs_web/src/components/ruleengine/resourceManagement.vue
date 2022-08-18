<template>
  <div id="resourceManage">
    <el-form
      label-position="top"
      :rules="rules"
      ref="resForm"
      label-width="80px"
      :model="formTypeData"
    >
      <el-form-item label="资源类型" prop="ResourceType">
        <el-select
          v-model="formTypeData.ResourceType"
          placeholder="请选择"
          style="width:60%;"
          :disabled="isEdit"
          @change="typeClick"
        >
          <el-option
            v-for="item in resourceType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="success" style="margin-left:10px;" @click="onSubmit(true)">测试连接</el-button>
      </el-form-item>
      <el-form-item label="资源名称" prop="ResourceName">
        <el-input v-model="formTypeData.ResourceName" style="width:60%;" :readonly="isEdit"></el-input>
      </el-form-item>
    </el-form>


    <el-form
      ref="MQTTForm"
      label-width="80px"
      :inline="true"
      :rules="MQTT_rules"
      label-position="top"
      v-show="formTypeData.ResourceType === 'MQTT'"
      :model="ResourceParams"
    >
      <el-divider></el-divider>
      <el-form-item label="MQTT服务器" prop="MQTTIp" style="width:40%;">
        <el-input v-model="ResourceParams.MQTTIp" :readonly="isLook"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="MQTTPort" style="width:40%;margin-left:8%;">
        <el-input v-model="ResourceParams.MQTTPort" :readonly="isLook"></el-input>
      </el-form-item>
      <el-form-item label="MQTT用户名" prop="MQTTUid" style="width:40%;">
        <el-input v-model="ResourceParams.MQTTUid" :readonly="isLook"></el-input>
      </el-form-item>
      <el-form-item label="MQTT密码" prop="MQTTPwd" style="width:40%;margin-left:8%;">
        <el-input v-model="ResourceParams.MQTTPwd" :readonly="isLook"></el-input>
      </el-form-item>
      <el-form-item label="超时(ms)" prop="MQTTTimeout" style="width:40%;">
        <el-input v-model="ResourceParams.MQTTTimeout" :readonly="isLook"></el-input>
      </el-form-item>
    </el-form>


<el-form
      ref="WebHookForm"
      label-width="80px"
      :inline="true"
      :rules="HTTP_rules"
      label-position="top"
      v-show="formTypeData.ResourceType === 'WebHook'"
      :model="ResourceParams"
    >
      <el-divider></el-divider>
        <el-form-item label="请求方法" prop="HTTPMethod" style="width:40%;">
          <el-select
            v-model="ResourceParams.HTTPMethod"
            placeholder="请选择"
            style="width:100%;"
            :disabled="isLook"
          >
            <el-option label="Get" value="Get"></el-option>
            <el-option label="Post" value="Post"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求Url" prop="HTTPUrl" style="width:40%;margin-left:8%;">
          <el-input v-model="ResourceParams.HTTPUrl" :readonly="isLook"></el-input>
        </el-form-item>
        <el-form-item label="Content-Type" style="width:40%;">
          <el-select
            v-model="ResourceParams.ContentType"
            placeholder="请选择"
            prop="ContentType"
            style="width:100%;"
            :disabled="isLook"
          >
            <el-option label="application/json" value="application/json"></el-option>
            <el-option label="text/plain;charset=UTF-8" value="text/plain;charset=UTF-8"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="连接超时时间(ms)" prop="ConnectTimeOut" style="width:40%;margin-left:8%;">
          <el-input v-model="ResourceParams.ConnectTimeOut" :readonly="isLook"></el-input>
        </el-form-item>
        <el-form-item label="请求超时时间(ms)" prop="ReqTimeOut" style="width:40%;">
          <el-input v-model="ResourceParams.ReqTimeOut" :readonly="isLook"></el-input>
        </el-form-item>
        <el-form-item label="池大小" prop="PoolSize" style="width:40%;margin-left:8%;">
          <el-input v-model="ResourceParams.PoolSize" :readonly="isLook"></el-input>
        </el-form-item>
        <div class="_kv_box">
          <p>请求头Header</p>
          <el-table :data="ResourceParams.Headers">
            <el-table-column label="key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.key" size="mini" :readonly="isLook" @input="addHeaders(scope.$index, scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="value">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" size="mini" :readonly="isLook"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="Body" style="width:100%;">
					<el-input type="textarea" :rows="5" placeholder="请输入内容" resize="false" v-model="ResourceParams.Body">
					</el-input>
				</el-form-item>
    </el-form>
    <el-form>
      <el-form-item style="width: 200px;margin: 0 auto;" v-show="!isLook">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit(false)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  props: ["formType", "formData"],
  data() {
    return {
      isLook: false,
      isEdit: false,
      resourceType: [
        {
          value: "MQTT",
          label: "MQTT"
        },
        {
          value: "WebHook",
          label: "WebHook"
        }
      ],
      formTypeData: {},
      ResourceParams: {},
      rules: {
        ResourceType: [
          {
            required: true,
            message: "请至少选择一个资源类型",
            trigger: "blur"
          }
        ],
        ResourceName: [
          {
            required: true,
            message: "请输入资源名称",
            trigger: "blur"
          },{ min: 0, max: 50, message: '长度不能超过50字符', trigger: 'blur' }
        ]
      },
      MQTT_rules:{
        MQTTIp:[{
           required: true,
           message: "请输入IP",
           trigger: "blur"
        }],
        MQTTPort:[{
           required: true,
           message: "请输入端口",
           trigger: "blur"
        },
        { validator:this.isNum}],
        MQTTTimeout:[{
           required: true,
           message: "请输入超时时间",
           trigger: "blur"
        },
        {validator:this.isNum}]
      },
      HTTP_rules:{
        HTTPMethod:[{
          required: true,
          message: "方法不能为空",
          trigger: "blur"
        }],
        HTTPUrl:[{
           required: true,
          message: "请输入请求地址",
            trigger: "blur"
        }],
        ContentType:[{
           required: true,
          message: "请求类型不能为空",
            trigger: "blur"
        }],
        ConnectTimeOut:[{
           required: true,
           message: "请输入连接超时时间",
           trigger: "blur"
        },{validator:this.isNum}],
        ReqTimeOut:[{
           required: true,
           message: "请输入请求超时时间",
           trigger: "blur"
        },{validator:this.isNum}],
        PoolSize:[{validator:this.isNum}]
      }
    };
  },
  components: {},
  mounted() {
    this.initData();
  },
  methods: {
    typeClick(val) {
      if (val === 'MQTT') {
        if (this.ResourceParams.Headers) {
          delete this.ResourceParams.Headers
        }
      } else {
        if (!this.ResourceParams.Headers) {
          this.ResourceParams.Headers = [{
            key: '',
            value: ''
          }]
        }
      }
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
    addHeaders(idx, row) {
      if (row.key !== '' && this.ResourceParams.Headers.length === idx + 1) {
        this.ResourceParams.Headers.push({
          'key': '', 'value': ''
        })
      }
    },
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    initData() {
      if (this.formType == "look") {
        this.$nextTick(() => {
          this.isLook = true;
          this.isEdit = true;
        });
      } else if (this.formType == "edit") {
        this.$nextTick(() => {
          this.isLook = false;
          this.isEdit = true;
        });
      } else {
        this.$nextTick(() => {
          this.isLook = false;
          this.isEdit = false;
        });
        return;
      }
      this.formTypeData = {
        ResourceType: this.formData.ResourceType,
        ResourceName: this.formData.ResourceName
      };
      if (this.formData.ResourceParams) {
        this.ResourceParams = JSON.parse(this.formData.ResourceParams);
        if (this.formType == "edit" && this.formData.ResourceType === 'WebHook') {
          this.ResourceParams.Headers.push({
            key: '',
            value: ''
          })
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    onSubmit(test) {
      let returnedTarget = "";
      const p1 = new Promise((resolve, reject) => {
        this.$refs["resForm"].validate(valid => {
          if (valid) resolve();
        });
      });
      const p2 = new Promise((resolve, reject) => {
        console.log(this.formTypeData.ResourceType)
        this.$refs[this.formTypeData.ResourceType + "Form"].validate(valid => {
          if (valid) resolve();
        });
      });
      Promise.all([p1, p2]).then(() => {
        if (this.formTypeData.ResourceType === 'WebHook') {
          this.ResourceParams.Headers = this.ResourceParams.Headers.filter((item) => {
            return item.key !== ''
          })
        } else if (this.formTypeData.ResourceType === 'MQTT'){
          this.ResourceParams.MQTTUid = this.ResourceParams.MQTTUid === undefined ? '' : this.ResourceParams.MQTTUid
          this.ResourceParams.MQTTPwd = this.ResourceParams.MQTTPwd === undefined ? '' : this.ResourceParams.MQTTPwd
          this.ResourceParams.MQTTTimeout = this.ResourceParams.MQTTTimeout === undefined ? '' : this.ResourceParams.MQTTTimeout
        }
        returnedTarget = Object.assign(this.formTypeData, this.ResourceParams);
        
        if (!this.formData.Id) { 
          returnedTarget.Id = this.uuid();
        } else {
          returnedTarget.Id = this.formData.Id;
        }
        let params = {
          // DynamicResourceParams: null,
          Id: returnedTarget.Id,
          ResourceName: returnedTarget.ResourceName,
          ResourceParams: "",
          ResourceType: returnedTarget.ResourceType
        };
        delete returnedTarget.ResourceName;
        delete returnedTarget.ResourceType;
        delete returnedTarget.Id;
        params.ResourceParams = JSON.stringify(returnedTarget);
		if(test){
       console.log(this.formTypeData.ResourceType)
			this.$post("resource/data/test", params).then(res => {
			  if (res.Successful) {
			    this.$Message.success({message: "连接测试成功！", duration: 800});
			  }else{
           this.$Message.error({message: "连接测试失败！", duration: 800});
        }
			});
		}else{
			if (this.formType == "add") {
			  this.$post("resource/data/insert", params).then(res => {
			    if (res.Successful) {
			      this.$emit("closeWin", false);
				  this.$Message.success({message: "数据配置成功！", duration: 800});
			    }else{
            this.$Message.error({message:res.ErrorMessage, duration: 800});
          }
			  });
			} else {
			  this.$post("resource/data/update", params).then(res => {
			    if (res.Successful) {
			      this.$emit("closeWin", false);
				  this.$Message.success({message: "数据配置成功！", duration: 800});
			    }else{
            this.$Message.error({message:res.ErrorMessage, duration: 800});
          }
			  });
			}
		}
      });
    },
    onCancel() {
      this.$emit("closeWin", false);
    }
  }
};
</script>
<style>
._kv_box .el-table{
  margin-bottom: 20px;
  padding: 10px 0;
  background: #EEE;
}._kv_box > p {
  padding-bottom: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
}
._kv_box .el-table td, ._kv_box .el-table th{
  padding: 4px 0;
  background: #EEE;
}
/* ._kv_box .el-input__inner{
  border: unset;
} */
</style>
