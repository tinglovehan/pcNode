var async = require('async'),
    needle = require('needle');

exports.mainRouter = function (router,common){
    router.get('/detail/:module/:productCode',function (req, res, next) {
        var module=req.params.module,
            productCode=req.params.productCode,
            handArr=[{
                    urlArr: ['main','detailimgs'],
                    parameter: { modelCode: productCode}
                },{
                    urlArr: [module,'detail','main'],
                    parameter: { goodsCode: productCode}
                },{
                    urlArr:["main", "listInfo"],
                    parameter:{modelCode:"right_recommend","currPage":1,"pageSize":10}
                }
            ];
        if(module==='combo'|| module==='car'){
            next();
            return false;
        }
        if(module==='shop'){
            var rateCode=req.query.rateCode;
            handArr[1].parameter.rateCode=rateCode;
        }
        if( module==='ticket'|| module==='repast'|| module==='route'){
            handArr.push({
                urlArr:[module,'detail','productItems'],
                parameter: { goodsCode: productCode}
            })
        }
        common.commonRequest({
            url: handArr,
            req: req,
            res: res,
            page: 'detail/main',
            title: common.pageTitle(module) + '详情',
            callBack: function (results, reObj) {
                reObj.module = module;
                reObj.productCode=productCode;
                if(module==='hotel'){
                    results[1].data.beginDate=req.session.beginDate;
                    results[1].data.endDate=req.session.endDate;
                }
            }
        });
    },function (req, res, next) {
        var module = req.params.module,
            rateCode=req.query.rateCode,
            productCode=req.params.productCode;
        var _o = {'content-type': 'text/html;charset=utf-8',headers: {'access-token':req.session.token||""},timeout: 100000};
        async.waterfall([function(cb){
            var url=common.gul(['main','detailimgs']);
            var handObj={ modelCode: productCode,corpCode:"cgb2cfxs",wayType:0};
            async.parallel([function (callBack) {
                needle.request('get', url, handObj, _o, function (err, resp, body) {
                    var res1 = typeof body === 'string' ? JSON.parse(body) : body;
                    if (!err && resp.statusCode === 200) {
                        if (res1.status != 200) {
                            if (res1.status == 400) {
                                _p.req.session.curUrl = _p.req.originalUrl;
                                res.redirect('/login');
                            } else {
                                req.flash('message', res1.message);
                                res.redirect('/error');
                            }
                        } else {
                            callBack(null, res1);
                        }
                    } else {
                        if (res1.status == 400) {
                            req.session.curUrl = req.originalUrl;
                            res.redirect('/login');
                        } else {
                            req.flash('message', res1.message);
                            res.redirect('/error');
                        }
                    }
                })
            },function(callBack){
                var url=common.gul([module,'detail','main']);
                needle.request('get',url,{ goodsCode: productCode,rateCode:rateCode,corpCode:"cgb2cfxs",wayType:0},_o,function (err, resp, body) {
                    var res1 = typeof body === 'string' ? JSON.parse(body) : body;
                    if (!err && resp.statusCode === 200){
                        if (res1.status!=200){
                            if(res1.status==400){
                                _p.req.session.curUrl=_p.req.originalUrl;
                                res.redirect('/login');
                            }else{
                                req.flash('message',res1.message);
                                res.redirect('/error');
                            }
                        }else{
                            callBack(null,res1);
                        }
                    }else{
                        if(res1.status==400){
                            req.session.curUrl=req.originalUrl;
                            res.redirect('/login');
                        }else{
                            req.flash('message',res1.message);
                            res.redirect('/error');
                        }
                    }
                })
            },function(callBack){
                var url=common.gul(['main','listInfo']);
                needle.request('get',url,{modelCode:"right_recommend","currPage":1,"pageSize":10,corpCode:"cgb2cfxs",wayType:0},_o,function (err, resp, body) {
                    var res1 = typeof body === 'string' ? JSON.parse(body) : body;
                    if (!err && resp.statusCode === 200){
                        if (res1.status!=200){
                            if(res1.status==400){
                                _p.req.session.curUrl=_p.req.originalUrl;
                                res.redirect('/login');
                            }else{
                                req.flash('message',res1.message);
                                res.redirect('/error');
                            }
                        }else{
                            callBack(null,res1);
                        }
                    }else{
                        if(res1.status==400){
                            req.session.curUrl=req.originalUrl;
                            res.redirect('/login');
                        }else{
                            req.flash('message',res1.message);
                            res.redirect('/error');
                        }
                    }
                })
            }], function (err, results) {
                cb(null, results);
            });
        },function (result,cb) {
            var _u=common.gul(['main','ratecode','stockprices']),_u1=common.gul(['main','ratecode','ruleBuy']);
            var postm={rateCode:rateCode,corpCode:"cgb2cfxs",wayType:0};
                var funArry = [function (callBack) {
                    needle.request("get", _u, postm, _o, function (err, resp, body) {
                        var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                        if (!err && resp.statusCode === 200) {
                            if (res2.status != 200) {
                                req.flash('message', res2.message);
                                res.redirect('/error');
                            } else {
                                callBack(null, res2);
                            }
                        } else {
                            if (res2.status == 400) {
                                req.session.curUrl = req.originalUrl;
                                res.redirect('/login');
                            } else {
                                req.flash('message', res2.message);
                                res.redirect('/error');
                            }
                        }
                    });
                }];
                if (result[1].data.ruleBuyCode) {
                    funArry.push(function (callBack) {
                        needle.request("get", _u1, {ruleBuyCode: result[1].data.ruleBuyCode,corpCode: "cgb2cfxs",wayType:0}, _o, function (err, resp, body) {
                            var res2 = typeof body === 'string' ? JSON.parse(body) : body;
                            if (!err && resp.statusCode === 200) {
                                if (res2.status != 200) {
                                    req.flash('message', res2.message);
                                    res.redirect('/error');
                                } else {
                                    callBack(null, res2);
                                }
                            } else {
                                if (res2.status == 400) {
                                    req.session.curUrl = req.originalUrl;
                                    res.redirect('/login');
                                } else {
                                    req.flash('message', res2.message);
                                    res.redirect('/error');
                                }
                            }
                        });
                    });
                }

                async.parallel(funArry, function (err, results) {
                    results.splice(0, 0, result[0]);
                    results.splice(1, 0, result[1]);
                    results.splice(2, 0, result[2]);
                    cb(null, results);
                });
        }],function (err,results) {
            console.log(results);
            res.render("detail/main",{title: common.pageTitle(module) + '详情',data:results,module:module});
        })
    });

    // 房型列表
    router.post('/detail/productItems',function (req,res,next){
        req.session.beginDate = req.body.beginDate;
        req.session.endDate = req.body.endDate;
        req.session.numDays = req.body.numDays;
        delete req.body.numDays;
        common.commonRequest({
            url: [{
                urlArr: ['hotel','detail','productItems'],
                parameter: req.body,
                method:"get"
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){
                req.session.productItems = results[0].datas;
            }
        });
    });
    //评论
    router.post('/comment',function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main','comment'],
                parameter: req.body,
                method:"get"
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){

            }
        });
    });
    //库存
    router.post('/stockprices',function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main','ratecode','stockprices'],
                parameter: req.body,
                method:"get"
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){

            }
        });
    });
    //购买规则
    router.post('/ruleBuy',function (req, res, next) {
        common.commonRequest({
            url: [{
                urlArr: ['main','ratecode','ruleBuy'],
                parameter: req.body,
                method:"get"
            }],
            req: req,
            res: res,
            isAjax: true,
            callBack: function (results,reObj){

            }
        });
    });

    //资讯详情
    router.get('/news/:id',function (req, res, next) {
        common.commonRequest({
            url: [{
                    urlArr:["main", "listInfo"],
                    parameter:{modelCode:"right_recommend","currPage":1,"pageSize":10}
                },{
                    urlArr: ['strategy','detail','main'],
                    parameter: {modelCode:req.params.id}
                }
            ],
            req: req,
            res: res,
            page: 'detail/news',
            title: '资讯详情',
            callBack: function (results, reObj) {
                reObj.module='strategy'
            }
        });
    })
}