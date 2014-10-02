var multiparty = require('multiparty'),
  http = require('http'),
  util = require('util'),
  path = require('path'),
  fs = require('fs'),
  PORT = 12345;

http.createServer(function(req, res) {


  if (req.url === '/') {

    var filePath = '.' + req.url;
    if (filePath == './')
      filePath = './index.html';
      
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
    
    fs.exists(filePath, function(exists) {
    
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

  } else if (req.url == '/upload' && req.method == 'POST') {
    // Processing Form Upload
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      if (err) {
        res.writeHead(400, {'content-type': 'text/plain'});
        res.end("invalid request: " + err.message);
        return;
      }
      var temp_path = files.upload[0].path;
      var save_path = "/tmp/" + files.upload[0].originalFilename;
      console.log( temp_path + "\n\n" + save_path);
      fs.rename(temp_path, save_path, function(error){
        if(error) throw error;
        fs.unlink(temp_path, function(){
          if(error) throw error;

          res.writeHead(200, {'content-type': 'text/plain'});
          res.write('received fields:\n\n '+util.inspect(fields));
          res.write('\n\n');
          res.end('received files:\n\n '+util.inspect(files));

        });
      });     
    });

  } else {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('404');
  }

}).listen(PORT, function() {
  console.log('Server Running at http://localhost:' + PORT);
});