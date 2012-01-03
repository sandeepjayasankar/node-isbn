console.log("searchBook module created");
var index = 1;
function searchBookGoodRead(keyword,displayFunction)
{
	console.log("searchBook Function");
	console.log("index"+index);
	index++;
	sleep(800);
	var http = require('http');
	
	var options = {
			//http://www.goodreads.com/search?query=
			host: "www.goodreads.com",
			path: "/search?query="+keyword+"&key=Uzis4FMar7ijHBYkspw",
			
			}
	http.get(options, function(pageRes)
	{
		console.log("pageRes.statusCode " + pageRes.statusCode);
		var data = '';
		if(pageRes.statusCode==200)
		{
			pageRes.on('data', function(chunk) {data += chunk.toString();})
			.on('end', function() 
				{
					console.log("displayFunction");
					displayFunction(data);
				})	
		}
	}).on('error', function(e) {
					console.log("Got error: " + e.message);
					return;
					});
}

function searchBook(keyword,displayFunction)
{
	console.log("searchBookAWS Function");
	var OperationHelper = require('apac').OperationHelper;

	var opHelper = new OperationHelper({
		awsId:     'AKIAIZ3E7SQNZARUSUSQ',
		awsSecret: '3uZJPgyGCPxp0ogbEYC28ER748bERDP15F2i3jtT',
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
				console.log('Error: ' + error + "\n") 
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