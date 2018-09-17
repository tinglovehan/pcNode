var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置 Session
app.use(session({
    resave: true,
    saveUninitialized: false,
    store: new RedisStore({
        host: "192.168.200.50",//测试
        port: 6379,
        ttl: 30 * 60 // 过期时间
    }),
    secret: 'sendinfo'
}));
app.use(flash());
//存储登录信息
app.use(function(req, res, next){
    if(req.session&&req.session.member){
        res.locals.userinfo = req.session.member;
    }else{
        res.locals.userinfo={id:''};
    }
    res.locals.message = req.flash('message').toString();
    next();
});
// // 路由拦截
// app.use('/member',function (req, res, next) {
//     if (!req.session.member) {
//         return res.redirect("/login");
//     }
//     next();
// });
// app.use('/custom',function (req, res, next) {
//     if (!req.session.member) {
//         return res.redirect("/login");
//     }
//     next();
// });

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        res.render('error404');
  //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
