var async = require('async');

exports.mainRouter = function (router,common){
    router.get('/pay/:module/:orderId',function (req, res, next) {
        var orderNo = req.params.orderId,
            module = req.params.module,
            parameter = {};
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
            page: 'pay/main',
            title: '支付确认页',
            callBack: function (results,reObj){
                reObj.module = module;
                console.log("results",results);
            }
        });

    });

    router.get('/pay/:module',function (req, res, next) {
        var module=req.params.module,
            orderId=req.query.orderNo,
            payType=req.query.payType,
            paySum=req.query.paySum,
            orderInfo = req.query.orderInfo;
        if(!req.session.token){
            res.redirect('/login');
        }
        //35是智游宝微信扫码，21是支付宝，31微信扫码
        if(payType=='35'){
            next();
            return;
        }
        var redirectUrl="http://"+req.headers.host+"/payPlat/result";
        //附加参数
        var params = {
            redirectUrl: redirectUrl,
            operateId: req.session.member.id,
            orderInfo: orderInfo
        }


        // 请求支付宝配置
        common.commonRequest({
            url: [{
                urlArr: ['main','pay','allpay'],
                parameter: {
                    orderNo: orderId,
                    userType:'C',
                    payType:payType,
                    paySum:paySum,
                    extendParamJson: JSON.stringify(params)
                }
            }],
            req: req,
            res: res,
            page: 'pay/payAlipay',
            title: '支付宝支付'
        });
    },function (req, res, next) {
        var module=req.params.module,
            orderId=req.query.orderNo,
            payType=req.query.payType,
            paySum=req.query.paySum;
        var redirectUrl="http://"+req.headers.host+"/payPlat/result";
        var params = {
            redirectUrl: redirectUrl,
            operateId: req.session.member.id,
            orderInfo: req.query.orderInfo
        }
        common.commonRequest({
            url: [{
                urlArr: ['main','pay','allpay'],
                parameter: {
                    orderNo: orderId,
                    userType:'C',
                    payType:payType,
                    paySum:paySum,
                    extendParamJson:JSON.stringify(params)
                }
            }],
            req: req,
            res: res,
            page:'pay/wxpay',
            title:'微信支付',
            callback:function (results,reObj) {
                console.log(results);
                reObj.orderNo=req.query.orderId;
            }
        });
    });

    //微信查询支付状态
    router.post('/getOrder',function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main','pay','getOrder'],
                parameter:req.body
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){
            }
        });
    });

    router.get('/payPlat/wxresult',function (req, res, next) {
        var query={};
        query.data=req.query;
        res.render('pay/wxResult',{title:'支付结果',data:[query]})
    });

    // 支付宝同步回调
    router.get('/payPlat/result',function (req,res,next){
        //console.log(req.query);
        // var orderId = req.params.orderId;

        // //后台通知(验证)
        // res.render('payResult',{title:'支付结果',data: req.query});
        // for (var key in req.query){
        //     req.query[key] = [req.query[key]];
        // }
        common.commonRequest({
            url: [{
                urlArr: ['main','pay','result'],
                parameter:{
                    transNo:req.query.out_trade_no
                }
            }],
            req: req,
            res: res,
            page: 'pay/payResult',
            title: '支付结果',

        });
    });
}