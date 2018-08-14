$(function () {
    //初始化
    $(".zyx-choose-type span").click(function(){
        $(this).addClass('on').siblings().removeClass('on');
    });

    var rateCode = $(".rateCode").val();
    var list=$("#data-list").data('list');
    var ruleBuy=$("#ruleBuy").data('rule');
    var min=ruleBuy.minOrder;
    var max=ruleBuy.maxOrder;
    $(".number").parent().parent().html("<input class='number' type='text' name='amount' id='amount' value='"+ruleBuy.minOrder+"'>");
    data ={
        "calendar":{
            "id":"calendar",
            "width":636,
            "settingdata":list,
            callback:function (date,price,ticket) {
                $(".hiddata").data('currDate',date);
                $(".hiddata").data('currPrice',price[0]);
                $(".hiddata").data('leftSum',ticket[0]);
            }
        },
        "num":[{
            "className":"number",
            "min":min,
            "max":max
        }],
        "numMin":false,//控制数量最小是不是能传0，true为0，false为1
        rule:ruleBuy
    }
    orderInit(data)

    $(".zyx-i-btn").click(function () {
        if($(".calendar-contnet .selecteds").length==0){
            dilogbox('','请选择日期','javascript:;')
        }else{
            var num=$("#amount").val();
            var currDate=$(".hiddata").data('currDate');
            var currPrice=$(".hiddata").data('currPrice');
            var leftSum=$(".hiddata").data('leftSum');
            var amount=$("#amount").val();
            var rateCode=$(".rateCode").val();
            var goodsCode=$(".modelCode").val();
            window.location.href='/order/combo/'+rateCode+'?currDate='+currDate+'&currPrice='+currPrice+'&amount='+amount+'&goodsCode='+goodsCode+'&leftSum='+leftSum;
        }
    })
    $(".car-i-btn").click(function () {
        if($(".calendar-contnet .selecteds").length==0){
            dilogbox('','请选择日期','javascript:;')
        }else{
            var num=$("#amount").val();
            var currDate=$(".hiddata").data('currDate');
            var currPrice=$(".hiddata").data('currPrice');
            var leftSum=$(".hiddata").data('leftSum');
            var amount=$("#amount").val();
            var rateCode=$(".rateCode").val();
            var goodsCode=$(".modelCode").val();
            window.location.href='/order/car/'+rateCode+'?currDate='+currDate+'&currPrice='+currPrice+'&amount='+amount+'&goodsCode='+goodsCode+'&leftSum='+leftSum;
        }
    })

});