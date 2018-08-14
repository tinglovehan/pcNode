$(function(){

       if(userinfo.id){

           var post = {
               productCode:$(".rateCode").val(),
               productType:module
           }
           $.post('/member/listAbleCoupon',post)
               .success(function (data) {
                   console.log(data)
                   var htm='<option>--请选择--</option>';
                   data = data[0].data;
                   for(var i=0;i<data.length;i++){
                       if(data[i].couponType==0){
                           htm+= "<option data-coupontype='0' data-couponcheckcode='"+data[i].verifyCode+"' data-couponvalue='"+data[i].couponValue+"' data-fullcat='"+data[i].fullcat+"' data-couponcode='"+data[i].couponCode+"'>满"+data[i].fullcat+'元减'+data[i].couponValue+"元</option>";
                       }else{
                           htm+= "<option data-coupontype='1' data-couponcheckcode='"+data[i].verifyCode+"' data-couponvalue='"+data[i].couponValue+"' data-fullcat='"+data[i].fullcat+"' data-couponcode='"+data[i].couponCode+"'>满"+data[i].fullcat+'元打'+data[i].couponValue+"折</option>";
                       }
                   }
                   $(".coupon-ch").html(htm);
               })
       }



    $(".gologin").click(function () {
        dilogboxFun('登录后才可以使用优惠券，是否去登录？',function () {
            var post = {
                url:window.location.href
            }
            $.post('/member/gologin',post)
                .success(function (data) {
                    if(data[0].status==400){
                        window.location.href='/login';
                    }
                });
        },true);
    });

    if($(".changeTime").length>0){
        $(".changeTime").click(function(){
            $(this).parent(".modify-time-rear").hide();
            $(this).parent().siblings(".modify-time-box").css({"display":"inline-block"});
        });

    }

    if($(".xy-btn").length>0){
        $(".xy-btn").click(function(){
            $(".xy-box,.mask").show();
        })
        $(".layer-close").click(function(){
            $(".xy-box,.mask").hide();
        })
    }
})


//优惠券
function changeCoupon(opts) {
    var fullcat = $("#coupon-yhq select option:selected").data("fullcat"),
        couponValue = $("#coupon-yhq select option:selected").data('couponvalue'),
        couponCode = $("#coupon-yhq select option:selected").data('couponcode'),
        coupontype = $("#coupon-yhq select option:selected").data('coupontype'),
        couponCheckCode = $("#coupon-yhq select option:selected").data('couponcheckcode');
    var avg = $("#avg").text(),price=0,couponValue=coupontype==1?couponValue/10:couponValue;
    console.log(couponValue)
    if(module!=='hotel'){
        price=avg;
    }else{
        price = operation.accMul(avg,$("#amount").val());
    }

    if(fullcat<=price){
        $(".couponCode").val(couponCode);
        $(".couponCheckCode").val(couponCheckCode);
        var text = coupontype==1?'*':'-';
        $("#yhtext").html(text);
        $("#yhje").text(couponValue.toFixed(2));
        opts?totalprice(opts):hoteltotalprice();
    }else{
        $("#coupon-yhq select option").first().attr('selected',true);
        $(".couponCode").val('');
        $(".couponCheckCode").val('');
        $("#yhje").text('0');
        $("#yhtext").html('优惠金额');
        opts?totalprice(opts):hoteltotalprice();
        if(fullcat){
            dilogbox('400','订单金额未满足优惠券要求');
        }

    }

}

function postForm(obj,validator,module) {
    $("."+obj).click(function () {
        if(validator.form()){
            console.log($("#validateForm").serialize())
            $.post(window.location.href,$("#validateForm").serialize())
                .success(function (data) {
                    var datas = data[0];
                    if (datas.status === 200){
                        window.location.href = '/pay/'+module+'/' + datas.data.orderNo;
                    }
                    else if(datas.status === 400){
                        window.location.href = '/login';
                    }else{
                        dilogbox(datas.status,datas.message,'javascript:;')
                    }
                })
        }
    });
}








