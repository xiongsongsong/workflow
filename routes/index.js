/*
 * GET home page.
 */

var app = require('app')
var helper = require('helper')

app.get('/', helper.csrf, function (req, res) {
    if (!helper.isLogin(req)) {
        res.render('login/main-login', { title: '流程平台登陆' });
    } else {
        res.render('administrator/index')
    }
});

require('./login')

//发布任务单
require('./publish')
