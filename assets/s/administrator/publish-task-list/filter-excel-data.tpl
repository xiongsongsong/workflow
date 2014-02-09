<div class="content">
    #run var sumLength=data.length
    <table class="task-list select-field">
        <tr>
            #each(row,i in data[0])
            <th class="J-fields" data-cell="#{i}">
                <div class="wrapper">
                    <div class="fields-name">#{row}</div>
                </div>
            </th>
            #end
        </tr>
        #run data.shift()
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
<input type="button" name="step" class="btn btn-confirm" value="发布" data-go="publishTask">