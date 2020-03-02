//jshint esversion:6

const express = require ("express");
const bodyParser = require("body-parser");
const request = require("request");

const ba = require('bitcoinaverage');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));


var publicKey = 'MDRmNzBkMDU3NGEzNDk4NDkwY2YyY2JhZjI5MWJkMjM';
var secretKey = 'N2UxOWE5ZDc4YjM4NDZmNzg4OWM2M2M5MDE5YWRkMzcwOGQ3NzlhMDViNDc0ZjI1ODQ3YTYxNTlmNmYzYjI4MQ';

var restClient = ba.restfulClient(publicKey, secretKey);
var wsClient = ba.websocketClient(publicKey, secretKey);
var symbol_set = 'global';
var symbol;

app.post("/", (req, res) =>{

  symbol = req.body.crypto + req.body.fiat;
  console.log(symbol);

restClient.getTickerDataPerSymbol('global', symbol, function(response) {

    var data = JSON.parse(response);
    var price = data.last;
    var time = data.display_timestamp;

    res.write("<h1>The Price Of "+ req.body.crypto +" is " + price + " " + req.body.fiat +"</h1>");
    res.write("<p>The current date is " + time + "</p>");
    res.send();

}, function(error){
    console.log(error);
}) ;
//ge
});

// app.post("/",(req, res) => {
//
//   request("https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD", function(error, response, body){
//     // console.log(response);
//     var data = JSON.parse(body);
//     var price = data.last;
//     console.log(price);
//   });
//
// });




app.get("/",(req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port,() => {
  console.log("server is running on port 3000");
});
