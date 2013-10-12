var express = require('express');
var requests = require('request');
var phantom = require('node-phantom');
var fs = require('fs');
var util = require('util');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/url', function (req, res) {
  var url = req.query.q;
  console.log(url);

  phantom.create(function (err, ph) {
    ph.createPage(function (err, page) {
      page.open(url, function (err, status) {
        page.includeJs('http://localhost:3000/jquery-2.0.3.min.js', function (err) {
          if (err) console.log(err);
          page.evaluate(function () {
            var arr = [];
            $('a').each(function (i, a) {
              arr.push(a.href);
            });

            return $.unique(arr);
          }, function (err, data) {
            if (err) console.log(data);
            res.json(data);
            console.log(data); 
          });
        });
      });
    });
  });
});

app.listen(3000);
