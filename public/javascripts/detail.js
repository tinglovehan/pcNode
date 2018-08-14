$(function(){
    //分享


     $('#share-2').share({sites: [ 'weibo','wechat']});

    if($(".item-tkt").length>0){
		$(".typelist").on('click','.look-tkt-pinfo',function () {
	        $(this).parent().parent().next().find(".tkt-pinfo").toggle(0);
	    });
		$(".typelist").on('click','.up-btn',function(){
			$(this).parent().parent().hide();
		})
	}


    if($(".go-map-a").length>0){
        $(".go-map-a").click(function(){
            $("html, body").animate({
                scrollTop: ($($(this).attr("gomap")).offset().top-48) + "px"
            }, {
                duration: 500,
                easing: "swing"
            });
        })
    }
    //评论初始化
	var modelCode=$(".modelCode").val();
    var filterObj={"currPage":1,"pageSize":4,"modelCode":modelCode,"commentLevel":0};
    commentAjax(filterObj);
    //评论条件搜索
    $(".comment-tab a").click(function () {
        var level=$(this).data("level");
        $(this).addClass('on').siblings().removeClass('on');
        filterObj.commentLevel=level;
        commentAjax(filterObj);
    })
});
function commentAjax(sendData) {
    $.ajax({
        url:'/comment',
        type:"POST",
        data:sendData,
        success:function(data){
            var datas=data[0].data;
            pageHtml(datas.list.rows);
            pageLay(sendData.currPage,datas.list.pages,sendData);
            if(sendData.commentLevel==0){
                $(".comment-num").html(datas.list.total+'条评论');
                $(".count").html(datas.list.total);
                $(".border-base-b").find('em').html(datas.avgScore);
                $(".info-menu .branch em").html(datas.avgScore);
                $(".comm-top.love-num i").addClass('no-love');
                console.log(Number(datas.avgScore).toFixed(0))
                if(Number(datas.avgScore).toFixed(0)==5){
                    $(".comm-top .love-num i").removeClass('no-love')
                }else{
                    $(".comm-top .love-num i").eq(Number(datas.avgScore).toFixed(0)).prevAll().removeClass('no-love');
                }
            }
        }
    })
}
function pageLay(curPage, totalCount, senddata) {
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
                $.post('/comment', senddata)
                    .success(function (data) {
                        pageHtml(data[0].data.list.rows)
                    });
            }
        }
    });
}
function pageHtml(data) {
    var _html="";
    console.log(data)
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            _html+='<div class="border-base-b dd">';
            _html+='<div class="h6">';
            _html+='<div class="comment-time c-9">'+data[i].createTime+'</div>';
            if(data[i].isAnonymous=='0'){
                _html+='<div class="user font-t">匿名评论</div>';
            }else{
                _html+='<div class="user font-t">'+nameHide(data[i].leaguerName) +'</div>';
            }
            _html+='</div>';
            _html+='<div class="love-num pt10">';
            for(var s=0;s<data[i].score;s++){
                _html+='<i></i>';
            }
            for(var x=0;x<(5-data[i].score);x++){
                _html+='<i class="no-love"></i>';
            }
            _html+='</div>';
            _html+='<p class="user-answer c-9">'+data[i].content+'</p>';
            // _html+='<p class="server-answer c-f6">'+pageData.page[i].ans+'</p>';
            _html+='</div>';
        }
    }else{
        _html='<div class="no-data">暂无数据</div>'
    }
    $(".comment-html").html(_html);
}

function nameHide(str) {
    if(str.length==11){
        return str.slice(0,3)+'***'+str.slice(8);
    }else{
        return str.slice(0,1)+'***';
    }
}