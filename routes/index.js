/*
 * GET home page.
 */

var app = require('app')
var helper = require('helper')

app.get('/', helper.csrf, function (req, res) {
    res.render('login/main-login', { title: 'Express' });
});

require('./login')

//发布任务单
require('./publish')
