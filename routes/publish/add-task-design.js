/**
 * Created with JetBrains WebStorm.
 * User: 松松
 * Date: 13-4-19
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var app = require('app');
var db = require('db');

function trans(s) {
    return s && s.trim().length > 0 ? s.trim() : '';
}

app.post('/add-task-design', function (req, res) {

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
    json.data.forEach(function (item) {

        var task = {
            //给谁,记录ObjectId
            to: trans(item[0]),
            //任务名
            name: trans(item[1]),
            //需求方
            demand_side: trans(item[2]),
            //小时数
            timer: trans(item[3]),
            //任务类型
            type: trans(item[4]),
            //派发者，记录ObjectId
            from: req.session._id,
            //时间戳
            time_stamp: Date.now(),
            company: trans(req.body.company)
        };

        var arr = [];

        if (task.to.length < 1) arr.push('您必须指定任务的完成者');
        if (task.name.length < 1) arr.push('任务名称不能为空');
        if (task.demand_side.length < 1) arr.push('缺少需求方名称');
        task.timer = parseInt(task.timer, 10);
        if (isNaN(task.timer) || task.timer <= 0) arr.push('任务时长必须大于0');
        if (task.type.length < 1) arr.push('缺少任务类型');
        if (task.company.length < 1) arr.push('缺少业务所对应的公司');

        if (arr.length < 1) {
            TASK.push(task)
        } else {
            serverInfo.taskError.push(item + '存在问题：' + arr.join(','));
        }
    });

    //检查数据是否全错了
    if (serverInfo.taskError.length === json.data) {
        serverInfo.status = -3;
        res.json(serverInfo);
        return;
    }

    var user = new db.Collection(db.Client, 'user');

    user.findOne({_id: db.mongodb.ObjectID(req.session._id)}, {fields: {group: 1}}, function (err, data) {

        if (err || !data) {
            serverInfo.err.push('未授权用户');
            serverInfo.status = -2;
            res.json(serverInfo);
            return;
        }

        if (!data.group || data.group.indexOf('添加设计师任务单') < 0) {
            serverInfo.status = -2;
            serverInfo.err.push('未授权访问');
            res.json(serverInfo);
            return;
        }

        var task_of_design = new db.Collection(db.Client, 'task-of-design');
        task_of_design.insert(TASK, {safe: true},
            function () {
                serverInfo.status = 1;
                //返回插入的行数
                serverInfo.rows = TASK.length;
                serverInfo.msg = '保存成功';
                serverInfo.success = true;
                res.json(serverInfo);
                //todo:将错误信息，保留在数据库中
            });
    });

});
