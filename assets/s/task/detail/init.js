define(function () {
    $.getJSON('/user/onsite/onsite-design-user', function (data) {
        var str = ''
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            str += '<a href="#" class="btn J-select-user-trigger" data-id="' + obj._id + '">' + obj.user + '</a>'
        }
        $('.J-select-user').html(str)
    })

    $(document).on('click', '.J-select-user-trigger', function (ev) {
        var $this = $(ev.currentTarget)
        $this.addClass('checked').siblings().removeClass('checked')
    })

})