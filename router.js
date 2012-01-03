var url = require("url");
var winston = require('winston');


function route(handle,requesturl,response,staticPages)
{

	var pathname = url.parse(requesturl).pathname;
   // winston.info("Request for " + pathname + " received.");
	
	var url_parts = url.parse(requesturl, true);
    var query = url_parts.query;

    //winston.info("Query: "+query); //{Object}
	//winston.info("About to route a request for " + pathname);
	
    
	if (typeof handle[pathname] === 'function') 
	{
		handle[pathname](response,query);
	} 
	else if(staticPages[pathname]!= null)
	{
		//winston.info("writing head"+staticPages[pathname].header);
		response.writeHead(200, {"Content-Type": staticPages[pathname].header});
		//winston.info("writing page"+staticPages[pathname].page);
		response.write(staticPages[pathname].page);
		response.end();
	}
	else
	{
		response.writeHead(302, {"Content-Type" : "text/plain",
							"location" : "/books"});
		winston.info("Request redirected");
		response.write("No request handler found for " + pathname);
		response.end();
		
	}
    
}

exports.route = route;