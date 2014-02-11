define(function () {
    function initDesigner() {
        $.getJSON('/user/onsite/onsite-design-user', function (data) {
            var str = ''
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                str += '<a href="#" class="btn J-select-user-trigger" data-id="' + obj._id + '">' + obj.user + '</a>'
            }
            $('.J-select-user').html(str)
        })

        var $document = $(document)

        $document.on('click', '.J-select-user-trigger', function (ev) {
            ev.preventDefault()
            var $this = $(ev.currentTarget)
            $this.addClass('checked').siblings().removeClass('checked')
        })

        //确认设计师选择
        $document.on('click', '.J-confirm-user', function (ev) {
            ev.preventDefault()
            var target = $document.find('.J-select-user .checked')
            var user_id = target.data('id')
            if (!user_id) {
                alert('请选择设计师')
                return
            }
            $.ajax({
                type: 'post',
                url: '/task/modify/' + window.taskId,
                dataType: 'json',
                data: {
                    _csrf: window._csrf_token_,
                    key: '设计师',
                    value: user_id,
                    plain_value: $.trim(target.text())
                }
            }).done(function (data) {
                    if (data.status > 0) {
                        window.location.reload()
                    } else {
                        alert(data.err.join(''))
                    }
                }
            ).error(function () {

                })
        })
    }

    if ($('.J-push').length > 0) {
        initDesigner()
    }

    var $upload = $('.J-upload-file-submit-trigger')

    window.taskFileUploadCallBack = function (data) {
        //将上传成功的文件，保存到task.history中
        if (!data.file_id) {
            alert(data.err.join(''))
            return
        }
        $('.J-upload-file-submit-trigger').val('上传完成，正在保存记录...')
        $.ajax({
            url: '/task/add-task-ps-file/' + window.taskId,
            type: 'post',
            dataType: 'json',
            data: {
                _csrf: window._csrf_token_,
                file_id: data.file_id,
                file_name: data.file_name,
                size: data.size
            }
        }).done(function () {
                $upload.val('上传')
                window.location.reload()
            }).error(function () {
                alert('保存文件记录失败')
            })

    }

    $upload.on('click', function (ev) {
        if ($upload.data('is-runing')) {
            ev.preventDefault()
            ev.stopPropagation()
            return
        }
        $upload.data('is-runing', true)
        $upload.val('正在上传，请稍后....')
    })

})