var url = require("url");

function route(handle,requesturl,response,staticPages)
{

	var pathname = url.parse(requesturl).pathname;
   // console.log("Request for " + pathname + " received.");
	
	var url_parts = url.parse(requesturl, true);
    var query = url_parts.query;

    //console.log("Query: "+query); //{Object}
	//console.log("About to route a request for " + pathname);
	
    
	if (typeof handle[pathname] === 'function') 
	{
		handle[pathname](response,query);
	} 
	else if(staticPages[pathname]!= null)
	{
		//console.log("writing head"+staticPages[pathname].header);
		response.writeHead(200, {"Content-Type": staticPages[pathname].header});
		//console.log("writing page"+staticPages[pathname].page);
		response.write(staticPages[pathname].page);
		response.end();
	}
	else
	{
		response.writeHead(302, {"Content-Type" : "text/plain",
							"location" : "/books"});
		console.log("Request redirected");
		response.write("No request handler found for " + pathname);
		response.end();
		
	}
    
}

exports.route = route;