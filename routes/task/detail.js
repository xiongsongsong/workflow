/**
 * Created by 松松 on 14-2-9.
 */

var app = require('app')

app.get(/\/task\/detail\/([a-z0-9]{24})/, function (req, res) {
    res.end(req.params[0])
})