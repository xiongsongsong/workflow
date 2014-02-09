/**
 * Created by 松松 on 14-2-9.
 */

var app = require('app')

//我添加的需求
require('./own-task-list')

//任务详情
require('./detail')

//需求方默认进来的页面
app.get('/offsite', function (req, res) {
    res.render('offsite/index', {title: '我的主页'})
})

//需求方默认进来的页面
app.get('/task/add-task', function (req, res) {
    res.render('task/publish-task-list', {title: '发布需求'})
})
