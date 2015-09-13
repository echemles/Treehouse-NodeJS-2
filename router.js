var renderer = require("./renderer.js");
var querystring = require("querystring");
var lipsumtext = require("./lipsumtext.js")



var commonHeaders = {'Content-Type': 'text/html'};

function home(request, response) {
  if(request.url === "/") {
    if(request.method.toLowerCase() === "get") {
      response.writeHead(200, commonHeaders);  
      renderer.view("header", {}, response);
      renderer.view("textquery", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else {
      request.on("data", function(postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303, {"Location": "/" + query.amount + "_" + query.units});
        response.end();
      });
      
    }
  }
  
}

function generateLipsum(request, response) {
  var requestInfo = request.url.split("_");
  var amount = requestInfo[0].replace("/", "");
  var units = requestInfo[1];
  var requestedText = lipsumtext.textGenerator(amount, units);
  var values = {
      amount: amount,
      units: units,
      body: requestedText
  }
  response.writeHead(200, commonHeaders);
  if(amount) {
      renderer.view("header", {}, response);
      renderer.view("bodytext", values, response);
      renderer.view("footer", {}, response);
      response.end();
  };      
}

module.exports.home = home;
module.exports.generateLipsum = generateLipsum;