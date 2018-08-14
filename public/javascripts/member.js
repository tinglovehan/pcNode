$(function(){
	$(".member-menu dt").click(function(){
		// $(this).parent().siblings().find("dd").slideUp();
		$(this).nextAll().slideToggle();
		if($(this).parent().hasClass('slt')){
			$(this).parent().removeClass('slt');
		}else{
			$(this).parent().addClass('slt').siblings().removeClass('slt');
		}
	});

	if($('#pass').length>0){
		$('#pass').keyup(function () { 
			var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g"); 
			var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g"); 
			var enoughRegex = new RegExp("(?=.{6,}).*", "g"); 
		
			if (false == enoughRegex.test($(this).val())) { 
				$('#level').removeClass('pw-weak'); 
				$('#level').removeClass('pw-medium'); 
				$('#level').removeClass('pw-strong'); 
				$('#level').addClass(' pw-defule'); 
				 //密码小于六位的时候，密码强度图片都为灰色 
			} 
			else if (strongRegex.test($(this).val())) { 
				$('#level').removeClass('pw-weak'); 
				$('#level').removeClass('pw-medium'); 
				$('#level').removeClass('pw-strong'); 
				$('#level').addClass(' pw-strong'); 
				 //密码为八位及以上并且字母数字特殊字符三项都包括,强度最强 
			} 
			else if (mediumRegex.test($(this).val())) { 
				$('#level').removeClass('pw-weak'); 
				$('#level').removeClass('pw-medium'); 
				$('#level').removeClass('pw-strong'); 
				$('#level').addClass(' pw-medium'); 
				 //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等 
			} 
			else { 
				$('#level').removeClass('pw-weak'); 
				$('#level').removeClass('pw-medium'); 
				$('#level').removeClass('pw-strong'); 
				$('#level').addClass('pw-weak'); 
				 //如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的 
			} 
			return true; 
		});
	}

	if($(".love-num").length>0){
		$(".love-num i").click(function(){
			$(this).nextAll().addClass('no-love');
			$(this).removeClass('no-love').prevAll().removeClass('no-love');
			var len=$(".love-num i").length;
			var num=operation.accSub($(".love-num i.no-love").length,len);
			$(".love-num .num").html(num+"分");
			$(".score").val(num);
		})
	}


	// 修改用户信息
	$('#SaveBtn').on('click',function(){
        var validator = $("#InfoModify").validate({
            rules: {
                realName:{
                    isChineseName:true
				},
                mobile:{
                    isMobile:true
                },
                email: {
                    email:true
                },
                idcard:{
                    isIdCardNo:true
                }
            }
        });
        if(validator.form()){
        	var province4=$("#province4 option:selected").data('code');
        	var city4=$("#city4 option:selected").data('code');
        	$(".areaCode").val(province4+','+city4);
			$.post('/member/infomodify',$("#InfoModify").serialize())
				.success(function (data) {
					dilogbox(data[0].status,'修改成功','/member/info');
				})
        }
	});

	// 检测修改密码状态
	$('#pass').on("input propertychange",function(){
		let val = $(this).val();
		if(val.length>0 && val){
			$(this).next('label').show();
		}else {
			$(this).next('label').hide();
		}
	});

	// 修改密码
	$('#ModifyPwd').on('click',function(){
		var validator = $("#validateForm").validate({
			rules: {
				loginPass:{
					required:true,
				},
				newPass: {
					required:true,
					min:6
				},
				newPass2:{
					required:true,
					min:6,
					equalTo:"#pass"
				}
			}
		});
		if(validator.form()){
			var datas = {};
			datas.loginPass = $('input[name=loginPass]').val();
			datas.newPass = $('input[name=newPass]').val();
			$.get('/member/safing',datas)
				.success(function(data){
					var objs = data[0];
					if(objs.status == 200) {
						dilogbox(objs.status,"修改成功",'/member/info');
					}else{
						dilogbox(objs.status,"修改失败",'javascript:;');
						$('input[type=text],input[type=password]').val("");
					}
				});
		}

	});
// --------- 订单 -------- //


	//  订单查询
	$('#Search').on('click',function(){
		var orderNo = $("input[name=orderNo]").val(),	// 订单号
			orderStatus = $("select[name=orderStatus]").val(),	// 订单状态
			tele = $("input[name=tele]").val();	// 手机号码
		filterObj.orderNo = orderNo;
		filterObj.orderStatus = orderStatus;
		filterObj.tele = tele;
		//console.log(filterObj);
		listAjax(filterObj);
	});


});

// 订单列表获取

// 参数，类型 请求列表
function listAjax(sendData) {
	$.ajax({
		url:window.location,
		type:"POST",
		data:sendData,
        beforeSend: function(){
            loading('#OrderList');
        },
		success:function(data){
			if(data[0].status == 200) {
				console.log(data[0]);
				var module = data[0].module;
				listDom(data[0].data.rows,module);
				pageLay(sendData.currPage,data[0].data.pages,sendData,module);//初始化分页
			}else {
				$('#OrderList').html('暂无数据');
			}
		}
	});
}

// 分页
function pageLay(curPage, totalCount, senddata, module) {
	laypage({
		cont: 'page',
		pages: totalCount,
		curr: curPage,
		groups: 3,
		prev: '上一页',
		next: '下一页',
		jump: function(obj,first) {
			if(!first) {
				senddata.currPage = obj.curr;
				$.post(window.location,senddata)
					.success(function(data){
						var module = data[0].module;
						listDom(data[0].data.rows,module);
					});
			}
		}
	});
}

// 订单列表
function listDom(data,module) {
	var dom='',
		len=data.length;
	for(var i=0;i<len;i++) {
		 // if(data[i].orderType!='guide'){
            dom+='<div class="order-list-item">'+
                '<div class="list-top">'+
                '<div class="fl">' +
                '<span>订单号码：'+ data[i].orderNo  +'</span>' +
                '<span>订单时间：'+ data[i].createTime  +'</span>' +
                '</div>'+
                '<div class="fr">订单状态：'+(data[i].orderType==='shop'&&data[i].orderStatus=='1'?data[i].sendStatus:OrderStatus(data[i].orderStatus))+'</div>'+
                '</div>'+
                '<div class="list-module">'+
                '<div class="img-box"><a href="/member/detail?orderNo='+data[i].orderNo+'&module='+data[i].orderType+'"><img src="'+ data[i].imgUrl  +'"></a></div>'+
                '<div class="list-module-btn">'+
                '<div class="price"><em>¥</em>'+data[i].paySum+'</div>'+
                '<div class="btn-box mt10">'+modelBtn(data[i])+'<a href="/member/detail?orderNo='+data[i].orderNo+'&module='+data[i].orderType+'" class="member-btn blue-hover">查看详情</a>'+
                '</div>'+
                '</div>'+
                '<div class="list-module-info">'+modleList(data[i],data[i].orderType)+'</div>'+
                '</div>'+
                '</div>'
		// }

	}
	$('#OrderList').html(dom);
}

// 订单状态
// 0:待付  1:已付,待消费  2:交易成功  3:退款(表示全部退款) 4:交易取消
function OrderStatus(os) {
	var dom = '';
	switch(os){
		case "0":
			dom+='<em class="c-f60">待付款</em>';
			break;
		case "1":
			dom+='<em class="c-f60">待消费</em>';
			break;
		case "2":
			dom+='<em class="c-f60">交易成功</em>';
			break;
		case "3":
			dom+='<em class="c-f60">已退款</em>';
			break;
		case "4":
			dom+='<em class="c-f60">交易取消</em>';
			break;
        case "5":
            dom+='<em class="c-f60">待确认</em>';
            break;
	}
	return dom;
}

// 订单按钮
// 0:待付  1:已付,待消费  2:交易成功  3:退款(表示全部退款) 4:交易取消
function modelBtn(data){
	var dom='';
	switch(data.orderStatus){
		case "0":
			console.log(data)
			dom+='<a href="/pay/'+data.orderType+'/'+data.orderNo+'" class="member-btn blue-hover">去支付</a>';
			break;
		case "1":
			dom+='<a class="member-btn" href="/refund/'+data.orderNo+'?amount='+data.amount+'">退款</a>';
			break;
		case "2":
			if(data.comment){
				dom+='<a class="member-btn">已评价</a>'
			}else{
				dom+='<a href="/member/comment?modelCode='+data.modelCode+'&orderNo='+data.orderNo+'&businessType='+data.orderType+'" class="member-btn blue-hover">去评价</a>';
			}
			break;
		// case "4":
         //    dom+='<a class="member-btn" href="/refund/'+data.orderNo+'?amount='+data.amount+'">取消订单</a>';
         //    break;
	}

	return dom;
}

// 不同列表 ：门票 酒店 自由行
function modleList(data,module){
	var lidom = '';
	switch(module){
		case "ticket":
			lidom+='<h4><a href="/member/detail?orderNo='+data.orderNo+'&module='+data.orderType+'">'+data.orderInfo+'</a></h4>'+
					'<ul>'+
						'<li>游玩日期：'+strcut(data.startTime,10) +'</li>'+
						'<li>数量：'+data.amount+'</li>'+
						'<li>联系人：'+data.linkName+'</li>'+
						'<li>联系电话：'+data.linkMobile +'</li>'+
					'</ul>'
			break;
		case "hotel":
			lidom+='<h4><a href="/member/detail?orderNo='+data.orderNo+'&module='+data.orderType+'">'+data.orderInfo+'</a></h4>'+
				'<ul>'+
					'<li>入住日期：'+strcut(data.startTime,10) +'    '+data.amount+'晚</li>'+
					'<li>数量：'+data.amount+'</li>'+
					'<li>姓名：'+data.linkName+'</li>'+
					'<li>联系电话：'+data.linkMobile +'</li>'+
				'</ul>'
			break;
        case "route":
        case "combo":
            lidom+='<h4><a href="/member/detail?orderNo='+data.orderNo+'&module='+data.orderType+'">'+data.orderInfo+'</a></h4>'+
                '<ul>'+
                '<li>游玩日期：'+strcut(data.startTime,10) +'</li>'+
                '<li>数量：'+data.amount+'</li>'+
                '<li>联系人：'+data.linkName+'</li>'+
                '<li>联系电话：'+data.linkMobile +'</li>'+
                '</ul>'
            break;
        case "car":
        case "repast":
            lidom+='<h4><a href="/member/detail?orderNo='+data.orderNo+'&module='+data.orderType+'">'+data.orderInfo+'</a></h4>'+
                '<ul>'+
                '<li>使用日期：'+strcut(data.startTime,10) +'</li>'+
                '<li>数量：'+data.amount+'</li>'+
                '<li>联系人：'+data.linkName+'</li>'+
                '<li>联系电话：'+data.linkMobile +'</li>'+
                '</ul>'
            break;
        case "shop":
            lidom+='<h4><a href="/member/detail?orderNo='+data.orderNo+'&module='+data.orderType+'">'+data.orderInfo+'</a></h4>'+
                '<ul>'+
                '<li>配送方式：'+(data.sendType==0?"快递":"自提")+'</li>'+
                '<li>数量：'+data.amount+'</li>'+
                '<li>'+(data.sendType==0?"收件人":"取件人")+'：'+data.linkName+'</li>'+
                '<li>联系电话：'+data.linkMobile +'</li>'+
                '</ul>'
            break;
		default:
			break;
	}
	return lidom;
}

// 空值处理
function eN(t){
	return t ? t : '';
}
function NN(t){
	return t ? t : '0';
}
function strcut(str,num) {
	if(str){
		if(str.length>num){
			return str.slice(0,num);
		}else{
			return str;
		}
    }
}