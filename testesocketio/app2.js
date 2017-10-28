'use strict'
var express = require('express');
var app     = express();
var http    = require("http").createServer(app);
var io      = require('socket.io')(http);

// ***********************************************************
// INÍCIO FUNÇÕES SALT
// ***********************************************************

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var request   = require('request');
var client    = "local";
var fun       = "test.ping";
// var tgt       = "D104125,D104140,D104141,D104142";
var tgt       = "172.21.217.0/26";
// var tgt      = "D132609,D132608,D132607,D132619,D132598,D132610,D132611,D132591,D132613,D32615,D132684,D132623,D132628,D32630,D132592,D132617";
// var tgt2      = "D132597,D132607,D132600,D132629,D132616,D132590,D132618";
// var tgt3      = "D102580,D102516,D102585,D102530,D102512,D102560,D102545,D102455,D102469,D102569,D102513,D102548,D102502,D102554,D102500,D102467,D102521,D102544,D102581,D102459,D102541,D102552,D102575,D102489,D102535,D102452,D102594,D102558,D102549,D102584,D102482,D102596,D102562,D102506,D102531,D102586";
var tgt_type  = "ipcidr";
var username  = "usjc";
var password  = "c0ck#U"; 
var eauth     = "pam";
var saltJSON;
var saltJSONarray = {};

//******************************************************************************************************************** */
// Function:: execSalt
// Objetivo:: Fazer requisições a API do Salt 
// Parâmetros:: client  : local ou run
//              tgt     : *,minion_id, -S <range_ip>
//              tgt_type: list, ipcidr
//              username: usuário com acesso 
//              password: senha de acesso
//              fun     : função a ser executada ex: test.ping, manage.up,etc..
//              eauth   : tipo de autenticação no caso pam
//              callback: função para retorno da API
//******************************************************************************************************************** */
const execSalt = function( client, tgt, tgt_type,username, password, fun, eauth, callback ){
  var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  var dataString = 'client='+client+'&tgt='+tgt+'&tgt_type='+tgt_type+'&username='+username+'&password='+password+'&fun='+fun+'&eauth='+eauth;
  var options = {
      url     : 'https://172.20.23.6:8000/run',
      method  : 'POST',
      headers : headers,
      body    : dataString
  }

  request(options, function( error, response, body ){
    saltJSON = body;
    callback(body);
    //console.log(saltJSON);

   //    if (!error && response.statusCode == 200) {
   //     return_json = JSON.parse(body);
   //  } else {
   //    return_json = error;
   //  }

  });
}

// FIM FUNÇÕES SALT

app.get('/', function(req, res){
    res.sendFile( __dirname+'/index2.html');
});

io.on('connection', function(socket){

  const guardarBody = function(){
    saltJSONarray = JSON.parse(saltJSON);
  }
  
  function tick() {
    var counter_minions = 0;
    execSalt(client, tgt, tgt_type, username, password, fun, eauth, guardarBody);
    var minion_id,minion_status = "";
    var obj, obj2;
    for (obj in saltJSONarray) {
      for (obj2 in saltJSONarray[obj][0]){
        console.log(obj2+' : '+saltJSONarray[obj][0][obj2]);
        if (saltJSONarray[obj][0][obj2] == true){
          minion_id = obj2;
          // minion_status = saltJSONarray[obj][0][obj2];
          counter_minions++;
          minion_status += "<div data-sort='"+counter_minions+"'>"+minion_id + "<img src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ_as1m9c965EeP3OJ2k7Oy7n5HuuDs4bbAYCIb2--78GMXooA8ZQ'></div>";
        }
      }
    }
    socket.emit('saltJSON', { counter_minions:counter_minions, minion_id:minion_id, minion_status:minion_status });
  }
  setInterval(tick, 3000);
});

http.listen(3000, function(req, res){
  console.log('listening on *:3000');
});
