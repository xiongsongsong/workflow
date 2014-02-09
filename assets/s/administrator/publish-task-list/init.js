/**
 * Created by 松松 on 13-11-22.
 */

define(function (require, exports, module) {

    var template = require('template')
    var $content = $('#publish-task-list-form')

    var step2HTML = ''

    var path = {
        //填充excel数据
        'fill-excel-data': {
            data: undefined,
            callback: function (ev) {
                //如果已经存在这个属性了，说明是点了上一步
                if (path['fill-excel-data'].data) {
                    $content.html(template.render(require('./fill-excel-data.tpl'), {}))
                    $('#excel-data').val(path['fill-excel-data'].data)
                    delete path['fill-excel-data'].data
                    delete path['filter-excel-data'].data
                } else {
                    path['filter-excel-data'].callback()
                }
            }
        },
        //分析并显示excel数据
        'filter-excel-data': {
            data: undefined,
            callback: function () {
                if (path['filter-excel-data'].data) {
                    $content.html(path['filter-excel-data'].html)
                } else {
                    path['fill-excel-data'].data = $('#excel-data').val()
                    path['filter-excel-data'].data = transExcelData($('#excel-data').val())
                    var tpl = require('./filter-excel-data.tpl')
                    $content.html(template.render(tpl, { data: path['filter-excel-data'].data }))
                }
            }
        },
        //第三步
        publishTask: {
            data: undefined,
            callback: function () {
                path['filter-excel-data'].html = $content.html()
                var $alreadyTh = $('th.J-fields');
                var cell = (function () {
                    var arr = [];
                    $alreadyTh.each(function (index, item) {
                        arr.push($(item).find('div.fields-name').html());
                    });
                    return arr;
                })();
                step2HTML = $content.html()

                //发送数据给后端，稍微组装下数据给后端
                var arr = []
                for (var i = 0; i < path['filter-excel-data'].data.length; i++) {
                    var obj = path['filter-excel-data'].data[i];
                    var _row = {}
                    for (var j = 0; j < cell.length; j++) {
                        _row[cell[j]] = obj[j]
                    }
                    arr.push(_row)
                }

                $.ajax({
                    url: '/task/add-task',
                    dataType: 'json',
                    type: 'post',
                    data: {
                        _csrf: window._csrf_token_,
                        json: JSON.stringify(arr)
                    }
                }).done(function (data) {

                    })
                    .error(function () {

                    })

            }
        }
    }

    exports.init = function () {
        require('./fill-excel-data.css')
        $content.html(require('./fill-excel-data.tpl'))
    }


    $content.on('click', '[data-go]', function (ev) {
        var $go = $(this).data('go')
        if (path[$go]) path[$go].callback(ev)
    })

    //翻译excel数据
    function transExcelData(value) {
        var reg = /[\n\t]"[^\t]*(\n+)[^\t]*"[\n\t]/g;
        value = value.replace(reg, function (re) {
            return re.replace(/["\n]/g, '');
        });
        value = value.replace(/\r/g, '');
        value = value.replace(/'/g, '’');
        var excelData = []
        var rowDataList = value.split('\n');
        for (var i = 0; i < rowDataList.length; i++) {
            var row = rowDataList[i];
            if ($.trim(row).length < 1) continue;
            excelData.push(rowDataList[i].split('\t'));
        }
        return filterEmptyCell(excelData)
    }

    //过滤掉完全空的列
    function filterEmptyCell(data) {
        //获取最大列数
        if (data.length < 1) return;
        for (var i = 0; i < data[0].length; i++) {
            if (checkIsEmptyString(i) === true) {
                for (var j = 0; j < data.length; j++)   data[j].splice(i, 1);
                i -= 1;
            }
        }

        function checkIsEmptyString(j) {
            var num = 0;
            for (var i = 0; i < data.length; i++)  if (data[i][j] === '') {
                num++;
            }
            return num === data.length;
        }

        return data;
    }

    //必要的列
    var requireFields = ['需求名称', '任务类型', '任务时长', '需求方'];

})