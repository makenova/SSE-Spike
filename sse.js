var http = require('http');
var request = require('request');
var fs = require('fs');

http.createServer(function(req, res){
  if (req.url === '/events') {
    sseHandler(req, res);
  } else if (req.url === '/index'){
    return fs.readFile('./sseClient.html', function (err, file) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(file);
    });
  }
}).listen(3000);

/*
* Establish a connection to clients.
* Arguments:
* req    the http request object
* res    the http response object
*/
function sseHandler (req, res) {
  res.writeHead(200, { 
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  fetchSendQuote(res);
  var id = setInterval(fetchSendQuote, 15000, res);

  req.on('end', function(){
    console.log('client ' + id + ' disconnected');
    clearInterval(id);
  });
}

/*
* Fetch random quote and stream it to the client.
* Arguments:
* res    the http response object
*/
function fetchSendQuote (res) {
  request('http://www.iheartquotes.com/api/v1/random', function (err, response, body) {
    if (err || response.statusCode !==200)
      throw err;
    res.write('event: quote\n');
    body.split('\n').forEach(function (line) {
      res.write('data: ' + line + '\n');
    });
    res.write('\n\n');
  });
}