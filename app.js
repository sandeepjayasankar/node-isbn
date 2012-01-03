var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.home;
handle["/home"] = requestHandlers.home;
handle["/contact"] = requestHandlers.contact;
handle["/books/search"] = requestHandlers.search;
handle["/books/price"] = requestHandlers.price;
handle["/books/book"] = requestHandlers.book;
handle["/books/book/.*"] = requestHandlers.bookPage;

// static pages handled in server
//handle["/books"] = requestHandlers.books;
//handle["/public/css/bootstrap.css"] = requestHandlers.style;
//handle["/public/js/jsrender.js"] = requestHandlers.jsrender;

server.start(router.route,handle);