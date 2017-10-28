var http = require('http'),
    url = require('url');

var opts = url.parse('http://172.20.23.6/run'),
    data = { username:'usjc',password:'c0ck#U',client:'local',tgt:'D159695',fun:'test.ping',eauth:'pam'};
opts.headers = {};
opts.headers['Content-Type'] = 'application/json';

http.request(opts, function(res) {
  // do whatever you want with the response
  res.pipe(process.stdout);
}).end(JSON.stringify(data));
