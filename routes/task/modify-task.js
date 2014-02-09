/**
 * Created by song on 14-2-9.
 * Describe modify task information
 */

var app = require('app')
var db = require('db')
var xss = require('xss')
var helper = require('helper')


//有权限修改字段名：所对应的组角色
var white = {
    设计师: '指派计件任务设计师',//eg:只有‘指派计件任务设计师’的组，才能修改‘设计师’字段
    备注: '添加计件需求'
}

app.post(/\/task\/modify\/([a-z0-9]{24})/, function (req, res) {

    helper.getGroup(req, function (group) {
        var server = {err: []}
        if (Array.isArray(group) === false) {
            server.err.push('无法获取组信息')
            server.status = -1
            res.json(server)
            return
        }

        //检测是否有权限
        if (group.indexOf(white[req.body.key]) < 0) {
            server.err.push('您没有修改' + req.body.key + '的权限')
            server.status = -2
            res.json(server)
            return
        }


        try {
            var taskId = db.mongodb.ObjectID(req.body.task_id)
        } catch (e) {
            server.err.push('任务ID非法')
            server.status = -3
            res.json(server)
            return
        }

        var $set = {}
        if (req.body.key === '设计师') {
            //检测是否有权限
            $set['task.设计师'] = xss(req.body.plain_value)
            if (/^[a-z0-9]{24}$/.test(req.body.value) === false) {
                server.err.push('设计师id不存在')
            } else {
                $set['task.设计师id'] = req.body.value
            }
        } else {
            $set['task.' + req.body.key] = xss(req.body.value)
        }


        var task = new db.Collection(db.Client, 'task')
        task.update({_id: taskId}, {$set: $set}, {w: 1}, function (err, row) {
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

})
