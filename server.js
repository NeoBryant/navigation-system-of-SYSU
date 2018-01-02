'use strict'

var path = require('path');
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function (request, response) {

  var point1 = parseInt(querystring.parse(url.parse(request.url).query).point1);
  var point2 = parseInt(querystring.parse(url.parse(request.url).query).point2);
  var flag = parseInt(querystring.parse(url.parse(request.url).query).flag);
  var toIndexPage = parseInt(querystring.parse(url.parse(request.url).query).toIndexPage);

  if (url.parse(request.url).pathname === '/temp.html') {
    showPathInMap(flag, point1, point2, response);
  } else {
    var pathname = url.parse(request.url).pathname;
    showPage(request, response, pathname);
  }
});
server.listen(8000);
console.log('The server is running at http://localhost: 8000');


var showPathInMap = function(flag, point1, point2, response) {
	fs.readFile('main.html', function(err,data) {
		if (err) {
			console.log('404 main.html');
			response.writeHead(404);
			response.end('404 not found');
		} else {
			console.log('200 main.html');
			response.writeHead(200, {"Content-Type": "text/html"});
			var newHtml = data.toString();
      newHtml = newHtml.replace('**0', flag);
			newHtml = newHtml.replace('**1', point1);
			newHtml = newHtml.replace('**2', point2);
			response.end(newHtml);
		}
	});
}

var showPage = function(request, response, pathname) {
  var filePath = __dirname + pathname;
  var myType = getMimeType(pathname);
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, function(err, data){
      if (err) {
        console.log(filePath+'is not found');
        response.writeHead(500);
        response.end('there is an error');
      } else {
        console.log(pathname);
        response.setHeader("Content-Length", data.length);
        response.setHeader("Content-Type", myType);
        response.statusCode = 200;
        response.end(data);
      }
    });
  } else {
    console.log(filePath);
    response.writeHead(500);
    response.end();
  }
}

function getMimeType(pathname) {
  var validExtensions = {
    ".html" : "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".png": "image/png"
  };
  var ext = path.extname(pathname);
  var type = validExtensions[ext];
  return type;
}