var express = require('express');
var requests = require('request');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  var url = req.query.q;
  console.log(url);
  
  requests.get(url, function (err, response, body) {
    if (err) console.log(err);
    res.end(body);
  });
});

app.listen(3000);
