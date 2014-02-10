/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-19
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var app = require('app');
var db = require('db');
var xss = require('xss')
var taskValidator = require('./../task-validator')

var requireField = ['需求名称', '任务类型', '任务时长', '需求方']

app.post('/task/add-task', function (req, res) {

    //需要登陆
    //需要管理员角色的组权限

    var serverInfo = {
        err: []
    };

    if (!require('helper').isLogin(req)) {
        serverInfo.status = -5;
        serverInfo.err.push('请先登陆')
        res.json(serverInfo);
        return;
    }

    try {
        var json = JSON.parse(req.body.json);
    } catch (e) {
        serverInfo.status = -4;
        serverInfo.err.push('提交的数据格式非法');
        res.json(serverInfo);
        return;
    }

    var TASK = [];

    serverInfo.taskError = [];
    //开始处理任务单的错误

    if (!Array.isArray(json) || json.length < 1) {
        serverInfo.status = -5;
        serverInfo.err.push('数据为空');
        res.json(serverInfo);
        return
    }

    json.forEach(function (item, index) {

        var keys = Object.keys(item)

        //最多允许20个列
        if (Object.keys(item).length > 20) {
            return
        }

        var _i = '第' + (index + 1) + '行'

        // 四个必须存在的字段 '需求名称', '任务类型', '任务时长', '需求方'
        if (keys.indexOf('需求名称') < 0 || keys.indexOf('任务类型') < 0 && keys.indexOf('任务时长') < 0 && keys.indexOf('需求方') < 0) {
            serverInfo.taskError.push(_i + '缺少必要的字段')
            return
        }

        for (var i = 0; i < requireField.length; i++) {
            var key = requireField[i];
            if (taskValidator[key](item[key]) === false) {
                serverInfo.taskError.push(_i + '的' + key + '不能为空')
                return
            }
        }

        keys.forEach(function (key) {
            if (key === '任务时长') {
                if (taskValidator.任务时长(item[key]) === false) {
                    serverInfo.taskError.push(key + '=' + item[key] + '，是非法值')
                    return
                }
                item[key] = parseInt(item[key], 10)
            } else {
                //防止xss
                var _value = xss(item[key])
                var _key = xss(key)
                delete item[key]
                item[_key] = _value
            }
        })

        //只有“指派计件任务设计师”组，有权限更改此字段
        delete item['设计师']

        TASK.push({
            task: item,
            ts: Date.now(),
            from_id: req.session._id,
            from_user: req.session.user
        })

    });

    //检查数据是否错了
    if (serverInfo.taskError.length > 0 || serverInfo.err.length > 0) {
        serverInfo.status = -3;
        res.json(serverInfo);
        return;
    }

    var user = new db.Collection(db.userClient, 'user');

    user.findOne({_id: db.mongodb.ObjectID(req.session._id)}, {fields: {group: 1}}, function (err, data) {

        if (err || !data) {
            serverInfo.err.push('未授权用户');
            serverInfo.status = -2;
            res.json(serverInfo);
            return;
        }

        if (!data.group || data.group.indexOf('添加计件需求') < 0) {
            serverInfo.status = -2;
            serverInfo.err.push('未授权访问');
            res.json(serverInfo);
            return;
        }

        var task = new db.Collection(db.Client, 'task');
        task.insert(TASK, {safe: true},
            function (err, row) {
                if (err) {
                    serverInfo.status = -10;
                    serverInfo.msg = '失败';
                    res.json(serverInfo);
                    return
                }
                serverInfo.status = 1;
                //返回插入的行数
                serverInfo.rows = row.length;
                serverInfo.msg = '保存成功';
                serverInfo.success = true;
                res.json(serverInfo);
            });
    });

});
