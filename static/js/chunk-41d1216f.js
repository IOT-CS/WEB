(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-41d1216f"],{"6a04":function(t,e,r){"use strict";r("d58b")},"9a42":function(t,e,r){"use strict";r.r(e);r("8e6e"),r("456d");var o=r("ade3"),a=(r("ac6a"),r("c5f6"),r("2f62"));function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,o)}return r}var i={components:{},data:function(){return{currentPage:1,pagesize:10,colors:[{color:"#5cb87a",percentage:20},{color:"#6f7ad3",percentage:40},{color:"#1989fa",percentage:60},{color:"#e6a23c",percentage:80},{color:"#f56c6c",percentage:100}],groupList:[],socket:"",Performance:{AvailableMemory:0,CpuRate:0,Memory:0,MemoryRate:0,UnAvMeRate:0},Connections:[],ResourceType:"HTML",resourceType:[{value:"HTML",label:"HTML"},{value:"CSS",label:"CSS"},{value:"JavaScript",label:"JavaScript"}],title:"",xRows:[],allData:[],lineTitle:[],colorArr:["#435ae5","#cc9d1f","#835aa9"]}},mounted:function(){var t=this;this.socket=new this.$socket(WGURL.ws,WGURL.wsPort),console.log(this.socket),this.socket.createConnection(),this.socket.update=function(e){var r=e.Performance;t.Performance.AvailableMemory=Number((r.AvailableMemory/1024/1024/1024).toFixed(2)),t.Performance.Memory=(r.Memory/1024/1024/1024).toFixed(2),t.Performance.CpuRate=Number((100*r.CpuRate).toFixed(2)),t.Performance.MemoryRate=Number(((r.Memory-r.AvailableMemory)/r.Memory*100).toFixed(2)),t.Performance.UnAvMeRate=Number((r.AvailableMemory/r.Memory*100).toFixed(2));var o=e.Connections;t.Connections=[],o.forEach((function(e){t.Connections.push({ConnectTime:t.transformTimestamp(e.ConnectTime),IsConnected:1==e.IsConnected?"已连接":"已断开",OpcName:e.OpcName,OpcUrl:e.OpcUrl})}))},this.initGroupData()},computed:function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach((function(e){Object(o.a)(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},Object(a.b)(["getInfo"])),methods:{AvailableMemory:function(t){return"可用内存："+this.Performance.AvailableMemory+" Gb"},Memory:function(t){return"总内存："+this.Performance.Memory+" Gb"},transformTimestamp:function(t){var e=new Date(t).getTime(),r=new Date(e);return r.getFullYear()+"-"+((r.getMonth()+1<10?"0"+(r.getMonth()+1):r.getMonth()+1)+"-")+((r.getDate()<10?"0"+r.getDate():r.getDate())+"  ")+((r.getHours()<10?"0"+r.getHours():r.getHours())+":")+(r.getMinutes()<10?"0"+r.getMinutes():r.getMinutes())},convertInUse:function(t,e){return 0==t.DeviceType?"":0==t.InUse?"否":"是"},initGroupData:function(){var t=this;this.$get("device/data/getAllDevice").then((function(e){e.Successful&&(t.groupList=e.Data,t.groupList.forEach((function(t){t.children=t.Childrens})),console.log(t.groupList))}))},chartInit:function(){var t=this.$echarts.init(document.getElementById("linesChart")),e=["已接收","成功处理","异常数据"];t.setOption({title:{text:this.title,textStyle:{color:"#00ce7d"},top:20},tooltip:{trigger:"axis",appendToBody:!0,axisPointer:{type:"shadow"},textStyle:{fontSize:14,color:"#fff"},backgroundColor:"rgb(50,115,242)",formatter:function(t,r,o){try{return e[0]+"："+t[0].value+" <br/>"+e[1]+"："+t[1].value+" <br/>"+e[2]+"："+t[2].value}catch(t){return""}}},legend:{data:this.lineTitle,textStyle:{color:"#00ce7d",fontStyle:"normal",fontFamily:"微软雅黑",fontSize:16},left:20,top:30},grid:{top:"bottom",left:"center",width:"90%",height:"75%",containLabel:!0},axisPointer:{show:!0,type:"line",label:{show:!1}},xAxis:[{type:"category",data:this.xRows,axisLine:{lineStyle:{color:"rgba(255,255,0,0.8)"}},splitLine:{lineStyle:{color:"rgba(0,255,255,0.8)"}},axisLabel:{interval:0,rotate:40,textStyle:{color:"#000",fontSize:14}},axisTick:{show:!0,alignWithLabel:!0,inside:!0}}],yAxis:[{type:"value",axisLine:{lineStyle:{color:"#00ce7d"}},splitLine:{show:!1},axisLabel:{textStyle:{color:"#000",fontSize:14},formatter:function(t){return t+""}},axisTick:{show:!0,alignWithLabel:!0,inside:!0}}],series:this.allData}),window.addEventListener("resize",(function(){t.resize()}))},subLogEdit:function(t,e){this.$router.push({path:"/log/subscribe",query:{topic:e.Topic}})},reloadConfig:function(){var t=this;this.$confirm("确定重新加载配置数据?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",closeOnClickModal:!1}).then((function(){t.$post("config/data/publish").then((function(e){e.Successful?t.$Message.success({message:"加载成功",duration:800}):t.$Message.error({message:"加载失败",duration:800})}))})).catch((function(){}))}}},s=(r("6a04"),r("2877")),l=Object(s.a)(i,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("el-row",{attrs:{gutter:20}},[r("el-col",{attrs:{span:12}},[r("div",{staticClass:"grid-content cont-top cont-left-top"},[r("div",{staticClass:"chartTitle"},[r("i",{staticClass:"ti"}),t._v("服务器性能")]),r("el-row",{attrs:{gutter:5}},[r("el-col",{attrs:{span:12}},[r("div",{staticClass:"grid-content"},[r("div",{attrs:{id:"gauge1"}}),r("div",{staticStyle:{"text-align":"center",position:"absolute",bottom:"76px",left:"0",right:"0"}},[r("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-refresh-right"},on:{click:t.reloadConfig}},[t._v("重载服务配置数据")])],1)])]),r("el-col",{attrs:{span:12}},[r("div",{staticClass:"grid-content"},[r("div",{attrs:{id:"gauge2"}},[r("el-card",{staticClass:"box-card",staticStyle:{width:"95%",height:"90%","text-align":"center"},attrs:{shadow:"never"}},[r("div",{staticStyle:{"margin-top":"30px"}},[r("el-row",[r("el-col",{attrs:{span:12}},[r("el-progress",{attrs:{type:"circle","stroke-width":15,percentage:t.Performance.CpuRate,color:t.colors}}),r("el-tag",{attrs:{type:"success"}},[t._v("CPU占有率")])],1),r("el-col",{attrs:{span:12}},[r("el-progress",{attrs:{type:"circle","stroke-width":15,percentage:t.Performance.MemoryRate,color:t.colors}}),r("el-tag",{attrs:{type:"success"}},[t._v("内存占有率")])],1)],1)],1),r("div",[r("ul",[r("li",{attrs:{id:"unAv"}},[r("el-progress",{attrs:{"stroke-width":25,percentage:100,"text-inside":!0,color:"#999",format:t.AvailableMemory}})],1),r("li",[r("el-progress",{attrs:{"stroke-width":25,percentage:100,"text-inside":!0,format:t.Memory}})],1)])])])],1)])])],1)],1)]),r("el-col",{attrs:{span:12}},[r("div",{staticClass:"grid-content cont-top cont-right-top"},[r("div",{staticClass:"chartTitle"},[r("i",{staticClass:"ti"}),t._v("驱动状态")]),r("div",{attrs:{id:"gauge3"}},[r("el-table",{attrs:{stripe:"",data:t.Connections,"tooltip-effect":"dark","max-height":"250"}},[r("el-table-column",{attrs:{prop:"OpcName",label:"驱动名称"}}),r("el-table-column",{attrs:{prop:"OpcUrl",label:"驱动地址"}}),r("el-table-column",{attrs:{prop:"ConnectTime",label:"连接时间"}}),r("el-table-column",{attrs:{prop:"IsConnected",label:"连接状态",width:"180"},scopedSlots:t._u([{key:"default",fn:function(e){return[r("el-tag",{attrs:{type:"已断开"===e.row.IsConnected?"danger":"success","disable-transitions":""}},[t._v(t._s(e.row.IsConnected))])]}}])})],1)],1)])])],1),r("el-row",{staticStyle:{"margin-bottom":"0px"},attrs:{gutter:20}},[r("el-col",{attrs:{span:24}},[r("div",{staticClass:"grid-content cont-bottom"},[r("div",{staticClass:"chartTitle"},[r("i",{staticClass:"ti"}),t._v("设备节点信息")]),r("el-table",{ref:"multipleTable",staticStyle:{"margin-top":"56px",width:"100%"},attrs:{"highlight-current-row":"",data:t.groupList.slice((t.currentPage-1)*t.pagesize,t.currentPage*t.pagesize),"tooltip-effect":"dark",height:"calc(100% - 56px)","default-sort":{prop:"date",order:"descending"},border:"",size:"mini","default-expand-all":"","row-key":"Id","tree-props":{children:"children",hasChildren:"hasChildren"}}},[r("el-table-column",{attrs:{prop:"DeviceName",label:"名称"}}),r("el-table-column",{attrs:{prop:"Topic",label:"Topic"}}),r("el-table-column",{attrs:{prop:"DriveName",label:"驱动名称"}}),r("el-table-column",{attrs:{prop:"InUse",label:"启用",formatter:t.convertInUse}}),r("el-table-column",{attrs:{prop:"Description",label:"描述"}}),r("el-table-column",{attrs:{fixed:"right",label:"操作",width:"240",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[""!=e.row.ParentId&&null!=e.row.ParentId?r("el-button",{staticStyle:{color:"rgb(64,158,255)","font-size":"14px"},attrs:{type:"text",icon:"el-icon-edit",size:"mini"},on:{click:function(r){return t.subLogEdit(e.$index,e.row)}}},[t._v("数据订阅日志")]):t._e()]}}])})],1)],1)])],1)],1)}),[],!1,null,"3ddfb571",null);e.default=l.exports},d58b:function(t,e,r){}}]);