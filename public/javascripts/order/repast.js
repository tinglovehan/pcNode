$(function () {
    //日历和数量的参数
    var settingdata=$("#calendar").data('list');
    var min=rule.minOrder;
    var max=settingdata.length>0?(settingdata[0].leftSum>rule.maxOrder?rule.maxOrder:settingdata[0].leftSum):0;
    max=max>min?max:min;
    var data ={
        "obj":"time-text",//点击出现日历的对象
        "calendar":{
            "id":"calendar",
            "width":612,
            "settingdata":settingdata,
            callback:function(date,price,ticket){
                $(".time-text,.endDate").val(date);
                $(".price b").text(price[0]);
                $("#calendar").hide();

            }
        },
        "num":[{
            "className":"number",
            "min":min,
            "max":max,
            callback:function (evl,value) {
            }
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
            }
        }
    });
    postForm('btn-sub',validator,'repast');


});