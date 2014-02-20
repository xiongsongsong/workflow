/**
 * Created by 松松 on 14-2-20.
 */


define(function (require, exports, module) {

    var sha3 = require('sha3')

    var $container = $('#main-container-container')
    $container.show()

    //更新密码
    $container.on('submit', 'form#admin-user-update-password', function (ev) {
        ev.preventDefault()
        var form = ev.currentTarget

        var p1 = form.elements['origin-pwd'].value
        var p2 = form.elements['new-pwd'].value
        var p3 = form.elements['confirm-pwd'].value

        if (p1 === '' || p2 !== p3) {
            alert('请输入原密码和新密码')
            return
        }
        p1 = sha3(p1).toString()
        p2 = sha3(p2).toString()

        $.post(form.action, {
            p1: p1,
            p2: p2,
            _csrf: window._csrf_token_
        }, function (data) {
            if (data.status > 0) {
                alert('更新成功！')
                location.hash = '#account-setting'
                window.location.reload()
            } else {
                alert('发生错误：' + data.err.join(','))
            }
        }, 'json')
    })

    //更新个人信息
    $container.on('submit', 'form#admin-user-information', function (ev) {
        ev.preventDefault()
        var form = ev.currentTarget
        $.post(form.action, $(ev.currentTarget).serialize(), function (data) {
            if (data.status > 0) {
                alert('更新成功')
            } else {
                alert('更新失败')
            }
        }, 'json')
    })
})