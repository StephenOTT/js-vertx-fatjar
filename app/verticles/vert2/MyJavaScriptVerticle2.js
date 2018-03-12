exports.vertxStart = function() {
  console.log("Starting 2 Verticle");
}
exports.vertxStop = function() {
  console.log('Stopping 2 Verticle');
}

var _ = require('lodash')
var myObject = {}
console.log(_.isEmpty(myObject))

vertx.createHttpServer().requestHandler(function (req) {
    req.response().putHeader("content-type", "text/html").end("<html><body><h1>Hello from vert.x2!</h1></body></html>");
}).listen(8081);