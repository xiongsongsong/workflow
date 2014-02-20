/**
 * Created by 松松 on 14-2-20.
 */
var app = require('app')
var db = require('db')
var ObjectID = db.mongodb.ObjectID
var helper = require('helper')
var xss = require('xss')

app.get('/user/setting', function (req, res) {
    if (require('helper').isLogin(req) === false) {
        res.redirect('/')
        return
    }
    var user = new db.Collection(db.userClient, 'user')
    user.findOne({_id: ObjectID(req.session._id)}, {}, function (err, data) {
        if (!data) {
            res.end('user Not Found')
        } else {
            res.render('user/setting/index', data)
        }
    })
})


//更新密码
app.post('/admin/user/update/password', function (req, res) {

    var result = {err: []}

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆或登陆失效')
        res.json(result)
        return
    }

    var re = /^[a-z\d]{128}$/

    if (re.test(req.body.p1) === false || re.test(req.body.p2) === false) {
        result.err.push('密码不符合验证规则')
        result.status = -3
        res.json(result)
        return
    }

    if (req.body.p1 === req.body.p2) {
        result.err.push('新密码必须和原密码不同哦')
        result.status = -4
        res.json(result)
        return
    }
    try {
        var id = ObjectID(req.session._id)
    } catch (e) {
        result.status = -5
        result.err.push('无法验证用户')
        res.json(result)
        return
    }

    var user = new db.Collection(db.userClient, 'user')
    user.update({_id: id, pwd: req.body.p1}, {$set: {pwd: req.body.p2}}, {}, function (err, _result) {
        if (!err && _result > 0) {
            result.status = 1
        } else {
            result.status = -6
            result.err.push('请检查原密码是否正确')
        }
        res.json(result)
    })
})

//更新个人信息
var allowKey = ['address', 'job', 'qq', 'zone_url', 'phone', 'mobile', 'email']

app.post('/admin/user/update/information', function (req, res) {
    var data = {
        privacy_information: {}
    }
    var result = {err: []}

    if (require('helper').isLogin(req) === false) {
        result.status = -1
        result.err.push('未登陆或登陆失效')
        res.json(result)
        return
    }

    try {
        var id = ObjectID(req.session._id)
    } catch (e) {
        result.status = -5
        result.err.push('无法验证用户')
        res.json(result)
        return
    }


    Object.keys(req.body).forEach(function (key) {
        if (allowKey.indexOf(key) > -1 && req.body[key].length > 0) {
            //code 10 表示全站公开,0 表示仅个人可见
            //目前默认为10
            data.privacy_information[key] = {
                code: 10,
                value: xss(req.body[key])
            }
        }
    })

    var user = new db.Collection(db.userClient, 'user')
    user.update({_id: id}, {$set: data}, {}, function (err, _docs) {
        if (!err && _docs > 0) {
            result.status = 1
            result.msg = '成功更新了数据'
        } else {
            result.status = -1
            result.msg = '无法更新数据'
        }
        res.json(result)
    })
})