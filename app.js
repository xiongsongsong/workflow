/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

exports.app = app

var db = require('db')

db.open(function () {

    // all environments
    app.set('port', process.env.PORT || 80);
    app.set('views', path.join(__dirname, 'views'));
    app.locals.basedir = './views'
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
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

    app.use(express.csrf());

    app.use(express.errorHandler());

    // development only
    if ('development' == app.get('env')) {
        global.assetsCDN = 'http://localhost'
        global.imgCDN = 'http://localhost'
        global.hostDOMAIN = 'http://localhost'
    }

    if ('production' == app.get('env')) {
        global.assetsCDN = 'http://localhost'
        global.imgCDN = 'http://localhost'
        global.hostDOMAIN = 'http://localhost'
    }

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

    require('./routes')

})

