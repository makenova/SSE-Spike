var http = require('http');
var request = require('request');
var fs = require('fs');

var server = http.createServer(function(req, res){
  if (req.url === '/events') {
    res.writeHead(200, { 
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    var id = setInterval(function () {
      request('http://www.iheartquotes.com/api/v1/random', function (err, response, body) {
        if (err || response.statusCode !==200)
          throw err;
        chunkify(body, function (lines){
          res.write('event: quote\n');
          lines.forEach(function (line) {
            res.write('data: ' + line + '\n');
          });
          res.write('\n\n')
        })
      })
    }, 15000);

    req.on('end', function(){
      clearInterval(id);
    });
  } else if (req.url === '/index'){
    return fs.readFile('./sseClient.html', function (err, file) {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(file);
    });
  }
});

/*
* Break a string into newlines so it can be streamed via SSE.
* Arguments:
* stringBlob    a string that possibly contains new lines '\n'
* callback    invoked on the array of lines
*/
function chunkify (stringBlob, callback) {
  callback(stringBlob.split('\n'));
}

server.listen(3000);