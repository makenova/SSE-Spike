var http = require('http');
var request = require('request');
var rand = true;

var server = http.createServer(function(req, res){
  if (req.url != '/events') return res.end();
  res.writeHead(200, { 
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
    'Access-Control-Allow-Origin': '*'
  });

  // var id = setInterval(function(){
  //   rand = !rand;
  //   console.log(rand);
  //   if (rand){
  //     res.write('event: poke\n'+ 'data: boo\n\n');
  //   }else{
  //     var date = new Date().toLocaleString();
  //     res.write('data: ' + date.slice(0, date.lastIndexOf(' GMT')) + '\n\n');
  //   }
  // }, 1000);

  var id = setInterval(function () {
    request('http://www.iheartquotes.com/api/v1/random', function (err, response, body) {
      if (err || response.statusCode !==200)
        throw err;
      console.log(body);
      res.write('data: ' + JSON.stringify(body) + '\n\n');
    })
  }, 30000)

  req.on('end', function(){
    clearInterval(id);
  });
});

/*
* Break a string into newlines so it can be streamed via SSE. If the stringBlob
* does not contain any new lines, it is returned as is.
* Arguments:
* stringBlob    a string that possibly contains new lines '\n'
* callback    invoked for every line of the stringBlob takes the argument (line)
*/
function chunkify (stringBlob) {
  callback(blob.split('\n'));
}

server.listen(3000);