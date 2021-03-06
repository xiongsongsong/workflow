/**
 * Created by 松松 on 14-2-9.
 */

var app = require('app')
var helper = require('helper')

//我相关的需求
require('./own-task-list')

//任务详情
require('./detail')

//需求方默认进来的页面
app.get('/offsite', function (req, res) {
    res.render('offsite/index', {title: '我的主页'})
})

//需求方默认进来的页面
app.get('/task/add-task', function (req, res) {
    if (!helper.isLogin(req)) {
        res.redirect('/')
        return
    }
    res.render('task/publish-task-list', {title: '发布需求'})
})

//修改任务单
require('./modify-task')

//给某个任务增加文件记录
require('./add-task-ps-file')
