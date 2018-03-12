exports.vertxStart = function() {
  console.log("Starting primary verticle")
}
exports.vertxStop = function() {
  console.log('Stopping primary verticle')
}

var _ = require('lodash')

// loads config.json file
var cfg = Vertx.currentContext().config()
if (_.isEmpty(cfg)){
  // throw ('config.json is empty!!!')
  vertx.close(function(){
    console.error('Vertx instance has been stopped because of empty or missing config.json file')
  })
} else {
  console.log('config.json contents:')
  console.log(JSON.stringify(cfg))

  deployVerticles()
  startHttpServer()
  deployRubyVerticle()
}

function deployVerticles() {
  vertx.deployVerticle('verticles/vert2/MyJavaScriptVerticle2.js')
  vertx.deployVerticle('verticles/vert3/MyJavaScriptVerticle3.js')
}

function startHttpServer() {
  vertx.createHttpServer().requestHandler(function (req) {
      req.response().putHeader("content-type", "text/html").end("<html><body><h1>Hello from vert.x1!</h1></body></html>");
  }).listen(8080)
}

function deployRubyVerticle() {
  var rubyOptions = {
    "config": {
      "GEM_PATH": "bundle/jruby/2.3.0/"
    },
    "worker" : true
  }
  vertx.deployVerticle('verticles/ruby-working-hours/working-hours-vert.rb', rubyOptions)
}