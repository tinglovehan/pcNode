var async = require('async');

exports.mainRouter = function (router,common){
    router.get('/list/:mold',function (req, res, next) {
        var module=req.params.mold,
            title = common.pageTitle(module) + '列表';
        // res.render('list/main',{title: '列表',mold:mold});
        var urlArr=[{
                urlArr:['main','search'],
                parameter:{businessType:module}
            },
            {
                urlArr:['main','sort'],
                parameter:{businessType:module}
            },
            {
                urlArr:["main", "listInfo"],
                parameter:{modelCode:"right_recommend","currPage":1,"pageSize":10}
            }];
        if(module==='strategy'){
            urlArr.splice(0,2);
        }
        common.commonRequest({
            url: urlArr,
            req: req,
            res: res,
            page: 'list/main',
            title: '列表',
            callBack: function (results,reObj){
                reObj.module = module;
                //处理搜索条件
                if(module!=='strategy'){
                    var newsort=[],sort=results[1].data;
                    for(var i=0,len=sort.length;i<len;i+=2){
                        newsort.push(sort.slice(i,i+2))
                    }
                    results[1].data=newsort;
                }

            }
        });
    });

    router.post('/list/:module',function(req,res,next){
        var module = req.params.module,
            urlA = [module,"list"];
        if(module==='strategy'){
            req.body.modelCode='pc-strategy';
        }
        common.commonRequest({
            url:[{
                urlArr: urlA,
                parameter: req.body,
                method:"get"
            }],
            isAjax: true,
            req: req,
            res: res,
            callBack: function (results,reObj){
                if(module==='hotel'){
                    req.session.beginDate=req.body.beginDate;
                    req.session.endDate=req.body.endDate;
                }
            }
        })
    })
}