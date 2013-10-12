var graph = d3.select('#graph');
var display = document.getElementById('display');
var width = 800;
var height = 600;

function load(url) {
  var r = 250;
  var nodeRadius = 5;

  $.get('/url?q=' + url, function (data) {
    var svg = graph.append('svg').attr('width', width).attr('height', height);
    nodeRadius = nodeRadius + 30 / data.length;
    console.log(nodeRadius);
    var links = data.map(function (d, i) {
      return { source: 0, target: i + 1 };
    });
    var nodes = data.map(function (d, i) {
      var theta = i / data.length * Math.PI * 2;
      var offset = (i % 2 == 0) ? 0 : nodeRadius;
      return {
        x: width / 2 + (r + offset) * Math.cos(theta),
        y: height / 2 + (r + offset) * Math.sin(theta),
        href: d,
        fixed: true
      };
    });
    
    nodes.unshift({
      x: width / 2,
      y: height / 2,
      href: url,
      fixed: true
    });

    var force = d3.layout.force()
      .size([width, height])
      .nodes(nodes)
      .links(links)
      .start();

    var link = svg.selectAll('.link');
    link = link.data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    var node = svg.selectAll('.node');
    node = node.data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 30)
      .on('click', function (d) {
        d3.select('svg').remove();
        console.log(d.href);
        load(d.href);
      })
      .attr('transform', function (d) {
        return 'translate(' + d.x + ', ' + d.y + ')';
      })
      .on('mouseover', function (d) {
        display.innerHTML = '<a href="' + d.href + '">' + d.href + '</a>';
      });

  }).fail(function (err) {
      console.log(err);
  });
}

function prefetch(url, cb) {
  $.get('http://localhost:3000/url?q=' + url, function (data) {
    cb(data);
  });
}
