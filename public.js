// var user1Data = [['你好', '我是谁']]; //用户1聊天数据

// var user2Data = [['你好啊']]; //用户2聊天数据 

var user1Data = window.localStorage.getItem('user1Data') ? JSON.parse(window.localStorage.getItem('user1Data')) : [];
var user2Data = window.localStorage.getItem('user2Data') ? JSON.parse(window.localStorage.getItem('user2Data')) : [];


var lastMsgFlag = 0;  //最后一次聊天是否是自己发出


var url = location.href;
var userType; //用户类型

if(/demo1/.test(url)) {

	userType = 1;

} else if(/demo2/.test(url)) {

	userType = 2;

}


var isFirstMsg = window.localStorage.getItem('firstMsgUser') ? false : true;	//发出的是否是第一条消息

var firstMsgUser = window.localStorage.getItem('firstMsgUser') || userType;

renderChat(userType);
goChat(userType);


function renderChat(type) { //type 1： 用户1  2: 用户2

	var len = Math.max(user1Data.length, user2Data.length);
	var listHtml = '';

	for(var i=0; i<len; i++) {


		if(type == 1) {
			if(firstMsgUser == 1) {
				listHtml += getCurChat(user1Data[i], 'owner');
				listHtml += getCurChat(user2Data[i], '');
			}else if(firstMsgUser == 2) {
				listHtml += getCurChat(user2Data[i], '');
				listHtml += getCurChat(user1Data[i], 'owner');
			}
		}else if(type == 2) {
			if(firstMsgUser == 1) {
				listHtml += getCurChat(user1Data[i], '');
				listHtml += getCurChat(user2Data[i], 'owner');
			}else if(firstMsgUser == 2) {
				listHtml += getCurChat(user2Data[i], 'owner');
				listHtml += getCurChat(user1Data[i], '');
			}
		}

	}

	document.querySelector('.inner ul').innerHTML = listHtml;
	scrollDown();

}

function getCurChat(msgArr, className) {

	var html = '';
	var classStr = className ? 'class="' + className + '"' : '';
	var chatPerson = className ? '我：' : '对方：';

	if(!msgArr) return '';


	for(var i=0; i<msgArr.length; i++) {
		html += '<li '+ classStr +'>'+ chatPerson + '<span>' + msgArr[i] +'</span></li>';
	}

	return html;

}

function goChat(userType) {

	var sendBtn = document.querySelector('button');
	var msgTextIpt = document.querySelector('input');

	var sourceData = userType == 1 ? user1Data : user2Data;
	var sourceDataName = userType == 1 ? 'user1Data' : 'user2Data';

	sendBtn.addEventListener('click', function() {


		var text = msgTextIpt.value;

		if(lastMsgFlag == 0) {
			sourceData.push([text])
		}else if(lastMsgFlag == 1) {
			sourceData[sourceData.length - 1].push(text);
		}

		localStorage.setItem(sourceDataName, JSON.stringify(sourceData));

		
		if(isFirstMsg) {
			localStorage.setItem('firstMsgUser', userType);
		}


		renderChat(userType);
		msgTextIpt.value = '';
		lastMsgFlag = 1;

	}, false);

}

//监听storage事件

window.addEventListener('storage', function(e) {

	lastMsgFlag = 0;

	if(userType == 1) {
		user2Data = JSON.parse(e.newValue);
	}else {
		user1Data = JSON.parse(e.newValue);
	}

	isFirstMsg = window.localStorage.getItem('firstMsgUser') ? false : true;	//发出的是否是第一条消息

	firstMsgUser = window.localStorage.getItem('firstMsgUser') || userType;

	renderChat(userType);

})

//监听回车
window.addEventListener('keypress', function(e) {
	var sendBtn = document.querySelector('button');
	var e = e || event;

	if(e.keyCode == 13) {
		sendBtn.click();
	}
})

//每次发送消息滚动条滑动到最底部
function scrollDown() {
	var innerBox = document.querySelector('.inner');
	var top = innerBox.scrollHeight - innerBox.clientHeight;

	innerBox.scrollTop = top;
}

//清除聊天记录
document.querySelector('.clear').addEventListener('click', function() {
	localStorage.clear();
	location.reload();
})


