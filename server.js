var express = require('express');
var phantom = require('node-phantom');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/url', function (req, res) {
  var url = req.query.q;
  
  phantom.create(function (err, ph) {
    if (err) return error(res, err, ph);

    return ph.createPage(function (err, page) {
      if (err) return error(res, err, ph);
      
      return page.open(url, function (err, status) {
        page.includeJs('http://localhost:3000/jquery-2.0.3.min.js', function (err) {
          if (err) return error(res, err, ph);
          
          return page.evaluate(function () {
            var hrefs = [];

            $('a').each(function (i, a) {
              var href = a.href;
              var hash = href.indexOf('#');
              if (hash !== -1) href = href.substring(0, hash);

              if (($.inArray(href, hrefs) === -1) && (href.substring(0, 4) == 'http')) {
                hrefs.push(href);
              }
            });

            return hrefs;
          }, function (err, data) {
            if (err) return error(res, err, ph);

            console.log(url + ' - ' + data.length);
            res.json(data);
            ph.exit();
          });
        });
      });
    });
  });
});

function error(res, err, ph) {
  res.end();
  ph.exit();
  return console.log(err);
}

app.listen(3000);
