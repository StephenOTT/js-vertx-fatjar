exports.vertxStart = function() {
  console.log("Starting 3 Verticle");
}
exports.vertxStop = function() {
  console.log('Stopping 3 Verticle');
}

vertx.createHttpServer().requestHandler(function (req) {
    req.response().putHeader("content-type", "text/html").end("<html><body><h1>Hello from vert.x3!</h1></body></html>");
}).listen(8086);