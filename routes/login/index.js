/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-8-28
 * Time: 下午3:01
 * To change this template use File | Settings | File Templates.
 */

var app = require("app")
var db = require('db')

app.post('/login', function (req, res) {

    var user = new db.Collection(db.userClient, 'user')

    var info = {}

    user.findOne({
        user: req.body._,
        pwd: req.body.__
    }, {_id: 1, user: 1, group: 1, ts: 1}, function (err, data) {
        if (err === null && data !== null) {
            info._id = data._id
            info.status = 1
            info.msg = '登陆成功'
            info.user = data.user;
            info._csrf_token_ = req.csrfToken()

            req.session.login_ts = Date.now()
            req.session.user = data.user
            req.session._id = data._id
            req.session.group = data.group

        } else {
            info.status = -2
            info.msg = '用户名或密码不正确'
            console.log(req.body._ + '登陆失败')
        }
        res.json(info)
    })

})

//判断当前是否为登陆状态
app.get('/login/is-login', function (req, res) {
    var info = {}

    if (req.session._id) {
        info._id = req.session._id
        info.status = 1
        info.msg = '已登陆'
        info.user = req.session.user
        info.status = 1
        console.log(info.user + '检测登陆成功')
    } else {
        info.status = -3
        info.msg = '当前未登陆'
    }

    info._csrf_token_ = req.csrfToken()

    res.jsonp(info)

})


//退出登陆
app.get('/login/login-out', function (req, res) {
    console.log(req.session.user + '退出登陆')
    req.session.destroy();
    res.redirect('/');
})


//获取个人基本信息