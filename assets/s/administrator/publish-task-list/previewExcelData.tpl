<div class="content" style="height: 400px;overflow: auto;">
    <div>
        <label><input type="radio" name="company" checked="checked" value="阿里巴巴">阿里巴巴</label>
        <label><input type="radio" name="company" value="京东">京东</label>
        <label><input type="radio" name="company" value="腾讯">腾讯</label>
        <label><input type="radio" name="company" value="其他">其他</label>
    </div>
    <table class="task-list">
        <tr>
            #each(name in fieldsArray)
            <th>
                <div class="wrapper">
                    <div class="fields-name">#{name}</div>
                </div>
            </th>
            #end
        </tr>
        #each(row in data)
        <tr>
            #each(_row in row)
            <td>
                <div class="wrapper">#{_row}</div>
            </td>
            #end
        </tr>
        #end
    </table>
</div>
<input type="button" name="step" class="btn" value="&lt;&lt;返回上一步" data-go="filter-excel-data">
<input type="button" name="step" class="btn btn-confirm" value="保存任务并通知设计师 &gt;&gt;" data-go="4">