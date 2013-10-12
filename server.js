var express = require('express');
var requests = require('request');
var phantom = require('node-phantom');
var fs = require('fs');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/url', function (req, res) {
  var url = req.query.q;
  console.log(url);

  phantom.create(function (err, ph) {
    ph.createPage(function (err, page) {
      page.open(url, function (err, status) {
        console.log('status:' + status);
        page.evaluate(function (err, s) {
          console.log('evaluate:');
          console.log(s);
        });
      });
    });
  });
 
 /* 
  requests.get(url, function (err, response, body) {
    if (err) console.log(err);

    fs.writeFileSync('out.log', body);
    var text = body;
    var cursor = 0;
    var count = 0;

    while (true) {
      var index = text.indexOf('a href=', cursor);

      if (index === -1) {
        break;
      }

      cursor = index;
  
      cursor = text.indexOf('"', cursor) + 1;
      var end = text.indexOf('"', cursor);

      var link = text.substring(cursor, end);

      console.log('(' + cursor + ', ' + end + '): ' + link);

      cursor = end + 1;
    }

    res.end('done');
  });
*/
 res.end('done');
});

app.listen(3000);
