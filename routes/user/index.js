/**
 * Created by 松松 on 14-2-9.
 */
var app = require('app')
var db = require('db')

//todo validator
app.get('/user/onsite/onsite-design-user', function (req, res) {
    var user = new db.Collection(db.userClient, 'user')
    user.find({group: {$in: ['计件任务设计师']}}, {_id: 1, user: 1}).toArray(function (err, docs) {
        res.jsonp(docs)
    })
})