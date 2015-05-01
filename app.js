
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  , model = require('./classes/model')
  , controller = require('./controllers/controller')
  , mail = require('./classes/mail_sender')
  , token = require('./classes/token')
  , authentication = require('./classes/authentication');
var fs = require('fs');
var app = express();
var MongoStore = require('connect-mongo')(express);
// all environments

app.set('port', process.env.PORT || 1111);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { pretty: false });
app.use(express.favicon(path.join(__dirname + '/public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('S3CRE7'));
app.use(express.session({
  store: new MongoStore({
    url: 'mongodb://mawuser:MAWP@ssword1!@ds037087.mongolab.com:37087/mawlibrary',
  })
 }));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('/api_1.0/*', authentication.verifyHeader);
app.get('/', function(req,res){res.redirect('/Dashboard')});
app.get('/Dashboard', controller.dashboard);
app.get('/Dashboard/Scores', controller.searchScores);
app.get('/Dashboard/Scores/:id', controller.getScore);
app.get('/Dashboard/Recordings',  controller.searchRecordings);
app.get('/Dashboard/Recordings/:id',  controller.getRecording);

app.get('/Dashboard/NewScore',  controller.newScore);
app.get('/Dashboard/NewRecording',  controller.newRecording);


app.get('/Dashboard/Login',  function(req,res){res.render('login', {})});
app.get('/Logout',  controller.logout);
app.post('/Dashboard/Verify',  controller.verifyUser);

app.post('/SearchScores', controller.searchScoresRequest);
app.post('/SearchRecordings', controller.searchRecordingsRequest);

app.post('/UpdateScore', controller.updateScore);
app.post('/UpdateRecording', controller.updateRecording);

app.post('/CreateScore', model.createScore);
app.post('/CreateRecording', model.createRecording);

app.post('/DeleteScore', model.deleteScore);
app.post('/DeleteRecording', model.deleteRecording);

app.post('/CreateAdmin', model.createAdmin);


app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});

//////////////////////////////////
///User API starts here///////////
//////////////////////////////////

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});