
let socket = function(ip, port) {
	this.ip = ip;
	this.port = port;
	this.serverURL = "";
	this.isActiveClose = false; //主动关闭需要赋值true，就不会自动重连
	this.ws = undefined; //websocket connection
	this.isFirstConn = true; //是否第一次连接,如果是执行连接初始化函数firstConnProcess

	this.pingInterval = undefined;
	this.pongInterval = undefined;
	this.pingpong = "";

	this.connecting = false;
	this.connectStatus = "服务端未连接";
	this.connectColor = "background-color:red;";
	this.wsMessageCallback = {}; // 回调函数

	this.firstConnProcess = undefined; // 第一次连接需要做的处理
	this.update = undefined; //更新UI
	this.setDiagnosticLog = undefined;//诊断日志
	this.setSubLog = undefined;//订阅日志
	this.setNodeValue = undefined;//点位数据
	this.processLog = undefined; //更新log
	this.disconnectCount = 0; //断开连接计数
}

//产生时间戳，作为操作关键字
socket.prototype.createTimeStamp = function() {
	return new Date().getTime() + '' + Math.ceil(Math.random() * 1000);
}

//创建websocket 连接
socket.prototype.createConnection = function() {

	if (this.serverURL == "") {
		let tempUrl = this.ip + ':' + this.port;
		this.serverURL = "ws://" + tempUrl + "/ws";
	}
	this.ws = new WebSocket(this.serverURL);

	this.ws.onopen = (e) => {
		this.connectStatus = '服务端已连接';
		this.connecting = true;
		this.connectColor = "background-color:green;";
		if (this.isFirstConn) {
			if (this.firstConnProcess !== undefined)
				this.firstConnProcess();
			this.isFirstConn = false;
		};
	};

	this.ws.onclose = (e) => {
		this.connecting = false;
		this.connectStatus = '服务端断开连接';
		this.connectColor = "background-color:red;";
	}

	this.ws.onerror = (e) => {
		this.connectStatus = '连接错误';
		this.connecting = false;
		this.connectColor = "background-color:red;";
	}

	this.ws.onmessage = (e) => {
		const response = JSON.parse(e.data);
		if (this.wsMessageCallback[response.RequestId]) {
			this.wsMessageCallback[response.RequestId](response);
		}
		switch (response.RequestType) {
			case 'dashboard'://首页仪表盘信息
				if (this.update != undefined) {
					this.update(JSON.parse(response.Data));
				}
				break;
			case 'nodeValue'://点位信息
				if (this.setNodeValue != undefined) {
					this.setNodeValue(response.Data);
				}
				break;
			case 'diagnostics'://诊断信息日志
				if (this.setDiagnosticLog != undefined) {
					this.setDiagnosticLog(response);
				}
				break;
			case 'subLog'://数据订阅
				if (this.setSubLog != undefined ) {
					this.setSubLog(response);
				}
				break;
			case 'close':
				this.closeConnection();
			 	break;
			// case "pong":
			// 	this.pingpong = "pong";
			// 	this.disconnectCount = 0;
			// 	break;
			case "No":
				break;
			default:
				console.warn('unknown response type')
				break
		}
	}
	//this.heartCheck();
}

// socket.prototype.heartCheck = function() {
// 	this.pingInterval = setInterval(() => {
// 		this.pingpong = 'ping'; // ws的心跳机制状态值
// 		if (this.connecting === true) {
// 			this.wsRequest({
// 				requestType: 'ping'
// 			}); // 客户端发送ping
// 		}
// 	}, 5001);
// 	this.pongInterval = setInterval(() => {
// 		if (this.pingpong == 'ping') {
// 			this.disconnectCount++;
// 			if (this.disconnectCount > 2) {
// 				if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
// 					clearInterval(this.pingInterval);
// 					clearInterval(this.pongInterval);
// 				}
// 				this.connecting = false;
// 				this.connectStatus = "服务端断开连接";
// 				this.connectColor = "background-color:red;";
// 				if (this.ws != undefined) {
// 					//this.ws.close();
// 					this.close();
// 				}
// 				this.createConnection(); //重新连接
// 			}
// 		}
// 	}, 7501);
// }

//发送request 协议
socket.prototype.wsRequest = function(obj, fn = null) {
	const RequestID = this.createTimeStamp();
	if (fn) {
		this.wsMessageCallback[RequestID] = fn;
	};
	let message = {
		RequestID: RequestID,

		RequestType: obj.requestType,
		Data: obj.data
	};
	try {
		this.ws.send(JSON.stringify(message));
	} catch (error) {
		console.log('websocket错误' + error);
		throw error;
	}
}

//主动关闭连接函数
socket.prototype.closeConnection = function() {
	clearInterval(this.pingInterval);
	clearInterval(this.pongInterval);
	//this.ws.close();
	this.close();
	this.ws = undefined;
	this.connecting = false;
}

socket.prototype.close = function() {
	this.wsRequest({
		requestType: 'close'
	});
}

export default socket
