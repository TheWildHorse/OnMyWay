var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var path = require('path');
var https = require('https');

// === HELPER FUNCTIONS ===
function getRandomString(b){for(var a=(Math.random()*eval("1e"+~~(50*Math.random()+50))).toString(36).split(""),c=3;c<a.length;c++)c==~~(Math.random()*c)+1&&a[c].match(/[a-z]/)&&(a[c]=a[c].toUpperCase());a=a.join("");a=a.substr(~~(Math.random()*~~(a.length/3)),~~(Math.random()*(a.length-~~(a.length/3*2)+1))+~~(a.length/3*2));if(24>b)return b?a.substr(a,b):a;a=a.substr(a,b);if(a.length==b)return a;for(;a.length<b;)a+=getRandomString();return a.substr(0,b)};

// === INITIALIZE DATABASE ===
var DBURL = 'mongodb://localhost:27017/onmyway';
var MongoExecute = function(executeFunction) {
  MongoClient.connect(DBURL, function(err, db) {
    assert.equal(null, err);
    executeFunction(err, db);
  });
}

// === INITIALIZE EXPRESS ===
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('views', path.join(__dirname, 'views/'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static('public'));

// === PUBLIC ROUTES ===
app.get('/', function(req, res){
    res.render('new');
});
app.post('/new', function(req, res) {
    var document = req.body;
    document.streamId = getRandomString(32);
    document.trackId = getRandomString(16);
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ encodeURIComponent(document.location) +"&key=AIzaSyDBecf7sU40-bqxOPP-zLhiZXHVlzGeAhI"
    https.get(url, function(response){
        var body = '';
        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){
            var data = JSON.parse(body);
            document.destination = data.results[0].geometry.location;
            MongoExecute(function(err, db) {
                db.collection('sessions').insertOne(document, function(err, result) {
                    console.log("New session created.");
                    return res.json({streamId: document.streamId});
                });
            });
        });
    }).on('error', function(e){
        console.log("Error geocoding locationa: ", e);
    });
});
app.get('/broadcast/:streamId', function(req, res) {
    var streamId = req.params.streamId;
    MongoExecute(function(err, db) {
        db.collection('sessions').find({streamId: streamId}).toArray(function(err, document) {
            res.render('map', {type: 'broadcast', streamId: streamId, trackId: document[0].trackId});
        });
    });
});
app.get('/track/:trackId', function(req, res) {
    var trackId = req.params.trackId;
    res.render('map', {type: 'track', trackId: trackId});
});
app.post('/data/:streamId', function(req, res) {
    var streamId = req.params.streamId;
    var lat = parseFloat(req.body.lat);
    var lng = parseFloat(req.body.lng);
    if(isNaN(lat) || isNaN(lng)) {
        return res.send("Invalid parameters.");
    }
    MongoExecute(function(err, db) {
        db.collection('sessions').find({streamId: streamId}).toArray(function(err, document) {
            if(document[0] !== undefined) {
                db.collection('sessions').updateOne({streamId: streamId}, {$set: {lat: lat, lng: lng}});
                return res.json({success: true})
            }
            else {
                return res.send("Invalid streamId.");
            }
        });
    });
});
app.get('/data/:trackId', function(req, res) {
    var trackId = req.params.trackId;
    MongoExecute(function(err, db) {
        db.collection('sessions').find({trackId: trackId}).toArray(function(err, document) {
            if(err) {
                return res.send(err);
            }
            return res.send(document[0]);
        });
    });
});


// === WEBSOCKET SERVER ===
http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
});



app.get('/door-open', function(req, res){
  io.sockets.emit('event',{type:'door-open'});
  console.log('Door open event!')
  res.json({"success": "true"});
});

app.get('/special-door-open', function(req, res){
  io.sockets.emit('event',{type:'forceSpecialDoorOpen'});
  console.log('Special door open event!')
  res.json({"success": "true"});
});

app.get('/refresh', function(req, res){
  io.sockets.emit('event',{type:'refresh'});
  console.log('Refresh event!')
  res.json({"success": "true"});
});