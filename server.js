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
    if (err) {
      res.end();
      ph.close();
      return console.log(err);
    }

    return ph.createPage(function (err, page) {
      if (err) {
        res.end();
        ph.exit();
        return console.log(err);
      }
      return page.open(url, function (err, status) {
        page.includeJs('http://localhost:3000/jquery-2.0.3.min.js', function (err) {
          if (err) {
            res.end();
            ph.exit();
            return console.log(err);
          }
          return page.evaluate(function () {
            var hrefs = [];

            $('a').each(function (i, a) {
              if ($.inArray(a.href, hrefs) === -1) {
                hrefs.push(a.href);
              }
            });

            return hrefs;
          }, function (err, data) {
            if (err) {
              res.end();
              ph.exit();
              return console.log(err);
            }

            res.json(data);
            console.log(data);
            ph.exit();
          });
        });
      });
    });
  });
});

app.listen(3000);
