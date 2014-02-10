/*
 * GET home page.
 */

var app = require('app')
var helper = require('helper')

app.get('/', function (req, res) {
    if (!helper.isLogin(req)) {
        res.render('login/main-login', { title: '流程平台登陆' });
    } else {
        res.render('administrator/index')
    }
});

require('./login')

//发布任务单
require('./publish')

//读取任务单
require('./task')

//读取头像
require('./avatar')

//查询当前onsite设计师等等
require('./user')

//保存各种文件
require('./save-file')