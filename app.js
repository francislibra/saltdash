var express = require('express');
var app = express();
var http = require("http").createServer(app);
var io = require('socket.io')(http);

process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

app.get('/', function(req, res){
    res.sendFile( __dirname+'/index.html');
});

app.use('/css',express.static('css'));
app.use('/images',express.static('images'));
app.use('/js',express.static('js'));
app.use('/pages',express.static('pages'));
app.use('/plugins',express.static('plugins'));
app.use('/css',express.static('css'));

io.on('connection', function(socket){
  var counter = 0;

	function tick() {
		counter = counter + 1;
		socket.emit('tick', counter);
	};
	setInterval(tick, 1000);

});

http.listen(3000, function(req, res){


  console.log('listening on *:3000');
});
