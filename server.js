var http = require("http");


function start(route,handle) {
  function onRequest(request, response) {
    
	
	route(handle,request.url,response);
	
    
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started. Listening at 8888");
}

exports.start = start;