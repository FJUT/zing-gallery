var AV = require('leanengine');

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();



require('events').EventEmitter.prototype._maxListeners = 100;
var resize = require('./lib/resize'),
cfg = require('./config'),
express = require('express'),
host = process.env.OPENSHIFT_NODEJS_IP;

var photosPath = './resources/photos';
resize.init(photosPath)

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets/dist/'));
app.use('/', require('./lib/gallery.js')(Object.assign({
  staticFiles : 'resources/photos',
  urlRoot : '/',
  title : 'Zing Gallery',
  render : false
}, cfg)), function(req, res, next){
  return res.render('gallery', Object.assign({ 
  	galleryHtml : req.html
  }, cfg));
});

// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

app.listen(PORT, host);
host = host || 'localhost';
console.log('zing-gallery listening on ' + host  + ':' + PORT);
