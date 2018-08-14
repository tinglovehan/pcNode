$(function () {
    //初始化
    var settingdata=$("#calendar").data('list');
    var beginDate=$("#beginDate").val();
    var endDate=$("#endDate").val();
    var initday = dateChoose(settingdata,beginDate,endDate);
    var price=pricestock(initday,rule.maxOrder)[0];
    var max=pricestock(initday,rule.maxOrder)[1];
    var min=rule.minOrder;
    max=max>min?max:min;
    console.log(rule)
    $("#avg").text(price);
    roominit(initday);
    hoteltotalprice();

    //日历和数量的参数
    var data ={
        "mold":"hotel",
        "obj":"time-text",//点击出现日历的对象
        "calendar":{
            "id":"calendar",
            "width":800,
            "multiselect":true,
            "settingdata":settingdata,
            callback:function(evl,date){
                $(".beginDateinput").val(date[0]);
                $(".endDateinput").val(date[1]);
            }
        },
        "num":[{
            "className":"number",
            "min":min,
            "max":max
        }],
        rule:rule,
        "totalPrice":{
            "priceClass":"orderPrice"//单价的class
        }
    }

    orderInit(data);

    $(".modify-time-box .text").click(function(){
        $("#calendar").show();
        $('.btn').removeClass('btn-true');
    });

    $(".btn").click(function(){
        if(!$(this).hasClass('btn-true')){
            var beginDate = $(".beginDateinput").val(),endDate = $(".endDateinput").val(),day = JSON.parse($("#btn").data('date'));
            for(var i=0;i<day.length;i++){
                if(!day[i].leftSum||day[i].leftSum==0){
                    dilogbox('400',day[i].currDate+'暂无库存');
                    return false;
                }
            }
            roominit(day);
            $("#beginDate").val(beginDate);
            $("#endDate").val(endDate);
            $(".beginDate").html(beginDate);
            $(".endDate").html(endDate);
            $("#calendar").hide();
            $(this).parent(".modify-time-box").hide();
            $(this).parent().siblings(".modify-time-rear").css({"display":"inline-block"});
            for( var i=0; i<2; i++){
                $(this).parent().siblings(".modify-time-rear").find(".time").eq(i).html($(this).parent().find(".text").eq(i).val());
            }
        }
    });

    $("#select_couponCode").change(function(event) {
        changeCoupon();
    });

    var validator=$("#validateForm").validate({
        rules: {
            linkMans:{
                maxlength:8,
                required:true,
                isAvailable:true
            },
            teles: {
                isMobile: true,
                required:true
            },
            idNos:{
                required:isNeedIdcard,
                isIdCardNo:true
            },
            remark:{
                isAvailable:true
            }
        }
    });

    postForm('btn-sub',validator,'hotel');//提交表单
});

function roominit(day){
    _html="";
    if(day){
        for(var i=0;i<day.length;i++){
            _html+="<div class='roomDate'><span class='time'>"+day[i].currDate+"</span><span><em>¥"+day[i].currPrice+"</em><i></i></span></div>";
        }
    }
    $(".total_days").html('共'+day.length+'晚');
    $(".roomsInfo").html(_html);
}