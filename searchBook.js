var winston = require('winston');
winston.info("searchBook module created");
var index = 1;
function searchBookGoodRead(keyword,displayFunction)
{
	winston.info("searchBook Function");
	winston.info("index"+index);
	index++;
	sleep(800);
	var http = require('http');
	
	var options = {
			//http://www.goodreads.com/search?query=
			host: "www.goodreads.com",
			path: "/search?query="+keyword+"&key=",
			
			}
	http.get(options, function(pageRes)
	{
		winston.info("pageRes.statusCode " + pageRes.statusCode);
		var data = '';
		if(pageRes.statusCode==200)
		{
			pageRes.on('data', function(chunk) {data += chunk.toString();})
			.on('end', function() 
				{
					winston.info("displayFunction");
					displayFunction(data);
				})	
		}
	}).on('error', function(e) {
					winston.info("Got error: " + e.message);
					return;
					});
}

function searchBook(keyword,displayFunction)
{
	winston.info("searchBookAWS Function");
	var OperationHelper = require('apac').OperationHelper;

	var opHelper = new OperationHelper({
		awsId:     '',
		awsSecret: '',
		assocId:   '[YOUR ASSOCIATE TAG HERE]',
	});

	opHelper.execute('ItemSearch', {
		'SearchIndex': 'Books',
		'Keywords': keyword,
		'ResponseGroup': 'ItemAttributes'
	}, function(error, results) 
		{
			if (error) 
			{ 
				winston.info('Error: ' + error + "\n") 
			}
			displayFunction(results);
		});
		
}


function sleep(milliSeconds) 
{
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}
exports.searchBook = searchBook;