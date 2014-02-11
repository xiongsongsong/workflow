/**
 * Created by 松松 on 14-2-9.
 */

var app = require('app')
var db = require('db')

app.get(/\/task\/detail\/([a-z0-9]{24})/, function (req, res) {

    //todo:权限验证
    if (!req.isLogin(req)) {
        res.redirect('/')
        return
    }

    var task = new db.Collection(db.Client, 'task')
    task.findOne({_id: db.mongodb.ObjectID(req.params[0]) }, {}, function (err, data) {
        if (data) {
            res.render('task/detail', data)
        } else {
            res.end('404 Not Found')
        }
    })
})
