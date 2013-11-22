/**
 * Created by 松松 on 13-11-22.
 */

define(function (require, exports, module) {

    var template = require('template')
    var $content = $('#publish-task-list-form')

    var path = {
        //填充excel数据
        'fill-excel-data': {
            data: undefined,
            callback: function (ev) {
                path['filter-excel-data'].callback()
            }
        },
        //分析并显示excel数据
        'filter-excel-data': {
            data: undefined,
            callback: function () {
                var data = transExcelData($('#excel-data').val())
                var tpl = require('./filter-excel-data.tpl')
                $content.html(template.render(tpl, { data: data}))
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
})