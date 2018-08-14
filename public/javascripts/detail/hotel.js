$(function(){
    var goodsCode=$(".modelCode").val();
    var beginDate = $(".beginDate").val();
    var endDate = $(".endDate").val();
    var numDays = DateDiff(endDate,beginDate);
    $(".hotel-search .txt em").html(numDays);
    var sendData={
        beginDate:beginDate,
        endDate:endDate,
        numDays:numDays,
        goodsCode:goodsCode
    }
    init(sendData);

    //日历和数量的参数
    var data ={
        "mold":"hotel",
        "calendar":{
            "id":"calendar",
            "width":611,
            "multiselect":true,
            "selecteday":[beginDate,endDate],
            "settingdata":[],
            callback:function(evl,date){
                $(".beginhidden").val(date[0]);
                $(".endhidden").val(date[1]);
                // $("#calendar").hide();

            }
        },
        "num":[{
            "className":"number",
            "min":1,
            "max":10
        }],
        "numMin":false//控制数量最小是不是能传0，true为0，false为1
    }

    orderInit(data);

    $(".beginDate,.endDate").click(function(event) {
        $("#calendar").show();
        $(".change-time").html("确认修改");
    });

    $(".change-time").click(function(){
        var a = $(".beginhidden").val(),b=$(".endhidden").val();
        if(a&&b){
            $(".beginDate").val(a);
            $(".endDate").val(b);
        }
        var diff = DateDiff(b,a);
        $(".hotel-search .txt em").html(diff);
        $("#calendar").hide();
        $(".change-time").html("修改日期");
        sendData.beginDate=a;
        sendData.endDate=b;
        sendData.numDays=diff;
        init(sendData);
    });
})

function init(sendData) {
    $.post('/detail/productItems',sendData)
        .success(function (data) {
            initDom(data[0].data)
        });
}
function initDom(data) {
    var dom = '';
    if(data.length>0) {
        for (var i = 0; i < data.length; i++) {
            //注释部门为房型详情
            dom += '<tr class="dom">' +
                '<td class="tl"><span class="tit">' + data[i].modelName + '</span>' +
                // '<i class="look-tkt-pinfo c-blue">查看详情 &gt;</i>' +
                '</td>' +
                '<td>' + bedType(data[i].bedType) + '</td>' +
                '<td><del>门市价：￥' + data[i].priceShow + '</del></td>' +
                '<td><span class="price c-red">￥' + data[i].price + '</span></td>' +
                '<td></td>' +
                '</tr>';
                // '<tr>' +
                // '<td colspan="5" class="tkt-pinfo hotel-pinfo">' +
                // '<div class="tkt-pinfo-con">' +
                // '<div class="img-box"><img src="" alt=""><div class="img-flex"><img src="" alt=""></div></div>' +
                // '<div class="tkt-pinfo-con-r">' +
                // '<p><strong style="font-weight:bold;">房间面积：</strong>填写具体内容</p>' +
                // '<p><strong style="font-weight:bold;">楼层：</strong>一层 </p>' +
                // '<p><strong style="font-weight:bold;">床型：</strong>双人床2米，1张</p>' +
                // '</div>' +
                // '<div class="up-btn c-blue">收起∧</div>' +
                // '</div>' +
                // '</td>' +
                // '</tr>';
            for (var x = 0; x < data[i].ratecodes.length; x++) {
                dom += '<tr class="special">' +
                    '<td class="tl"><span class="tit c-blue">' + data[i].ratecodes[x].aliasName + '</span></td>' +
                    '<td colspan="2">' + data[i].ratecodes[x].modelDetail + '</td>' +
                    '<td><span class="price c-red">￥' + data[i].ratecodes[x].currentPrice + '</span></td>' +
                    '<td><span class="btn-box"><a href="/order/hotel/' + data[i].ratecodes[x].rateCode + '" class="btn order-btn  blue-bgcf">预订</a></span></td>' +
                    '</tr>';
            }
        }
    }else{
        dom+='<table id="look_all_table_5"><tbody><tr><td colspan="7">暂无数据</td> </tr></tbody></table>'
    }
    $(".item-typelist tbody").html(dom);
}


