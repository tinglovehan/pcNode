$(function(){
    var page = {
        currPage:1,
        pageSize:3,
        couponStatus:'able'
    }
    var page1 = {
        currPage:1,
        pageSize:3,
        couponStatus:'unable'
    }
    postData(page,'page','yes');
    postData(page1,'page1','no');

    $(".coupon-main").slide({
        titCell: '.hd a',
        mainCell: '.bd'
    });
});

function postData(page,id,htmlId){
    $.post('/member/couponList',page)
        .success(function (data) {
            console.log(data);
            listDom(data[0].data,id,htmlId);
            pageLay(id,page.currPage,data[0].data.pages,page,htmlId);
        });
}

function pageLay(id,curPage, totalCount,page,htmlId) {
    laypage({
        cont: id,
        pages: totalCount,
        curr: curPage,
        groups: 3,
        prev: '上一页',
        next: '下一页',
        jump: function (obj, first) {
            if (!first) {
                page.currPage = obj.curr;
                postData(page,id,htmlId);
            }
        }
    });
}

function listDom(data,id,htmlId) {
    var h = '';
    if(data.rows&&data.rows.length>0){
        data=data.rows;
        for(var i=0;i<data.length;i++){
            h+='<li data-id="'+data[i].couponCode+'">'+
                '<a href="javascript:;">';
            if(data[i].couponStatus=='3'){
                h+='<div class="cp-gqbg"></div>'
            }else if(data[i].couponStatus=='2'){
                h+='<div class="cp-ysybg"></div>'
            }
            if(data[i].couponType==0){
                h+='<strong class="price">￥<em>'+data[i].couponValue+'</em>满'+data[i].fullcat+'元可用</strong>';
            }else{
                h+='<strong class="price"><em>'+data[i].couponValue+'折</em>满'+data[i].fullcat+'元可用</strong>';
            }
            h+='<p class="text">名称：'+substr(data[i].couponName,13)+'</p>';
            if(data[i].usetimeFlag==0){
                h+='<p class="text">有效期：'+data[i].usetimeStart.slice(0,10)+' 至 '+data[i].usetimeEnd.slice(0,10)+'</p>';
            }else if(data[i].usetimeFlag==1){
                h+='<p class="text">有效期：领取当日 '+data[i].usetimeDay +'天内有效</p>';
            }
            h+='<p class="text">使用类别：'+substr(pflag(data[i].productFlag,data[i].productValue),12)+'</p>';
            // h+='<p class="state">立即使用</p></a></li>';
        }
    }else{
        h+='<div class="no-data">暂无优惠券</div>'
    }
    $("#"+htmlId).html(h);
}

function pflag(obj,productValue){
    var a = '';
    switch(Number(obj)){
        case 0:
            a='通用';
            break;
        case 1:
            a='指定产品类别'+productValue;
            break;
        case 2:
            a='指定产品';
            break;
    }
    return a;
}

function substr(str,len) {
    if(str.length>len){
        return str.substr(0,len)+'...';
    }else{
        return str
    }
}