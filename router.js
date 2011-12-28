var url = require("url");

function route(handle,requesturl,response)
{

	var pathname = url.parse(requesturl).pathname;
   // console.log("Request for " + pathname + " received.");
	
	var url_parts = url.parse(requesturl, true);
    var query = url_parts.query;

    console.log(query); //{Object}
	//console.log("About to route a request for " + pathname);
	
    
	if (typeof handle[pathname] === 'function') 
	{
		handle[pathname](response,query);
	} 
	else 
	{
		response.write("No request handler found for " + pathname);
		response.end();
	}
    
}

exports.route = route;