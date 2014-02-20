/**
module2 dependencie
 */

var express = require('express')
var http = require('http')
var path = require('path')

var app = express();

exports.app = app

var db = require('db')

db.open(function () {

    // all environments
    app.set('port', process.env.PORT || 1280);
    app.set('views', path.join(__dirname, 'views'));
    app.locals.basedir = './views'
    app.set('view engine', 'jade');
    app.set('view cache', false)
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

    //req.body实体大小为51M
    app.use(express.limit(51 * 1024 * 1000));
    app.use(express.bodyParser({keepExtensions: false, uploadDir: __dirname + '/temp'}));

    app.use(express.cookieParser('work-flow'));
    app.use(require('stylus').middleware(path.join(__dirname, 'assets')));
    app.use(express.static(path.join(__dirname, 'assets')));

    //session store
    console.log('session-store')
    var MongoSessionStore = require('connect-mongo')(express);
    app.use(express.session({
        secret: 'ued-workflow',
        store: new MongoSessionStore({
            db: 'workflow-session'
        })
    }));

    process.env.NODE_ENV = 'production'

    // development only
    if ('development' == process.env.NODE_ENV) {
        app.use(express.errorHandler());
        global.assetsCDN = 'http://localhost:1280'
        global.imgCDN = 'http://localhost:1280'
        global.hostDOMAIN = 'http://localhost:1280'
    }

    if ('production' == process.env.NODE_ENV) {
        global.assetsCDN = 'http://sjplus.wicp.net'
        global.imgCDN = 'http://sjplus.wicp.net'
        global.hostDOMAIN = 'http://sjplus.wicp.net'
    }

    app.use(express.csrf());

    app.use(function (req, res, next) {
        res.locals.req = req
        res.locals.token = req.csrfToken()
        res.locals.timerZeros = function (str) {
            if (str === undefined) return ''
            str = str.toString()
            return typeof str === 'string' && str.length < 2 ? '0' + str : str;
        }
        next();
    });


    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

    require('./routes')

})

