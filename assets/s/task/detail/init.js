define(function () {
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
        var $this = $(ev.currentTarget)
        $this.addClass('checked').siblings().removeClass('checked')
    })

    //确认设计师选择
    $document.on('click', '.J-confirm-user', function (ev) {
        var target = $document.find('.J-select-user .checked')
        var id = target.data('id')
        var value = target.data('id')
        $.ajax({
            type: 'post',
            url: '/task/modify/' + id,
            dataType: 'json',
            data: {
                _csrf: window._csrf_token_,
                task_id: taskId,
                key: '设计师',
                value: id,
                plain_value: $.trim(target.text())
            }
        }).done(function (data) {
                console.log(data)
            }
        ).error(function () {

            })
    })

})