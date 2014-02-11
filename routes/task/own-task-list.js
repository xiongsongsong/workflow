/**
 * Created by 松松 on 14-2-9.
 */

var app = require('app')
var db = require('db')

app.get('/task/own-task-list', function (req, res) {
    var task = new db.Collection(db.Client, 'task')
    task.find({from_id: req.session._id, ts: {$gte: Date.now() - 3600 * 1000 * 24 * 30}}, {}).sort([
            ['_id', -1]
        ]).toArray(function (err, docs) {
            res.render('task/own-task-list', {title: '我的主页', docs: docs})
        })
})