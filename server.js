var http = require("http");
var fs = require('fs');


function start(route,handle) 
{
	var style;
    fs.readFile('./public/css/bootstrap.css', function (err, data) 
	{
		if (err) {
			throw err; 
		}
		style = data;
		console.log("bootstrap.css was read");	
	});
	
	var bookspage;
    fs.readFile('./views/bookhome.htm', function (err, data) 
	{
		if (err) {
			throw err; 
		}
		bookspage = data;
		console.log("bookhome was read");
	});
	
	var jsrender;
    fs.readFile('./public/js/jsrender.js', function (err, data) 
	{
		if (err) {
			throw err; 
		}
		jsrender = data;
		console.log("jsrender.js was read");
	});
	
	var bootstrapModal;
    fs.readFile('./public/js/bootstrap-modal.js', function (err, data) 
	{
		if (err) {
			throw err; 
		}
		bootstrapModal = data;
		console.log("bootstrapModal.js was read");
	});
	
	
	
  function onRequest(request, response) {
   
	var staticPages = {};
	staticPages["/books"]= {page : bookspage, header : "text/html"};
	staticPages["/public/css/bootstrap.css"] = {page : style, header : "text/css"};
	staticPages["/public/js/jsrender.js"] = {page : jsrender, header : "text/javascript"};
	staticPages["/public/js/bootstrap-modal.js"] = {page : bootstrapModal, header : "text/javascript"};
	
	
	route(handle,request.url,response,staticPages);
	
    
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started. Listening at 8888");
}

exports.start = start;