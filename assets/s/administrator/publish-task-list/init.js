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
        previewExcelData: {
            data: undefined,
            callback: function () {
                path['filter-excel-data'].html = $content.html()
                var $alreadyTh = $('th.J-menu.already');
                if ($alreadyTh.length === fieldsArray.length) {
                    var cell = (function () {
                        var arr = {};
                        $alreadyTh.each(function (index, item) {
                            var $item = $(item);
                            arr[$item.find('div.fields-name').text()] = $(item).data('cell');
                        });
                        return arr;
                    })();

                    var postExcelData = new Array(path['filter-excel-data'].data.length);
                    path['filter-excel-data'].data.forEach(function (item, i) {
                        fieldsArray.forEach(function (fields, j) {
                            if (!postExcelData[i]) {
                                postExcelData[i] = [];
                            }
                            postExcelData[i].push(path['filter-excel-data'].data[i][cell[fields]]);
                        })
                    });
                    step2HTML = $content.html()
                    $content.html(template.render(
                        require('./previewExcelData.tpl'),
                        {step: 3, data: postExcelData, cell: cell, fieldsArray: fieldsArray}
                    ))
                } else {
                    alert('请先选择好所有的字段')
                }
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


    var fieldsArray = ['设计师', '任务名', '需求方', '任务时长', '任务类型'];

    //让组长或主管可以选择该字段所对应的所有任务单
    $(document).on('mouseenter mouseleave', 'th.J-menu', function (ev) {
        var $target = $(ev.currentTarget);
        if (ev.type === 'mouseenter') {
            $(this).find('div.wrapper').append($('<div class="menu"><div class="cancel">取消</div>' + (function () {

                var th = $target.siblings('th').add($target);

                var html = '';
                var leftArray = [];
                th.each(function (index, item) {
                    var fieldsName = $(item).find('div.fields-name');
                    if (fieldsName.text() !== '选择字段') {
                        if (fieldsArray.indexOf($.trim(fieldsName.text())) > -1) leftArray.push(fieldsName.text())
                    }
                });
                for (var i = 0; i < fieldsArray.length; i++) {
                    if (leftArray.indexOf(fieldsArray[i]) > -1) continue;
                    html += '<div>' + fieldsArray[i] + '</div>'
                }
                return html;

            })() + '</div>'))
        } else {
            $(this).find('div.menu').remove();
        }
    });

    //填充选择的菜单到字段中
    $(document).on('click', 'th.J-menu .menu div', function (ev) {

        var $this = $(this);
        var $th = $(this).parents('th');

        if (!$this.hasClass('cancel')) {
            $th.find('div.fields-name').html($this.html());
            $th.addClass('already');
        } else {
            $th.find('div.fields-name').html('请选择');
            $th.removeClass('already');
        }
        $th.find('div.menu').remove();

    });

})