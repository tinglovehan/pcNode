var express = require('express');
var router = express.Router();
var common = require('./common/index').common;

// main
require('./main').mainRouter(router,common);
// member
require('./member').mainRouter(router,common);
// list
require('./list').mainRouter(router,common);
// detail
require('./detail').mainRouter(router,common);
// order
require('./order').mainRouter(router,common);
// cart
// require('./cart').mainRouter(router,common);
// pay
require('./pay').mainRouter(router,common);

module.exports = router;