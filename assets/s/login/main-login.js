/**
 * Created by 松松 on 13-11-17.
 */
/**
 * Created by 松松 on 13-11-19.
 */

define(function (require, exports, module) {

    var $ = require('$')
    var sha3 = require('sha3')

    //如果是登陆的FORM
    function loginFormSubmitFn(ev) {

        ev.preventDefault();
        var target = ev.target

        var user = $.trim(target.elements["_"].value)
        var pwd = $.trim(target.elements["__"].value)

        if (user.length < 2) {
            alert('用户名长度太短，至少2个字符')
            return
        }

        if (pwd.length < 2) {
            alert('密码必须大于3位')
            return
        }

        $.post("/login", {
            "_": user,
            __: sha3(pwd).toString(),
            _csrf: window._csrf_token_
        }, function (data) {
            console.log('服务器返回的数据', data)
        }, 'json')
    }

    $('#login').on('submit', loginFormSubmitFn)
})
