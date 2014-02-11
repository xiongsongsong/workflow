/**
 * Created by 松松 on 14-2-11.
 */
/**
 * Created by songsong on 12/17/13.
 */

define(function (require, exports, module) {
    var $ = require('$')

    $('<div id="preview-img" style="position:fixed;left:0;top:0;z-index:12;"></div><div id="preview-close" style="display:none;background:#aaa;position:fixed;cursor:pointer;right:0;top:0;line-height:50px;font-size:50px;z-index:13;color:#fff;padding:0 12px;background:#000;filter:alpha(opacity=40);opacity:.5;">&times</div><div id="preview-img-mask"' +
        ' style="display:none;position:fixed;left:0;top:0;bottom:0;right:0;z-index:11;background:#000;' +
        'filter:alpha(opacity=40);opacity:.5;"></div>').append($(document.body))
    var $preview = $('#preview-img')

    $(document).on('click', '.J-preview-file', function (ev) {
        var $this = $(ev.currentTarget)
        if ($this.data('file-id') && /(?:jpg|gif|jpeg|png)$/gi.test($this.data('file-id'))) {
            ev.preventDefault()
            $('<img src="' + ev.currentTarget.href + '?m=full-size" />').appendTo($preview)
            show()
        }
    })

    var $mask = $('#preview-img-mask')
    var $close = $('#preview-close')

    $close.on('click', hide)

    function show() {
        $document.on('keyup', checkClose)
        $mask.show()
        $preview.show()
        $close.show()
    }

    function hide() {
        $mask.hide()
        $preview.hide()
        $close.hide()
        $document.off('keyup', checkClose)
    }


    var pageX, pageY;
    var x, y
    var $document = $(document)
    var $window = $(window)

    function bindMouseDown(ev) {
        show()
        x = $preview.position().left
        y = $preview.position().top
        pageX = ev.pageX
        pageY = ev.pageY
        $document.on('mousemove', move)
        $document.on('mouseup', stop)
    }

    function checkClose(ev) {
        if (ev.keyCode === 27) {
            hide()
        }
    }

    function move(ev) {

        var left = x + (ev.pageX - pageX)
        var top = y + (ev.pageY - pageY)
        var viewWidth = $window.width()
        var viewHeight = $window.height()

        var margin = 200

        if (left > viewWidth - margin)  left = viewWidth - margin
        if (top > viewHeight - margin) {
            top = viewHeight - margin
        }

        if (top + $preview.height() < margin) {
            top = -$preview[0].offsetHeight + margin
        }
        if (left > viewWidth - margin) {
            left = viewWidth - margin
        }

        if (left + $preview.width() < margin) {
            left = -$preview[0].offsetWidth + margin
        }


        $preview.css({
            top: top,
            left: left
        })

    }

    function stop() {
        $document.off('mousemove', move)
        $document.off('mousemove', stop)
    }

    if ($preview[0].setCapture) {
        $document.on('mousedown', function (ev) {
            $preview[0].setCapture();
        })

        $document.on('mouseup', function (ev) {
            $preview[0].releaseCapture();
        })
    }


    $preview.on('mousedown', bindMouseDown)

    $preview.on('dragstart', function (ev) {
        ev.preventDefault()
    })

})