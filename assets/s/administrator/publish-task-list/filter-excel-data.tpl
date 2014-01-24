<div class="content">
    #run var sumLength=data.length
    <h3>总共有 #{sumLength}条任务#if(sumLength>12)，以下仅显示前12条#end。</h3>

    <p>你需要指定：设计师，任务名，需求方，任务时长，任务类型</p>
    <table class="task-list select-field">
        <tr>
            #each(row,i in data[0])
            <th class="J-menu" data-cell="#{i}">
                <div class="wrapper">
                    <div class="fields-name">选择字段</div>
                </div>
            </th>
            #end
        </tr>
        #each(row,index in data)
        #if(index<12)
        <tr>
            #each(item in row)
            <td>
                <div class="wrapper">#{item}</div>
            </td>
            #end
        </tr>
        #end
        #end
    </table>
    #if(sumLength>12)<p>多余的 #{sumLength-12} 条未显示</p>#end
</div>
<input type="button" name="step" class="btn" value="&lt;&lt; 重新粘贴数据" data-go="fill-excel-data">
<input type="button" name="step" class="btn btn-confirm" value="预览数据 &gt;&gt;" data-go="previewExcelData">