/**
 * Created by 松松 on 13-11-20.
 */

var app = require('app')

app.get('/publish-task-list', function (req, res) {

    res.render('publish-task-list/index', {title: '发布新任务单', sid: req.session._id, user_name: req.session.user})

})

require('./add-task-design')