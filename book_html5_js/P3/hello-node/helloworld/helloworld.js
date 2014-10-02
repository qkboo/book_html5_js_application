var server = require('http'),
PORT = 2345;
server.createServer( function(request, response) {
    console.log('Request On');
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end('<h1>Hello, World</h1>');
}).listen(PORT, function () {
    console.log('Server Running at http://127.0.0.1:'+PORT);
});