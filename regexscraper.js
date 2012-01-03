var http = require('http');

var winston = require('winston');

 function scrapeOld(res,req)
 {
	var isbn = req.params.id;
	
	 var items = new Array();
	 var optionsArray = new Array();
		optionsArray[0] = {
			host: "www.flipkart.com",
			path: "/books/"+isbn,
			merchant: "flipkart",
				regex: /Rs.<span.*<\/span>(\d*\d)<\/span>/g,
				price: 0
			};
		optionsArray[1] = {
			host: "www.landmarkonthenet.com",
			path: "/search/?q="+isbn,
				merchant: "landmark",
				regex: /ctl00_ContentPlaceHolder1_rptBook_ctl00_lbl.*rice.*>(\d*\d)\/-/g,
				price: 0
			};

	for(i=0;i<optionsArray.length;i++)
	{
		//winston.info(optionsArray[i].host,optionsArray[i].path+isbn);
		//var options1 = {
		//	host: optionsArray[i].host,
		//		path: optionsArray[i].path,
		//		merchant: optionsArray[i].merchant,
		//		regex:optionsArray[i].regex
		//		}
			getScrape(res,optionsArray[i],
				function(){
				if(optionsArray.length==items.length)
					 {
						 res.render('index', {
									 title: isbn,
										 itemlist: items
										 });
					 }
				
				},
				function(item){items.push(item);winston.info("items.length -"+items.length);winston.info(items.length+ ": "+item.merchant,item.price);});
	}
	
	
 }
function scrapePrice(isbn,store,response)
{
	var storeDetails = {};
	storeDetails["flipkart"] = {
			host: "www.flipkart.com",
			path: "/books/"+isbn,
			merchant: "flipkart",
				regex: /Rs.<span.*<\/span>(\d*\d)<\/span>/g,
				price: 0,
				url:"http://www.flipkart.com/books/"+isbn+"?affid=sandeepweb"
			};
	
	storeDetails["landmark"] = {
			host: "www.landmarkonthenet.com",
			path: "/books/"+isbn,
				merchant: "landmark",
				regex: /<span class="current-price"><span class="WebRupee">.*?<\/span><span class="WebRupee-print">Rs<\/span>(.*?)<\/span><\/p>/g,
				price: 0,
				url:"http://www.landmarkonthenet.com/books/"+isbn
			};
	storeDetails["uread"] = {
			host: "www.uread.com",
			path: "/search-books/"+isbn+"?affid=sandeep",
				merchant: "uread",
				regex: /<label id="ctl00_phBody_ProductDetail_lblourPrice">Our Price: <span> <span style ="font-family:rupee">R<\/span>(.*)<\/span><\/label>/g,
				price: 0,
				url:"http://www.uread.com/search-books/"+isbn+"?affid=sandeep"
			};

	
	storeDetails["indiaplaza"] = {
			host: "www.indiaplaza.com",
			path: "/search.aspx?storename=Books&srchkey=isbn&srchVal="+isbn,
				merchant: "indiaplaza",
				regex:  /<div class="tier1box2"><ul><li>Our Price : <span>Rs.(.*?)<\/span><\/li>/g,
				price: 0,
				url:"http://www.indiaplaza.com/search.aspx?storename=Books&srchkey=isbn&srchVal="+isbn
			};
			
	storeDetails["infibeam"] = {
			host: "www.infibeam.com",
			path: "/Books/search?q="+isbn,
				merchant: "infibeam",
				regex:  /<span class="infiPrice amount price">(.*?)<\/span>/g,
				price: 0,
				url:"http://www.infibeam.com/Books/search?q="+isbn
			};
	
	getPage(storeDetails[store],priceRespond,response);
		
}

function getPage(options,responseFunction,response)
{
	var url = require("url");
	http.get(options, function(pageRes)
	{
		var data = '';
		if(pageRes.statusCode==301||pageRes.statusCode==302)
		{
			var redirectURL = pageRes.headers.location;
			winston.info("redirectURL ->"+redirectURL);
			if(url.parse(redirectURL).hostname!=null)
			{			
				options.host = url.parse(redirectURL).hostname;
			}
			var url_parts = url.parse(redirectURL, true);
			var search = url_parts.search;
			options.path = url.parse(redirectURL).pathname+search;
			
			winston.info("Redirect to " + options.host+options.path);
			getPage(options,responseFunction,response);
			
		}
		else if(pageRes.statusCode==200)
		{
			pageRes.on('data', function(chunk) {data += chunk.toString();})
			.on('end', function() 
				{
					responseFunction(options,data,response);
				})	
		}
	}).on('error', function(e) {
					winston.info("Got error: " + e.message);
					return;
					});
	
}

function priceRespond(storeDetails,data,response)
{
	var returnStore = [{
		store:storeDetails.merchant,
		price:"Not Available",
		url:storeDetails.url,
		image:"Not Available"
	}];
	
	
	//winston.info(returnStore);
	response.writeHead(200, {"Content-Type": "application/json"});
	//response.write("Request handler 'search' was called.");
	//winston.info(data);
	
	while((match = storeDetails.regex.exec(data)))
	{
		returnStore[0].price = match[1];
		winston.info("price: "+returnStore[0].price);
	}
	
	response.write(JSON.stringify(returnStore));
	response.end();
}

function isbnScrape(id,response)
{
	var options = {
			host: "www.goodreads.com",
			path: "/book/show/"+id+"?format=json&key=Uzis4FMar7ijHBYkspw",
			};
	getPage(options,isbnRespond,response);
}

function isbnRespond(options,data,response)
 {
	//var regexISBN =  /isbn=.*([0-9]{13})/g;
	var regexISBN = /isbn=([0-9]*)&/g;
	var isbn;
	while((match = regexISBN.exec(data)))
	{
		isbn = match[1];
		winston.info("isbn: "+isbn);
	}
	scrape(isbn,response);
	//response.writeHead(302, {"Content-Type" : "text/plain",
	//						"location" : "/books/book/"+isbn});
	//winston.info("Request redirected to /books/book/"+isbn);
	//response.write("Request handler 'book' was called.");
	//response.end();	
 }
 
 function scrape(isbn,response)
 {
	var options = {
			//http://www.goodreads.com/book/isbn?callback=myCallback&format=json&isbn=0441172717
			//host: "www.goodreads.com",
			//path: "/book/isbn?isbn="+isbn.slice(-10)+"&format=json",
			host: "www.flipkart.com",
			path: "/books/"+isbn,
			merchant: "flipkart",
			isbn:isbn
			};
	winston.info("scrape for isbn: "+isbn);
	getPage(options,infoScrape,response);
	
			
			
 }
 
 
 
 function infoScrape(options,data,response)
 {
	var regexTitle = /<h1 itemprop="name" title="(.*)">/g;
	var regexAuthor = /<h2><a href="\/author\/.*>(.*)<\/a><\/h2>/g;
	// alternate regex for author/<td class="specs-key boldtext">Author: <\/td><td class="specs-value"><b>(?<=^|>)[^><]+?(?=<|$)<\/b><\/td>/g;
	var regexDesc = /<div class="item_desc_text description line" id="description_text">(.*?)</g;
	var regexImage = /<div class="mprodimg" id="mprodimg-id"> <img src="(.*?)"/g;
	
	var returnObj = [{
		title:"Not Available",
		author:"Not Available",
		desc:"Not Available",
		image:"Not Available",
		isbn:options.isbn
	}];
	
	response.writeHead(200, {"Content-Type": "application/json"});
	//response.write("Request handler 'search' was called.");
	
	while((match = regexTitle.exec(data)))
	{
		returnObj[0].title = match[1];
		winston.info("Title: "+returnObj[0].title);
	}
	while((match = regexAuthor.exec(data)))
	{
		returnObj[0].author = match[1];
		winston.info("Author: "+returnObj[0].author);
	}
	while((match = regexDesc.exec(data)))
	{
		returnObj[0].desc = match[1];
		winston.info("Desc: "+returnObj[0].desc);
	}
	while((match = regexImage.exec(data)))
	{
		returnObj[0].image = match[1];
		winston.info("Image: "+returnObj[0].image);
	}
	response.write(JSON.stringify(returnObj));
	response.end();
					
	
 }
 
  exports.scrape = scrape;
  exports.scrapePrice = scrapePrice;
  exports.isbnScrape = isbnScrape;

