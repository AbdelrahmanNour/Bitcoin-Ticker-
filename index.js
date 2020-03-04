//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
  extended: true
}));

// -----------------------------------------------------using Free API----------------------------------------------------------

app.post("/", (req, res) => {

  var crypto = req.body.crypto;
  var fiat = req.body.fiat;
  var amount = Number(req.body.amount);
  var cryptoId = cryptoID(crypto);

  var baseUrl = "https://api.alternative.me/v1/ticker/" + cryptoId;

  var options = {
    url: baseUrl,
    method: "GET",
    qs: {
      convert: fiat
    }
  };

  request(options, function(error, response, body) {

    var data = JSON.parse(body);
    var price = fiat;
    var totalPrice;
    var date = convert(data[0].last_updated);


    if (price === "USD") {
      price = data[0].price_usd;
    } else if (price === "GBP") {
      price = data[0].price_gbp;
    } else {
      price = data[0].price_eur;
    }
    totalPrice = price * amount;
    res.write("<h1>" + amount + " " + crypto + " is currently worth " + totalPrice + " " + fiat + "</h1>");
    res.write("<p>Last update date is " + date + "</p>");
    res.write("<p>Note: This Free API pdate every 5 min</p>");
    res.send();
  });

});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log("server is running on port 3000");
});


//------------------------------------------------------- using course APIS--------------------------------------------------
// const ba = require('bitcoinaverage');
// var publicKey = 'MDRmNzBkMDU3NGEzNDk4NDkwY2YyY2JhZjI5MWJkMjM';
// var secretKey = 'N2UxOWE5ZDc4YjM4NDZmNzg4OWM2M2M5MDE5YWRkMzcwOGQ3NzlhMDViNDc0ZjI1ODQ3YTYxNTlmNmYzYjI4MQ';
//
// var restClient = ba.restfulClient(publicKey, secretKey);
// var wsClient = ba.websocketClient(publicKey, secretKey);
// var symbol_set = 'global';
// var symbol;
//
// app.post("/", (req, res) =>{
//
//   symbol = req.body.crypto + req.body.fiat;
//   console.log(symbol);
//
// restClient.getTickerDataPerSymbol('global', symbol, function(response) {
//
//     var data = JSON.parse(response);
//     var price = data.last;
//     var time = data.display_timestamp;
//
//     res.write("<h1>The Price Of "+ req.body.crypto +" is " + price + " " + req.body.fiat +"</h1>");
//     res.write("<p>The current date is " + time + "</p>");
//     res.send();
//
// }, function(error){
//     console.log(error);
// }) ;
// });

// ---------------------------------------------------------------Functions---------------------------------------------------------------
function cryptoID(id) {
  if (id === "BTC") {
    return "bitcoin/";
  } else if (id === "ETH") {
    return "ethereum/";
  } else {
    return "litecoin/";
  }
}

function rePrice(price) {
  if (price === "USD") {
    return data[0].price_usd;
  } else if (price === "GBP") {
    return data[0].price_gbp;
  } else {
    return data[0].price_eur;
  }
}

function convert(timestamp) {
  // Unixtimestamp
  var unixtimestamp = timestamp;
  // Months array
  var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp * 1000);
  // Year
  var year = date.getFullYear();
  // Month
  var month = months_arr[date.getMonth()];
  // Day
  var day = date.getDate();
  // Hours
  var hours = date.getHours();
  // Minutes
  var minutes = "0" + date.getMinutes();
  // Seconds
  var seconds = "0" + date.getSeconds();
  // Display date time in MM-dd-yyyy h:m:s format
  var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return convdataTime;
}
