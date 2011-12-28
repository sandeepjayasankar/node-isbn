var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.book;
handle["/book"] = requestHandlers.book;
handle["/home"] = requestHandlers.home;
handle["/contact"] = requestHandlers.contact;
handle["/public/css/bootstrap.css"] = requestHandlers.style;
handle["/book/search"] = requestHandlers.search;
handle["/book/price"] = requestHandlers.price;
handle["/public/js/jsrender.js"] = requestHandlers.jsrender;



server.start(router.route,handle);