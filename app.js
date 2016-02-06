var express = require('express'),
    login = require('./routes/login'),
    store_img = require('./routes/store');

var app = express();

var path = require("path");

app.set(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/writable'));
  app.use(app.router);
  app.use(express.multipart());
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'writable')));


app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/user/index.html'));
});
app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/user/login.html'));
});
app.get('/ads', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/user/advertise.html'));
});
app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/user/home.html'));
});
app.get('/add', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/user/add.html'));
});
app.get('/otp', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/user/otp.html'));
});


app.get('/admin', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/admin/login.html'));
});
app.get('/admin/home', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/admin/home.html'));
});
app.get('/admin/print', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/admin/print.html'));
});


app.get('/about', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/extra/one.html'));
});
app.get('/contact', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/extra/two.html'));
});
app.get('/faqs', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/extra/three.html'));
});



app.get('/pof_api/login/login/:id/:pass', login.login);
app.get('/pof_api/login/register/:name/:mail/:phone/:pass', login.register);

app.post('/img/add', store_img.upload);
app.get('/getbyid/:id', store_img.getid);
app.get('/getbyuser/:id', store_img.getuser);
app.get('/get', store_img.findall);

app.listen(80);
console.log('Listening on port 80...');
