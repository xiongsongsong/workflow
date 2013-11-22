/**
 * Created by 松松 on 13-11-21.
 */

define(function (require, exports, module) {

    //发布需求
    if (location.href.indexOf('/publish-task-list')) {
        require.async('./publish-task-list/init', function (obj) {
            obj.init()
        })
    }
})