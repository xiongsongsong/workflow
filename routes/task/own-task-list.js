/**
 * Created by 松松 on 14-2-9.
 */

var app = require('app')
var db = require('db')
var helper = require('helper')

app.get('/task/own-task-list', function (req, res) {

    if (!helper.isLogin(req)) {
        res.redirect('/')
        return
    }

    helper.getGroup(req, function (group) {

        //如果是计件任务设计师，则只显示自己该处理的需求
        var filter = {}

        if (!helper.isLogin(req)) {
            res.redirect('/')
            return
        }

        if (!group) {
            res.end('404 Not Found')
            return
        }

        //todo:此处待拆分，权限混乱，用户可设定的很少

        if (group.indexOf('计件任务设计师') > -1) {
            filter = {'task.设计师': req.session.user}
        }

        if (group.indexOf('添加计件需求') > -1) {
            filter = {from_id: req.session._id, ts: {$gte: Date.now() - 3600 * 1000 * 24 * 365}}
        }

        //注意：需求方是没有权限指定计件任务的设计师的
        //需求方只能查看自己相关的需求
        if (group.indexOf('指派计件任务设计师') > -1) {
            filter = {ts: {$gte: Date.now() - 3600 * 1000 * 24 * 365}}
        }


        if (Object.keys(filter).length < 1) {
            res.header('content-type', 'text/plain;charset=utf-8')
            res.end('您缺少权限，请联系元茗处理')
            return
        }

        var task = new db.Collection(db.Client, 'task')

        task.find(filter, {}).sort([
                ['_id', -1]
            ]).toArray(function (err, docs) {
                res.render('task/own-task-list', {title: '我相关的需求', docs: docs})
            })
    })


})
