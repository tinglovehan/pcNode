$(function () {
    if(isRealName){
        isNeedIdcard=true;
        addNum(rule.minOrder, isNeedIdcard);
    }
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
                if(isRealName){
                    addNum(value,isNeedIdcard);
                }
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
            },
            idNos:{
                required:isNeedIdcard,
                isIdCardNo:true
            }
        }
    });

    $(".btn-sub").click(function () {
        if(module === 'ticket'){
            if($("#agreement").is(':checked')) {
                if (validator.form()) {
                    $.post(window.location.href,$("#validateForm").serialize())
                        .success(function (data) {
                            var datas = data[0];
                            if (datas.status === 200){
                                window.location.href = '/pay/ticket/' + datas.data.orderNo;
                            }
                            else if(datas.status === 400){
                                window.location.href = '/login';
                            }else{

                                dilogbox(datas.status,datas.message,'javascript:;')
                            }
                        });
                }
            }else{
                dilogbox('400','请同意景区协议')
            }
        }else{
            if (validator.form()) {
                $.post(window.location.href,$("#validateForm").serialize())
                    .success(function (data) {
                        var datas = data[0];
                        if (datas.status === 200){
                            window.location.href = '/pay/ticket/' + datas.data.orderNo;
                        }
                        else if(datas.status === 400){
                            window.location.href = '/login';
                        }else{

                            dilogbox(datas.status,datas.message,'javascript:;')
                        }
                    });
            }
        }
    });

    //预订提醒业务
    $(".nextBtn").click(function () {
        if($("#noticeAgree").is(':checked')){
            $(".modelNoticeBox").removeClass('ani').hide();
            $(".mask1").hide();
        }
    });
    if($("#noticeAgree").is(':checked')){
        $(".nextBtn").addClass('blue-bg-down');
    }else{
        $(".nextBtn").removeClass('blue-bg-down');
    }
    $("#noticeAgree").click(function () {
        if($("#noticeAgree").is(':checked')){
            $(".nextBtn").addClass('blue-bg-down');
        }else{
            $(".nextBtn").removeClass('blue-bg-down');
        }
    });


});

function addNum(val,isNeedIdcard) {
    var _html='';
    for(var i=0;i<+(val-1);i++){
        _html+='<div class="order-info"><strong><span class="req-tag">*</span>游客：</strong><div class="form-panel"><input type="text" name="linkMans" value="" class="text"></div></div>'+
            '<div id="idNo" class="order-info"><strong><span class="req-tag">'+(isNeedIdcard?"*":"")+'</span>身份证：</strong><div class="form-panel"><input type="text" name="idNos" value="" class="text"></div></div>';
    }
    $(".addPeople").html(_html);
}