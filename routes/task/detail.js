/**
 * Created by 松松 on 14-2-9.
 */

var app = require('app')
var db = require('db')

app.get(/\/task\/detail\/([a-z0-9]{24})/, function (req, res) {
    var task = new db.Collection(db.Client, 'task')
    task.findOne({_id: db.mongodb.ObjectID(req.params[0]) }, {}, function (err, data) {
        res.render('task/detail', data)
    })
})
