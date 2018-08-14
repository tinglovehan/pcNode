$(function(){
    var windowW = $(window).width();
    var bannerH = windowW / 2.539;
    $('#indexBanner').shutter({
        shutterW: windowW, // 容器宽度
        shutterH: bannerH, // 容器高度
        isAutoPlay: true, // 是否自动播放
        playInterval: 3000, // 自动播放时间
        curDisplay: 0, // 当前显示页
        fullPage: false, // 是否全屏展示
        paginationEl:'.shutter-pagination',
        changeSlide:function(index){
        }
    });

    $('.navLi').hover(function () {
        $(this).addClass('on').siblings('.on').removeClass('on');
    });

    // 预订
    $('.orderNav span').click(function () {
        var index = $(this).index();
        $(this).addClass('on').siblings('.on').removeClass('on');
        orderFormBox.slideTo(index)
    });
    var orderFormBox = new Swiper('#orderFormBox',{
        effect : 'slide',
        autoplay:false,
        on: {
            slideChangeTransitionEnd: function(event){
                var index = this.activeIndex;
                $('.orderNav span').eq(index).addClass('on').siblings('.on').removeClass('on');
            },
        },
    });
    $('.orderSelect').each(function () {
        $(this).cssSelect();
    });

    // 新闻
    var newsSwiper = new Swiper('.newsList',{
        autoplay: true,
        direction:'vertical'
    });

    // 酒店
    $('.hotelRecommendBox .item').hover(function () {
         $(this).addClass('on');
    },function(){
         $(this).removeClass('on');
    });
    var hotelImgs = new Swiper('#hotelImgs',{
        effect : 'slide',
        navigation: {
            nextEl: '.hotel-next',
            prevEl: '.hotel-prev',
        },
    });

    // 攻略
    var travelGuideList = new Swiper('#travelGuideList',{
        autoplay: true,
        effect:'slide',
        slidesPerView: 3,
        spaceBetween:85,
        slidesOffsetBefore:0,
        pagination: {
            el: '.guide-swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        uniqueNavElements: false,
    });
    $('.guide-swiper-pagination span').click(function(){
        var index = $(this).index();
        $(this).addClass('swiper-pagination-bullet-active').siblings().removeClass('.swiper-pagination-bullet-active');
        travelGuideList.slideTo(index);
    });


});