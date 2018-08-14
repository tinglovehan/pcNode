$(function () {
    var settingdata=$("#calendar").data('list');
    var query=urlFilter(window.location.href);
    //初始化
    $("#amount").val(query.amount);
    $(".orderPrice b").html(query.currPrice);
    $(".time-text,.endDate").val(query.currDate);
    var min=rule.minOrder;
    var max=query.leftSum>min?query.leftSum:min;
    var data ={
        "obj":"time-text",//点击出现日历的对象
        "calendar":{
            "id":"calendar",
            "width":612,
            "settingdata":settingdata,
            "selecteday":query.currDate,
            callback:function(date,price,ticket){
                $(".time-text,.endDate").val(date);
                $(".price b").text(price[0]);
                $("#calendar").hide();

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
    $("#select_couponCode").change(function(event) {
        changeCoupon(data);
    });

    //表单验证
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

    postForm('btn-sub',validator,'car');//提交表单

});