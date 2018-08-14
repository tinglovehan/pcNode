var async = require('async');
var captchapng = require('captchapng');

 exports.mainRouter = function (router,common){
    // 首页
     router.get(['/index','/'],function (req,res,next){
         common.commonRequest({
             url: [{
                 urlArr: ['main','index','main'],
                 parameter: {
                     modelCode:"pc-index",
                     corpCode:"cgb2cfxs"
                 }
             }],
             req: req,
             res: res,
             page: 'main',
             title: '首页',
             callBack: function (results, reObj) {
                 reObj.module = 'index';
                 console.log(results[0].data['pc-picture'])
             }
         });
     });

     //登录
     router.get('/login',function (req,res,next){
         res.render('login',{title: '登录'})
     });

     //登录
     router.get('/leaguerLogin',function (req,res,next){
         if(req.query.checkcode==req.session.checkcode){
             common.commonRequest({
                 url: [{
                     urlArr: ['member','login'],
                     parameter: req.query
                 }],
                 req: req,
                 res: res,
                 isAjax: true,
                 callBack: function (results,reObj){
                     console.log('+++++++++++++登录返回信息+++++++++++++')
                     console.log(results)
                     console.log(req.session)
                     //console.log(reObj);
                 }
             });
         }else{
             res.send([{status:'400',message:'图片验证码错误'}])
         }
     });

     //手机快捷登录
     router.get('/leaguerMobileLogin',function (req,res,next){
         if(req.query.code==req.session.checkcode){
             delete req.query.code;
             common.commonRequest({
                 url: [{
                     urlArr: ['member','leaguerMobileLogin'],
                     parameter: req.query
                 }],
                 req: req,
                 res: res,
                 isAjax: true,
                 callBack: function (results,reObj){
                     console.log('+++++++++++++登录返回信息+++++++++++++')
                     console.log(results)
                     console.log(req.session)
                     //console.log(reObj);
                 }
             });
         }else{
             res.send([{status:'400',message:'图片验证码错误'}])
         }
     });

     //注册
     router.get('/register',function(req,res,next){
         res.render('register',{title: '注册'});
     });

     // 注册
     router.get('/signIn',function (req,res,next){
         common.commonRequest({
             url: [{
                 urlArr: ['member','register'],
                 parameter: req.query
             }],
             req: req,
             res: res,
             isAjax: true,
             callBack: function (results,reObj){
                 //res.redirect('/');
             }
         });
     });

     // 发送验证码
     router.post('/checkCode',function (req,res,next){
         if(req.body.imgCode){
             if(req.body.code==req.session.checkcode) {
                 delete req.body.imgCode;
                 delete req.body.code;
                 common.commonRequest({
                     url: [{
                         urlArr: ['main','postCode'],
                         parameter: req.body
                     }],
                     req: req,
                     res: res,
                     isAjax: true,
                     callBack: function (results,reqs,resp,handTag){
                     }
                 });
             }else{
                 res.send([{status:'400',message:'图片验证码错误'}])
             }
         }else{
             common.commonRequest({
                 url: [{
                     urlArr: ['main','postCode'],
                     parameter: req.body
                 }],
                 req: req,
                 res: res,
                 isAjax: true,
                 callBack: function (results,reqs,resp,handTag){
                 }
             });
         }
     });

     // 注销用户
     router.post('/loginOut',function (req,res,next){
         common.commonRequest({
             url: [{
                 urlArr: ['member','logout'],
                 method:'get'
             }],
             req: req,
             res: res,
             isAjax: true,
             callBack: function (results,reqs,resp,handTag){
                 delete req.session.member;
                 delete req.session.curUrl;
             }
         });
     });
     //图片验证码
     router.post('/captchap',function (req,res,next){
         var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):100;
         var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):30;

         var code = parseInt(Math.random()*9000+1000);
         req.session.checkcode = code;

         var p = new captchapng(width,height, code);
         p.color(0, 0, 0, 0);
         p.color(80, 80, 80, 255);

         var img = p.getBase64();
         var imgbase64 = new Buffer(img,'utf8');
        // res.writeHead(200, {
        //      'Content-Type': 'image/png'
        //  });
         res.send(imgbase64);
     });

     //忘记密码
     router.get('/forgetPass',function (req, res, next) {
        res.render('forgetPass',{title:'忘记密码'})
     });

     router.post('/checkphone',function (req, res, next) {
         if(req.body.code==req.session.checkcode) {
             common.commonRequest({
                 url: [{
                     urlArr: ['main', 'checkPhoneCode'],
                     parameter: req.body,
                     method: 'get'
                 }],
                 req: req,
                 res: res,
                 isAjax: true,
                 callBack: function (results, reqs, resp, handTag) {

                 }
             });
         }else{
             res.send([{status:'400',message:'图片验证码错误'}])
         }
     });
     router.post('/changePassWord',function (req, res, next) {
         common.commonRequest({
             url: [{
                 urlArr: ['main', 'resetPwd'],
                 parameter: req.body
             }],
             req: req,
             res: res,
             isAjax: true,
             callBack: function (results,reObj) {

             }
         });

     });

    //错误处理
    router.get('/error', function (req, res, next) {
        res.render('error',{title:'错误页面'})
    });

    router.get('/404',function(req,res){
        res.render('error404',{
            message:req.flash('message').toString()
        })
    });
};