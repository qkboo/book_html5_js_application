var http = require('http'), 
  url = require('url'),
  path = require('path');
var fs = require('fs');
var PORT = 12345;

http.createServer(function (req, res) {
  
  var filePath = '.' + req.url;
  if (filePath == './')
    filePath = './map-googlemaps.html';
    
  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }
  
  path.exists(filePath, function(exists) {
  
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
        }
        else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    }
    else {
      res.writeHead(404);
      res.end();
    }
  });
  
}).listen(PORT, function() {
  console.log('Server Running at http://localhost:' + PORT);
});
