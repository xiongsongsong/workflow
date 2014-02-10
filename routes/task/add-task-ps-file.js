/**
 * Created by song on 14-2-9.
 * Describe modify task information
 */

var app = require('app')
var db = require('db')
var xss = require('xss')
var helper = require('helper')

//给任务添加文件上传的历史记录
app.post(/\/task\/add-task-ps-file\/([a-z0-9]{24})/, function (req, res) {

    var server = {err: []}
    try {
        var taskId = db.mongodb.ObjectID(req.params[0])
    } catch (e) {
        server.err.push('任务ID非法')
        server.status = -3
        res.json(server)
        return
    }

    var $push = { history: {} }
    $push.history.type = '上传附件'
    $push.history.fileName = xss(req.body.origin_name)
    $push.history.size = xss(req.body.size)
    $push.history.ts = Date.now()
    $push.history.from_id = req.session._id
    $push.history.from_user = req.session.user

    if (server.err.length > 0) {
        server.status = -4
        res.json(server)
        return
    }

    var task = new db.Collection(db.Client, 'task')
    task.update({_id: taskId}, { $push: $push}, {w: 1}, function (err, row) {
        if (err) {
            server.err.push('更新失败')
            server.status = -10
        } else {
            server.row = row
            server.status = 1
        }
        res.json(server)
    })

})
