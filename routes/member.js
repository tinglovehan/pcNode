var async = require('async');

exports.mainRouter = function (router,common){
    // 用户信息
    router.get('/member/info',function (req,res,next){
        var leaguerId='';
        if(req.session.member){
            var leaguerId=req.session.member.id;
        }
        common.commonRequest({
            url: [{
                urlArr: ['member','info'],
                parameter: {
                    leaguerId:leaguerId
                }
            }],
            req: req,
            res: res,
            page: 'member/info',
            title: '会员中心',
            callBack: function (results,reObj){
                reObj.module = "info";
                console.log("results",results);
            }
        });
    });

    // 修改用户信息 | 渲染页面
    router.get('/member/infomodify',function (req,res,next){
        var leaguerId='';
        if(req.session.member){
            var leaguerId=req.session.member.id;
        }
        common.commonRequest({
            url: [{
                urlArr: ['member','info'],
                parameter: {
                    leaguerId:leaguerId
                }
            }],
            req: req,
            res: res,
            page: 'member/infomodify',
            title: '修改会员信息',
            callBack: function (results,reObj){
                console.log("results",results);
                reObj.module="info";
            }
        });
    });
    // 修改用户信息 | 表单页面
    router.post('/member/infomodify',function (req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['member','modify'],
                parameter:req.body
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){
                req.session.member=results[0].data;
            }
        });
    });


    // 修改密码 | 渲染页面
    router.get('/member/safe',function (req,res,next){
        res.render('member/safe',{title: '修改密码',module:"safe"});
    });

    // 修改密码 | 表单页面
    router.get('/member/safing',function (req,res,next){
        var parameter =req.query;
        parameter.loginName = req.session.member.loginName;
        console.log(parameter);
        common.commonRequest({
            url: [{
                urlArr: ['member','fixpwd'],
                parameter:parameter
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){

            }
        });
    });

    router.get('/member/order',function (req,res,next){
        if(!req.session.member){
            req.session.curUrl='/member/order?orderType='+req.query.orderType;
            res.redirect('/login');
            return false;
        }
        var module = req.query.orderType;
        res.render('member/order',{title:"我的订单",module:module});
    });

    // 查看订单 (orderType)
    router.post('/member/order',function (req,res,next){
        var parameter = req.body;
        var module = req.query.orderType;
        parameter.businessType = module;
        common.commonRequest({
            url: [{
                urlArr: ['member','order','pagelist'],
                parameter: parameter,
                method:"get"
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results,reObj){
                results[0].module = module;
            }
        });
    });

    // 查看订单详情
    router.get('/member/detail',function (req,res,next){
        var orderNo = req.query.orderNo,
            module = req.query.module,
            parameter = {};
        parameter.orderNo = orderNo;
        parameter.orderNo = orderNo;
        parameter.leaguerId='';
        if(req.session.member){
            parameter.leaguerId=req.session.member.id;
        }
        common.commonRequest({
            url: [{
                urlArr: ['member','order','detail'],
                parameter:parameter
            }],
            req: req,
            res: res,
            page: 'member/detail',
            title: '订单详情',
            callBack: function (results,reObj){
                reObj.module = module;
                console.log("results",results);
            }
        });
        //res.render('member/detail',{module:module});
    });
    router.post('/member/detail',function (req,res,next){
        var orderNo = req.query.orderNo,
            module = req.query.module,
            parameter = {};
        parameter.orderNo = orderNo;
        parameter.leaguerId='';
        if(req.session.member){
            parameter.leaguerId=req.session.member.id;
        }
        common.commonRequest({
            url: [{
                urlArr: ['member','order','detail'],
                parameter:parameter,
                method:'get'
            }],
            req: req,
            res: res,
            isAjax:true
        });
        //res.render('member/detail',{module:module});
    });
    //退单
    router.get('/refund/:orderNo',function (req, res, next) {
        res.render('member/refund',{title: '退单',orderNo:req.params.orderNo,amount:req.query.amount});
    });
    router.post('/redund/refundPrice',function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['member','refundPrice'],
                parameter: req.body
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results,reObj){
            }
        });
    });
    router.post('/refund',function (req, res, next) {
        req.body.leaguerId=req.session.member.id;
        common.commonRequest({
            url: [{
                urlArr: ['member','refund'],
                parameter: req.body
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results,reObj){
            }
        });
    });

    router.get('/member/comment',function (req, res, next) {
        var modelCode=req.query.modelCode,orderNo=req.query.orderNo,businessType=req.query.businessType;
        var parameter={currPage:1,pageSize:3,modelCode:modelCode,commentLevel:1};
        common.commonRequest({
            url: [{
                urlArr: ['main','comment'],
                parameter:parameter
            }],
            req: req,
            res: res,
            page: 'member/comment',
            title: '订单评价',
            callBack: function (results,reObj){
                reObj.orderNo=orderNo;
                reObj.modelCode=modelCode;
                reObj.businessType=businessType;
            }
        });
    });

    router.post('/member/comment',function (req, res, next) {
        var leaguerId='',leaguerName='';
        if(req.session.member){
            leaguerId=req.session.member.id;
            leaguerName=req.session.member.loginName;
        }
        req.body.leaguerId=leaguerId;
        req.body.leaguerName=leaguerName;
        common.commonRequest({
            url: [{
                urlArr: ['main','addComment'],
                parameter:req.body
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results,reObj){
            }
        });
    });

    router.post('/cancelOrder/:orderNo',function (req, res, next) {
        var leaguerId='';
        if(req.session.member){
            leaguerId=req.session.member.id;
        }
        common.commonRequest({
            url: [{
                urlArr: ['member','cancelOrder'],
                parameter:{leaguerId:leaguerId,orderNo:req.params.orderNo}
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results,reObj){
            }
        });
    });

    //个人中心优惠券列表
    router.get('/member/couponList',function (req, res, next) {
        if(req.session.member){
            leaguerId=req.session.member.id;
            res.render('member/couponList',{title:'优惠券列表',module:'couponList'});
        }else{
            req.session.curUrl=req.originalUrl;
            res.redirect('/login');
        }

    });
    //个人中心优惠券列表
    router.post('/member/couponList',function (req, res, next) {
        var leaguerId='';
        if(req.session.member){
            leaguerId=req.session.member.id;
        }
        common.commonRequest({
            url: [{
                urlArr: ['coupon','myCoupon'],
                parameter:req.body
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results,reObj){
            }
        });
    });

    router.get('/member/getcoupon',function(req,res,next){
        var leaguerId='';
        if(req.session.member){
            leaguerId=req.session.member.id;
            res.render('member/getcoupon',{title:'优惠券列表'});
        }else{
            req.session.curUrl=req.originalUrl;
            res.redirect('/login');
        }
    });
    //领取优惠券
    router.post('/member/getcoupon',function(req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['coupon','couponPage'],
                parameter:req.body,
                method:'get'
            }],
            req: req,
            res: res,
            isAjax:true,
            callBack: function (results,reObj){
            }
        });
    });
    //领取优惠券
    router.post('/member/receiveCoupon',function(req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['coupon','receiveCoupon'],
                parameter:req.body
            }],
            req: req,
            res: res,
            isAjax:true
        });
    });

    //下单页优惠券
    router.post('/member/listAbleCoupon',function(req,res,next){
        common.commonRequest({
            url: [{
                urlArr: ['coupon','listAbleCoupon'],
                parameter:req.body
            }],
            req: req,
            res: res,
            isAjax:true
        });
    });
    //点击优惠信息保存当前地址跳转登录
    router.post('/member/gologin',function(req,res,next){
        var url = req.body.url;
        req.session.curUrl=url;
        res.json([{status:'400'}]);
    });
}
