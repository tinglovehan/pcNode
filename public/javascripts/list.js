$(function(){
    var module = $(".html-box").data("module");
	var filterObj={"currPage":1,"pageSize":10};
    if(module==='shop'){
        filterObj.pageSize=9;
    }
	if(module==='hotel'){
	    var date=new Date();
        $("#beginDate").val(getDateStr(date,0));
        $("#endDate").val(getDateStr(date,1));
        filterObj.beginDate=getDateStr(date,0);
        filterObj.endDate=getDateStr(date,1);
        var data = {
            "mold": "hotel",
            "calendar": {
                "id": "calendar",
                "width": 611,
                "multiselect": true,
                "selecteday": [getDateStr(date,0), getDateStr(date,1)],
                "settingdata": [],
                callback: function (evl, date) {
                    $("#beginDate").val(date[0]);
                    $("#endDate").val(date[1]);
                    filterObj.beginDate=date[0];
                    filterObj.endDate=date[1];
                    $("#calendar").hide();
                }
            }
        }

        orderInit(data);
        $("#beginDate,#endDate").click(function () {
            $("#calendar").toggle();
        })
    }
    if(module==='ticket'){
	    console.log(window.location)
	    if(window.location.search){
            filterObj = JSON.parse(decodeURI(window.location.search.split("=")[1]));
            $(".search-put").val(filterObj.searchName);
        }
    }
    listAjax(filterObj,module);

    $(".filter-box .bd a").click(function () {
        $(this).addClass('on').parent().siblings().find('a').removeClass('on');
        var arr = [];
        $(".filter-box .bd a.on").each(function (i) {
            if($(this).data("filter")){
                arr.push($(this).data("filter"));
            }
        });
        filterObj.labelId = arr.toString();
        listAjax(filterObj,module);
    });

    $(".sort-bd a").click(function(){
        var sortKey='';
        if($(this).hasClass('on')){
            if($(this).find('.select').eq(0).hasClass('cur')){
                $(this).find('.select').removeClass('cur').eq(1).addClass('cur');
                sortKey = $(this).find('.sort-key').eq(0).val();
            }else{
                $(this).find('.select').removeClass('cur').eq(0).addClass('cur');
                sortKey = $(this).find('.sort-key').eq(1).val();
            }
        }else{
            $(this).addClass('on').siblings().removeClass('on').find('.select').removeClass('cur');
            $(this).find('.select').eq(1).addClass('cur');
            sortKey = $(this).find('.sort-key').eq(0).val();
        }
        filterObj.sortKey=sortKey;
        listAjax(filterObj,module);
    });

    $(".sort-search-submit").click(function(){
        // var name={'hotel':'name','ticket':'name','combo':'comboName'};
        var searchName = $("#search_parkName").val();
        filterObj.searchName=searchName;
        listAjax(filterObj,module);
    });

    $(".html-box").on('click','.look-all',function(){
        $(this).toggleClass("show");
        if($(this).hasClass("show")){
            $(this).parent().parent().parent().parent().prev().find("tbody tr.park_40").show();
            $(this).find("span").html("收起");
        }else{
            $(this).parent().parent().parent().parent().prev().find("tbody tr").eq(0).nextAll().hide();
            $(this).find("span").html("查看全部");
        }
    });

    $(".html-box").on('click','.dom .order-btn',function(){
        var obj = $(this).parent().parent().parent();
        var len=obj.parent().children().length;
        for(var i=obj.index()+1;i<len;i++){
            if(obj.parent().children().eq(i).hasClass('dom')){
                return false;
            }else{
                obj.parent().children().eq(i).toggle();
            }
        }

    })

});

function listAjax(sendData,module) {
    $.ajax({
        url:window.location,
        type:"POST",
        data:sendData,
        beforeSend: function(){
            loading('.html-box');
        },
        success:function(data){
            listDom(data[0].data.rows,module);
            var total = Math.ceil(operation.accDiv(data[0].data.total,sendData.pageSize));
            pageLay(sendData.currPage,data[0].data.pages,sendData,module)
        }
    })
}

function pageLay(curPage, totalCount, senddata, module) {
    laypage({
        cont: 'page',
        pages: totalCount,
        curr: curPage,
        groups: 3,
        prev: '上一页',
        next: '下一页',
        jump: function (obj, first) {
            if (!first) {
                senddata.currPage = obj.curr;
                $.post(window.location, senddata)
                    .success(function (data) {
                        listDom(data[0].data.rows,module)
                    });
            }
        }
    });
}


function listDom(data,module) {
    var dom='',
        len=data.length;
    if(len==0){
        dom+='<div class="list-nodata">暂无数据</div>';
    }
    for(var i=0;i<len;i++){
        switch (module){
            case "hotel":
                dom+='<div class="list-item mb10">'+
                        '<div class="item-main">'+
                            '<div class="item-l">'+
                                ' <div class="item-imgs"><a href="/detail/hotel/'+data[i].goodsCode+'"><img src="'+eN(data[i].linkImg)+'" alt=""></a></div>'+
                            '</div>'+
                            '<div class="item-summary">'+
                                '<div class="item-btn-box poa_rt"><a href="/detail/hotel/'+data[i].goodsCode+'" class="btn blue-bgcf">查看更多</a></div>'+
                                '<div class="item-name type0">'+
                                    '<div class="item-tit"><h3><a href="/detail/hotel/'+data[i].goodsCode+'" title="">'+eN(data[i].aliasName)+'</a></h3></div>'+
                                '</div>'+
                                '<div class="item-info">'+
                                    '<span class="fl tc"><em class="c-red">'+NN(data[i].salesNum)+' </em>人购买</span><span class="tc"><em class="c-red">'+NN(data[i].avgScore)+'</em> / 5分</span><span class="tc"><em class="c-red">'+NN(data[i].countComment)+'</em>点评</span>'+
                                    '<span class="tc" style="color:red;">';
                                        for(var s=0;s<data[i].goodsLevel;s++){dom+='<i class="ico-star"></i>'}
                                    dom+='</span>'+
                                '</div>'+
                                '<div class="item-des">'+substr(data[i].summary,80)+'</div>'+
                                '<p class="des"><i class="icon-localtion"></i><b>位于：'+data[i].addr+'</b><a href="/detail/hotel/'+data[i].goodsCode+'#jtzn" class="map-link">[查看地图]</a></p>'+
                            '</div>'+
                        '</div>'+
                        '<div class="item-typelist">'+
                            '<table class="list_table" id="eqtable">'+hotelTable(data[i].hotelRooms)+'</table>'+
                        '</div>'+
                    '</div>'
                break;
            case 'ticket':
                dom+='<div class="list-item mb10">'+
                        '<div class="item-main">'+
                            '<div class="item-l">'+
                                ' <div class="item-imgs"><a href="/detail/ticket/'+data[i].goodsCode+'"><img src="'+eN(data[i].linkImg)+'" alt=""></a></div>'+
                            '</div>'+
                            '<div class="item-summary">'+
                                '<div class="item-btn-box poa_rt"><a href="/detail/ticket/'+data[i].goodsCode+'" class="btn blue-bgcf">查看更多</a></div>'+
                                '<div class="item-name type0">'+
                                    '<div class="item-tit"><h3><a href="/detail/ticket/'+data[i].goodsCode+'" title="">'+eN(data[i].aliasName)+'</a></h3></div>'+
                                '</div>'+
                                '<div class="item-info">'+
                                    '<span class="fl tc"><em class="c-red">'+NN(data[i].salesNum)+' </em>人购买</span><span class="tc"><em class="c-red">'+NN(data[i].avgScore)+'</em> / 5分</span><span class="tc"><em class="c-red">'+NN(data[i].countComment)+'</em>点评</span>'+
                                '</div>'+
                                '<div class="item-des">'+eN(data[i].anotherName)+'</div>'+
                                '<p class="time"><strong>开园时间：</strong>'+eN(data[i].openTime)+(data[i].endTime?'至'+data[i].endTime:'')+'</p>'+
                            '</div>'+
                        '</div>'+
                        '<div class="item-typelist">'+
                            '<table class="list_table" id="eqtable">'+ticketTable(data[i].parkTickets)+'</table>'+
                        '</div>'+
                    '</div>'
                break;
            case 'route':
                dom+='<div class="list-item mb10">'+
                    '<div class="item-main">'+
                    '<div class="item-l">'+
                    ' <div class="item-imgs"><a href="/detail/route/'+data[i].goodsCode+'"><img src="'+eN(data[i].pcImg)+'" alt=""></a></div>'+
                    '</div>'+
                    '<div class="item-summary">'+
                    '<div class="item-btn-box poa_rt"><a href="/detail/route/'+data[i].goodsCode+'" class="btn blue-bgcf">查看更多</a></div>'+
                    '<div class="item-name type0">'+
                    '<div class="item-tit"><h3><a href="/detail/route/'+data[i].goodsCode+'" title="">'+eN(data[i].name)+'</a></h3></div>'+
                    '</div>'+
                    '<div class="item-info">'+
                    '<span class="fl tc"><em class="c-red">'+NN(data[i].salesNum)+' </em>人购买</span><span class="tc"><em class="c-red">'+NN(data[i].avgScore)+'</em> / 5分</span><span class="tc"><em class="c-red">'+NN(data[i].countComment)+'</em>点评</span>'+
                    '</div>'+
                    '<div class="item-des">'+eN(data[i].anotherName)+'</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="item-typelist">'+
                    '<table class="list_table" id="eqtable">'+routeTable(data[i].routePlanVos)+'</table>'+
                    '</div>'+
                    '</div>'
                break;
            case "combo":
                dom+='<div class="list-item mb10">'+
                        '<div class="item-main">'+
                            '<div class="item-l">'+
                                ' <div class="item-imgs"><a href="/detail/combo/'+data[i].goodsCode+'?rateCode='+data[i].rateCode+'"><img src="'+eN(data[i].linkImg)+'" alt=""></a></div>'+
                            '</div>'+
                            '<div class="item-summary"> '+
                                '<div class="item-btn-box poa_rt zyx-i-b-b">';
                                if(data[i].currentPrice&&data[i].currentPrice!=0){
                                    dom+='<span class="price"><em class="c-red">¥<b>'+data[i].currentPrice+'</b></em>起</span>';
                                }
                                dom+='<a href="/detail/combo/'+data[i].goodsCode+'?rateCode='+data[i].rateCode+'" class="btn blue-bgcf">查看更多</a></div>'+
                                '<div class="item-name type0">'+
                                    '<div class="item-tit h_two">'+
                                        '<h3><a href="/detail/combo/'+data[i].goodsCode+'?rateCode='+data[i].rateCode+'" title="">'+substr(eN(data[i].aliasName),40)+'</a></h3>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="item-info">'+
                                    '<span class="fl tc"><em class="c-red">'+NN(data[i].salesNum)+'</em>人购买</span><span class="tc"><em class="c-red">'+NN(data[i].avgScore)+'</em> / 5分</span><span class="tc"><em class="c-red">'+NN(data[i].countComment)+'</em>点评</span>'+
                                '</div>'+
                                '<div class="item-des">'+substr(eN(data[i].summary),80)+'</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                break;
            case "car":
                dom+='<div class="list-item mb10">'+
                    '<div class="item-main">'+
                    '<div class="item-l">'+
                    ' <div class="item-imgs"><a href="/detail/car/'+data[i].modelCode+'?rateCode='+data[i].rateCode+'"><img src="'+eN(data[i].wapUrl)+'" alt=""></a></div>'+
                    '</div>'+
                    '<div class="item-summary"> '+
                    '<div class="item-btn-box poa_rt zyx-i-b-b">';
                if(data[i].priceShow&&data[i].priceShow!=0){
                    dom+='<span class="price"><em class="c-red">¥<b>'+data[i].priceShow+'</b></em>起</span>';
                }
                dom+='<a href="/detail/car/'+data[i].modelCode+'?rateCode='+data[i].rateCode+'" class="btn blue-bgcf">查看更多</a></div>'+
                    '<div class="item-name type0">'+
                    '<div class="item-tit h_two">'+
                    '<h3><a href="/detail/car/'+data[i].modelCode+'?rateCode='+data[i].rateCode+'" title="">'+substr(eN(data[i].aliasName),40)+'</a></h3>'+
                    '</div>'+
                    '</div>'+
                    '<div class="item-info">'+
                    '<span class="fl tc"><em class="c-red">'+NN(data[i].salesNum)+'</em>人购买</span><span class="tc"><em class="c-red">'+NN(data[i].avgScore)+'</em> / 5分</span><span class="tc"><em class="c-red">'+NN(data[i].countComment)+'</em>点评</span>'+
                    '</div>'+
                    '<div class="item-des">'+substr(eN(data[i].summary),80)+'</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                break;
            case "shop":
                dom+='<div class="goods-item">'+
                        '<div class="goods-img"><a href="/detail/shop/'+data[i].modelCode+'?rateCode='+data[i].rateCode+'"><img src="'+eN(data[i].linkImg)+'" alt=""></a></div>'+
                        '<div class="goods-info">'+
                            '<div class="goods-name">'+
                                '<h4><a>'+eN(data[i].aliasName)+'</a></h4>'+
                                '<div class="goods-des">'+eN(data[i].subtitle)+
                                '</div>'+
                            '</div>'+
                            '<div class="line"></div>'+
                            '<div class="goods-comment"><span class="fr price">￥<em>'+NN(data[i].currentPrice)+'</em></span><span class="sales-volume">销量：<em>'+NN(data[i].salesNum)+'</em></span><del class="ml20">￥'+NN(data[i].priceShow)+'</del></div>'+
                        '</div>'+
                    '</div>';
                break;
            case "repast":
                dom+='<div class="list-item food-list-item mb10">'+
                        '<div class="item-main">'+
                            '<div class="item-l">'+
                                '<div class="item-imgs"><a href="/detail/repast/'+data[i].goodsCode+'"><img src="'+eN(data[i].linkImg)+'" alt=""></a></div>'+
                            '</div>'+
                            '<div class="item-summary">'+
                                '<div class="item-btn-box poa_rt"><a href="/detail/repast/'+data[i].goodsCode+'" class="btn blue-bgcf">查看更多</a></div>'+
                                '<div class="item-name type0">'+
                                    '<div class="item-tit food-item-tit">'+
                                        '<h3><a href="/detail/repast/'+data[i].goodsCode+'">'+data[i].aliasName+'</a></h3>'+
                                        '<p class="tit-tag">';
                                            if(data[i].labelsName){
                                                for(var x=0;x<data[i].labelsName.split(',').length;x++){dom+='<span>'+data[i].labelsName.split(',')[x]+'</span>';}
                                            }
                                    dom+='</p>'+
                                    '</div>'+
                                    '<div class="item-info"><span class="fl tc"><em class="c-red">'+NN(data[i].salesNum)+'</em>人购买</span><span class="tc"><em class="c-red">'+NN(data[i].avgScore)+'</em> / 5分</span><span class="tc"><em class="c-red">'+NN(data[i].countComment)+'</em>点评</span></div>'+
                                '</div>'+
                                '<div class="item-des">'+substr(data[i].summarize,90)+'</div>'+
                                //'<p class="des food-des"><i class="icon-localtion"></i><b>推荐美味：</b><a href="javascript:detail(8);">恐龙人俱乐部主题餐厅三人餐</a></p>'+
                                '<div class="item-price food-item-price"><i class="icon-rmb">¥</i><em>'+data[i].price+'</em><b>/ 人均</b></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
                break;
            case "strategy":
                dom+='<div class="m-itemlist mb20">'+
                        '<div class="items">'+
                            '<div class="item-main news">'+
                                '<div class="item-name">'+
                                    ' <div class="item-tit">'+
                                        '<h3><a href="/news/'+data[i].baseCode+'">'+data[i].title+'</a></h3>'+
                                        '<p><span>创建时间：'+data[i].createTime+'</span><span>浏览量：'+data[i].viewNum+'</span></p>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="item-summary">'+
                                    '<p></p>'+
                                    '<div class="empblock"></div>'+
                                    '<div class="item-imgs-list">'+
                                        '<div class="bd">';
                                            var imgsdata=data[i].pictures.split(",");
                                            for(var imgs=0;imgs<imgsdata.length;imgs++){
                                                dom+='<a href="/news/'+data[i].baseCode+'" class="img_li">' +
                                                    '<img src="'+imgsdata[imgs]+'" alt=""></a>';
                                            }
                                        dom+='</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                      '</div>';
                break;
        }

    }

    $(".html-box").html(dom);
    for(var i=0;i<$(".list_table").length;i++){
        $(".list_table").eq(i).find("tbody tr").eq(0).nextAll().hide();
    }
}

function hotelTable(data) {
    var dom='';
    dom+='<thead><th width="25%" class="tl">房型</th><th>床型</th><th>房价</th><th></th></thead>';
    dom+='<tbody>';
    for(var i=0;i<data.length;i++){
        dom+='<tr class="park_40 dom">'+
                '<td class="tl"><span>'+data[i].modelName+'</span></td>'+
                '<td>'+bedType(data[i].bedType)+'</td>'+
                '<td><i class="icon-rmb">¥</i><em class="c-red">'+data[i].price+'</em></td>'+
                '<td class="tr"><span class="btn-box"><a href="javascript:;" class="btn order-btn  blue-bgcf">下拉</a></span></td>'+
             '</tr>';
        for(var x=0;x<data[i].ratecodes.length;x++){
            dom+='<tr class="special">'+
                    '<td class="tl"><span class="c-blue">'+data[i].ratecodes[x].aliasName+'</span></td><td></td>'+
                    '<td><i class="icon-rmb">¥</i><em class="c-red">'+data[i].ratecodes[x].currentPrice+'</em><del>¥'+data[i].ratecodes[x].priceShow+'</del></td>'+
                    '<td class="tr"><span class="btn-box"><a href="/order/hotel/'+data[i].ratecodes[x].rateCode+'" class="btn order-btn  blue-bgcf">预订</a></span></td>'+
                '</tr>';
        }
    }

    dom+='</tbody>'+
         '<table id="look_all_table_5">'+
            '<tbody><tr><td colspan="3">';
            if(data.length>0){
                dom+='<a href="javascript:;" class="look-all c-blue"><span>查看全部</span></a></td> </tr></tbody>';
            }else{
                dom+='暂无数据</td> </tr></tbody>';
            }
    dom+='</table>';
    return dom;
}
function ticketTable(data) {
    var dom='',size=0;
    dom+='<tbody>';
    for(var i=0;i<data.length;i++){
        for(var x=0;x<data[i].webParkTickets.length;x++){

                dom+='<tr class="park_40 ">';

            dom+='<td class="tl"><span class="tit">'+data[i].webParkTickets[x].aliasName+'</span></td>'+
                 '<td class="tdF"><del>门市价：¥'+data[i].priceShow+'</del></td>'+
                 '<td><span class="price c-red">¥'+data[i].webParkTickets[x].currentPrice+' </span></td>'+
                 '<td><div class="dis-box"></div></td>'+
                 '<td class="tr"><span class="btn-box"><a href="/order/ticket/'+data[i].webParkTickets[x].rateCode+'?parkId='+data[i].webParkTickets[x].parkId+'" class="btn order-btn blue-bgcf">预订</a></span></td>'+
             '</tr>'
        }
        size=operation.accAdd(size,data[i].webParkTickets.length)
    }
    dom+='</tbody>'+
         '<table id="look_all_table_5">'+
            '<tbody><tr><td colspan="3"><a href="javascript:;" class="look-all c-blue"><span>查看全部</span>('+size+')</a></td> </tr></tbody>'+
         '</table>'
    return dom;
}
function routeTable(data) {
    var dom='',size=0;
    dom+='<tbody>';
    for(var i=0;i<data.length;i++){
        for(var x=0;x<data[i].webRoutePlans.length;x++){

            dom+='<tr class="park_40 ">';

            dom+='<td class="tl"><span class="tit">'+data[i].webRoutePlans[x].aliasName+'</span></td>'+
                '<td class="tdF"><del>门市价：¥'+data[i].webRoutePlans[x].priceShow+'</del></td>'+
                '<td><span class="price c-red">¥'+data[i].webRoutePlans[x].currentPrice+' </span></td>'+
                '<td><div class="dis-box"></div></td>'+
                '<td class="tr"><span class="btn-box"><a href="/order/route/'+data[i].webRoutePlans[x].rateCode + '" class="btn order-btn blue-bgcf">预订</a></span></td>'+
                '</tr>'
        }
        size=operation.accAdd(size,data[i].webRoutePlans.length)
    }
    dom+='</tbody>'+
        '<table id="look_all_table_5">'+
        '<tbody><tr><td colspan="3"><a href="javascript:;" class="look-all c-blue"><span>查看全部</span>('+size+')</a></td> </tr></tbody>'+
        '</table>'
    return dom;
}

// 空值处理
function eN(t){
    return t ? t : '';
}
function NN(t){
    return t ? t : '0';
}

function substr(str,len) {
    if(str.length>len){
        return str.substr(0,len)+'...';
    }else{
        return str
    }
}

