var http = require("http"),
util = require("util"),
PORT = 12345,
HOST = "127.0.0.1";
 
function myFunction() {
    return "hi... function";
}
http.createServer(function(request, response) {
    console.log("Start Server...");

    // 쿠키를 추출하고 분해합니다.
    var cookie = request.headers.cookie;
    
    console.log("console.log: " + request.headers);
    console.log("console.log: " + util.inspect(request.headers));
    util.puts("sys.puts: " + request.headers);
    util.puts("sys.inspect: " + util.inspect(myFunction));

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end('<h1>Hello, World</h1>');
    
}).listen(PORT, HOST);
