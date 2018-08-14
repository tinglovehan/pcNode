//优惠券是否需要
var coupon=true;




$(function () {
    $(".subscribe").click(function() {
        var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd': 'CTRL';
        if (document.all) {
            window.external.addFavorite('http://192.168.200.59:3666', '黄山测试环境')
        } else if (window.sidebar) {
            window.sidebar.addPanel('黄山测试环境', 'http://192.168.200.59:3666', "")
        } else {
            alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~')
        }
    });

    //头部搜索事件
    $("#top-search").click(function () {
        var form = {
            currPage:1,
            pageSize:10
        }
        form.searchName = $(".search-put").val();
        window.location.href = '/list/ticket?form='+JSON.stringify(form);
    });

    $('#toTop').click(function () {
        $('html,body').animate({scrollTop: '0px'}, 300);
    })

    //绑定多次使用节点
    var DOM = {
        nav: $('.header-nav').find('span'),
        minBanner: $('#inner-banner '),
        moduleBanner:$('.detail-ban'),
        menuTab:$('#menu_tab')
    };
    //内页头部banner
    if (DOM.minBanner.find('li').length > 1) {
        DOM.minBanner.slide({
            titCell: '.hd ul',
            mainCell: '.bd ul',
            autoPlay: true,
            autoPage: "<li><a></a></li>",
            effect: 'leftLoop',
            interTime: 3000,
            delayTime: 800
        });
    }

    //member-nav
    $(".nav-lia").click(function () {
        $(this).parent().siblings().find("ul").slideUp(400);
        $(this).siblings("ul").slideToggle(400);
        $(this).parent().siblings("li").find("a").removeClass("cur");
        $(this).toggleClass("cur");
    });
    $(".nav-lia li").unbind('click').click(function (e) {
        e.stopPropagation();
    });


    //if(DOM.minBanner.find('li').length>1) {
    //    DOM.minBanner.slide({
    //        titCell: '.hd ul',
    //        mainCell: '.bd ul',
    //        autoPlay: true,
    //        autoPage: "<li><a></a></li>",
    //        effect: 'fold',
    //        interTime: 3000,
    //        delayTime: 800
    //    });
    //}

    //详情页banner
    if (DOM.moduleBanner.length > 0) {
        DOM.moduleBanner.slide({
            titCell: ".smallImg li",
            mainCell: ".bigImg",
            effect: "fold",
            autoPlay: false,
            delayTime: 400,
            prevCell: ".sPrev",
            nextCell: ".sNext",
            pnLoop: false
        });
        DOM.moduleBanner.find(".smallScroll").slide({
            mainCell: "ul",
            autoPage: true,
            effect: "top",
            autoPlay: false,
            vis: 4,
            prevCell: ".sPrev",
            nextCell: ".sNext",
            pnLoop: false
        });
    }
    //详情banner
    if ($(".item-imgslide").length > 0) {
        $('.item-imgslide').slide({
            mainCell: '.bd ul',
            titCell: '.hd li',
            effect: 'fold',
            pnLoop: false
        });
        $('.item-imgslide .hd').slide({
            mainCell: 'ul',
            autoPage: true,
            effect: 'left',
            vis: 4,
            autoPlay: false,
            pnLoop: false
        });
    }




    

    //智能浮动效果
    if(DOM.menuTab.length>0){
        DOM.menuTab.find("a").click(function(){
            // $("#menu_tab li").removeClass("on");
            // $(this).parent().addClass("on");
            $("html, body").animate({
                scrollTop: ($($(this).attr("href")).offset().top-48) + "px"
            }, {
                duration: 500,
                easing: "swing"
            });
            return false;
        });

        var obj = document.getElementById("menu_tab"),eq=0;
        var top = getTop(obj);
        var isIE6 = /msie 6/i.test(navigator.userAgent);
        window.onscroll = function(){
            var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (bodyScrollTop > top){
                obj.style.position = (isIE6) ? "absolute" : "fixed";
                obj.style.top = (isIE6) ? bodyScrollTop + "px" : "0px";
            } else {
                obj.style.position = "static";
            }
            DOM.menuTab.find("li").removeClass("on");
            $(".detail-module").each(function(i){
                var scrolltop=$(this).offset().top;
                if( scrolltop-bodyScrollTop+$(this).height()-48>0){ //当前元素离body顶部的高-被滚动条卷去的高
                    eq=i;
                    return false;
                }
            });
            DOM.menuTab.find("li:eq("+eq+")").addClass("on");
        };

    }

    //下单页悬浮
    if($("#order-xfbot").length>0){
        var obj = document.getElementById("order-xfbot");
        var top = getTop(obj);
        var isIE6 = /msie 6/i.test(navigator.userAgent);
        var navTar = $("#order-xfbot");
        var wh=$(window).height();
        obj.style.position = (isIE6) ? "absolute" : "fixed";
        obj.style.bot = (isIE6) ? bodyScrollTop + "px" : "0px";
        window.onscroll = function(){
            var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (bodyScrollTop < top-wh+70){
                obj.style.position = (isIE6) ? "absolute" : "fixed";
                obj.style.bot = (isIE6) ? bodyScrollTop + "px" : "0px";
            } else {
                obj.style.position = "absolute";
            }
        };

    }

    //列表隐藏
    //在线订单 列表展开和收起
    var tableList = $('.tableList');
    var showListBtn = $('.look-all');
    showList(tableList);
    showListBtn.toggle(function(){
        var $this = $(this);
        var thisTable = $this.parents('.item-typelist').find('.tableList');
        thisTable.find('tr').css('display','table-row');
    }, function () {
        var $this = $(this);
        var thisTable = $this.parents('.item-typelist').find('.tableList');
        showList(thisTable);
    });

    if($(".pay-info-btn").length>0){
        $(".pay-info-btn").click(function(){
            $(this).toggleClass("on");
            $(".pay-tab-info").slideToggle(300);
        });
    }

    //退出登录
    $(".loginOut").click(function () {
        dilogboxFun('确定注销吗',function () {
            closedilog();
            $.post('/loginOut')
                .success(function (data) {
                    dilogbox(data[0].status,data[0].message,'/login');
                })
        },true);

    })
});


/**
 * 票型列表的个数控制
 * @param list (Domlist)
 */
function showList(list){
    var tableList = list;
    for(var i= 0,len = tableList.length;i<len;i++){
        var trList = tableList.eq(i).find('tr');
        for(var j = 0,le = trList.length;j<le;j++){
            j<=2?trList.eq(j).css("display","table-row"):trList.eq(j).css("display","none")
        }
    }
}



function getTop(e){
    var offset = e.offsetTop;
    if(e.offsetParent != null) offset += getTop(e.offsetParent);
    return offset;
}



//四则运算
var operation = {
    accMul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },
    accDiv: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    },
    accAdd: function (arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (this.accMul(arg1, m) + this.accMul(arg2, m)) / m;
    },
    accSub: function (arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        //last modify by deeka
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg2 * m - arg1 * m) / m).toFixed(n);
    }
};







//以下均为日历
function dateChoose(dateArr,start,end){

    start = new Date(ieDate(start)).getTime();
    end = new Date(ieDate(end)).getTime();
    var result=[];
    for(var i=0;i<dateArr.length;i++){
        dateArr[i].currDate=dateArr[i].currDate.substring(0,10);
        var time=(new Date(ieDate(dateArr[i].currDate))).getTime();
        if(time>=start&&time<end){
            result.push(dateArr[i]);
        }
    }
    return result;
}
//兼容ie8写法,将2017-08-11转为2017/08/11
function ieDate(date){
    return Date.parse(date.replace(/-/g,"/"))
}

//酒店日期回调
function hotelCalendarCall(evl,dateArr,date,numClass,opts){
    //获取选中的日期段
    var day = dateChoose(dateArr,date[0],date[1]),price=0,min = opts.numMin?0:1,max=0;
    if(opts.rule){
        min=opts.rule.minOrder;
        max=opts.rule.maxOrder;
    }
    price=pricestock(day)[0];
    var minstock=pricestock(day,max)[1];
    //数量选择,初始化
    if(opts.num){
        for(var i=0;i<numClass.length;i++){
            $("."+numClass[i]).parent().parent().html("<input class='"+numClass[i]+"' type='text' name='amount' id='amount' value='"+min+"'>");
            minstock=minstock>min?minstock:min;
            numInit(numClass[i],min,minstock,opts);
        }
    }
    if(opts.calendar.callback){
        opts.calendar.callback(evl,date);
    }
    if(opts.totalPrice){
        $("#avg").attr('price',price);
        $("#num").text(1);
        hoteltotalprice();
    }
    $("#btn").data('date',JSON.stringify(day));
}

function pricestock(day,max) {
    var price=0;
    var minstock=(day.length>0)?day[0].leftSum:'';
    //酒店房费展示
    for(var i=0;i<day.length;i++){
        if(day[i].leftSum&&day[i].leftSum!=0){
            price = operation.accAdd(price,day[i].currPrice);
            minstock=((+minstock<+day[i].leftSum)?minstock:day[i].leftSum);
        }
    }
    //购买规则和最小库存做比对
    minstock=minstock<max?minstock:max;
    return [price,minstock]
}

// 其他日历回调
function calendarCall(date,price,ticket,numClass,opts){
    var min=opts.numMin?0:1,max=0;
    //有购买规则
    if(opts.rule){
        min = opts.rule.minOrder;
        max = opts.rule.maxOrder;
        ticket=ticket>max?max:ticket;
    }
    if(typeof ticket==="number"){
        ticket = [ticket,min];
    }
    if(typeof price==="string"){
        price = [price,0];
    }
    console.log(ticket)
    if(opts.num&&ticket){
        for(var i=0;i<numClass.length;i++){
            $("."+numClass[i]).parent().parent().html("<input class='"+numClass[i]+"' type='text' name='amount' id='amount' value='"+min+"'>");
            max=ticket[i]>min?ticket[i]:min;
            numInit(numClass[i],min,max,opts,opts.num[i].callback);
        }
    }
    if(opts.calendar.callback){
        opts.calendar.callback(date,price,ticket);
    }
    if(opts.totalPrice){
        totalprice(opts);
    }
}

//计算价格和
function numInit(className,min,max,opts,callback){
    var number = $("."+className);
    number.numSpinner({ 
        max:max,
        min:min,
        onChange:function(evl,value){
           if(opts.totalPrice){
               if(opts.mold!=="hotel"){
                   totalprice(opts,evl,value);
               }else{
                   $("#num").text(value);
                   hoteltotalprice()
               }
           }
           if(callback){
               callback(evl,value)
           }
        }
    });
}

function orderInit(opts){
    var nn = [];
    if(opts.totalPrice){
        opts.mold==="hotel"?hoteltotalprice():totalprice(opts);
    }
    if(opts.num){
        for(var i=0;i<opts.num.length;i++){
            nn.push(opts.num[i].className);
            numInit(opts.num[i].className,opts.num[i].min,opts.num[i].max,opts,opts.num[i].callback);
        }
    }
    if(opts.calendar){
        var option={};
        var newopts = $.extend({},option,opts.calendar);//合并参数
        if(opts.mold!=="hotel"){
            newopts.onClick = function(evl,date,price,ticket){
                calendarCall(date,price,ticket,nn,opts)
            }
            
        }else{
            newopts.onClick = function(evl,date){
                hotelCalendarCall(evl,opts.calendar.settingdata,date,nn,opts)
            }
        }
        $("#"+opts.calendar.id).calendar(newopts);
    }
    if(opts.obj){
        $("."+opts.obj).click(function(){
           $("#"+opts.calendar.id).toggle();
        })
    }
    
}


//计算价格。
function totalprice(opts,evl,num){
    var a = {};
    for(var i=0;i<opts.num.length;i++){
        a[opts.num[i].className]={price:$("."+opts.totalPrice.priceClass).eq(i).find("b").text(),val:$("."+opts.num[i].className).val()}
        if(evl&&num){
            if(opts.num[i].className==$(evl)[0].className){
                a[opts.num[i].className].val=num;
            }
        }
    }
    var totla=0;
    for(x in a){
        totla =  operation.accAdd(operation.accMul(a[x].price,a[x].val),totla)
    }
    if(opts.totalPrice.postagePrice){
        totla=operation.accAdd(totla,opts.totalPrice.postagePrice)
    }
    $("#avg").text(totla);
    var type=$("#coupon-yhq select option:selected").data('coupontype'),
        fullcat = $("#coupon-yhq select option:selected").data("fullcat");
    if(type==0||!type){
        $("#totla").text(operation.accSub($("#yhje").text(),totla));
    }else{
       if(fullcat>totla){
           $("#select_couponCode option:first").prop("selected", 'selected');
           $("#yhje").text('0');
           $('#yhtext').text('-');
           $("#totla").text(operation.accSub(0,totla));
       }else{
           $("#totla").text(operation.accMul($("#yhje").text(),totla));
       }

    }
}




function hoteltotalprice(){
    var price = $("#avg").attr('price');
    var val = $("#amount").val();
    var st = operation.accMul(price,val);
    $("#avg").text(st);
    var type=$("#coupon-yhq select option:selected").data('coupontype');
    if(type==0||!type){
        $("#totla").text(operation.accSub($("#yhje").text(),st));
    }else{
        $("#totla").text(operation.accMul($("#yhje").text(),st));
    }
}

//获取今天之后多少天的日期
function getDateStr(data,AddDayCount) {
    var dd = new Date(data);
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth()+1)>9?(dd.getMonth()+1):"0"+(dd.getMonth()+1);//获取当前月份的日期
    var d = dd.getDate()>9?dd.getDate():"0"+dd.getDate();
    return y+"-"+m+"-"+d;
}
//计算两天相差的天数
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
    return  nDays;
}
//酒店床型
function bedType(num){
    var str="";
    switch (num){
        case '0':
            str="大床";
            break;
        case '1':
            str="双床";
            break;
        case '2':
            str="三床";
            break;
    }
    return str;
}

function dilogbox(status,msg,url,twoBtn) {
    var dom='';
    dom+='<div class="tips-box">'+
            '<div class="tip-header">提示'+
                <!--i.layer-close X-->
            '</div>'+
            '<div class="tips-content">';
        if(status==200){
            dom+='<p><i class="tip suc"></i></p>'+msg+'';
            dom+='</div>';
            dom+='<div class="layer-btn"><a href="'+url+'" class="btn blue-bg-down">确定</a></div>';
        }else{
            dom+='<p><i class="tip err"></i></p>'+msg+''
            dom+='</div>';
            dom+='<div class="layer-btn"><a href="javascript:;" onClick="closedilog()" class="btn blue-bg-down">确定</a></div>';
        }
        if(twoBtn){
            dom+='<div class="layer-btn"><a href="javascript:;" onClick="closedilog()" class="btn blue-bg-down">取消</a></div>'
        }
    dom+='</div>'+
        '<div class="mask" style="display:block"></div>';
    $('body').append(dom);
    var h = $(".tips-box").height();
    $(".tips-box").css({'margin-top':'-'+operation.accDiv(h,2)+'px'})
}
function dilogboxFun(msg,callback,twoBtn) {
    var dom='';
    dom+='<div class="tips-box">'+
        '<div class="tip-header">提示'+
        <!--i.layer-close X-->
        '</div>'+
        '<div class="tips-content">';
        dom+='<p><i class="tip err"></i></p>'+msg+'';
        dom+='</div>';
        dom+='<div class="layer-btn"><a href="javascript:;"  class="btn blue-bg-down sure-btn">确定</a>';
    if(twoBtn){
        dom+='<a href="javascript:;" onClick="closedilog()" class="btn blue-bg-down">取消</a></div></div>'
    }else{
        dom+='</div>';
    }
    dom+='</div>'+
        '<div class="mask" style="display:block"></div>';
    $('body').append(dom);
    var h = $(".tips-box").height();
    $(".tips-box").css({'margin-top':'-'+operation.accDiv(h,2)+'px'});
    $('.sure-btn').click(function () {
        callback();
    })
}
function closedilog() {
    $(".tips-box,.mask").remove();
}


function urlFilter(url) {
    var a=url.split("?")[1];
    var b=a.split("&");
    var c={};
    for(var i=0;i<b.length;i++){
        c[b[i].split("=")[0]]=b[i].split("=")[1];
    }
    console.log(c);
    return c;
}

function loading(name){
    var dom='<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>';
    $(name).append(dom);
}