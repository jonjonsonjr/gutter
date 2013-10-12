var graph = d3.select('#graph');
var display = document.getElementById('display');
var width = 800;
var height = 600;
var r = 250;
var displayURL = $('#url');
var visited = [];

function load(url) {
  visited.push(url);
  displayURL.val(url);
  $.get('/url?q=' + url, function (data) {
    draw(data);
  }).fail(function (err) {
    console.log(err);
  });
}

function draw(data) {
  console.log(visited);
  d3.select('svg').remove(); 
  var svg = graph.append('svg').attr('width', width).attr('height', height);
  var nodeRadius = 15 + 30 / data.length;
  
  var links = data.map(function (d, i) {
    return {
      source: 0,
      target: i + 1
    };
  });
  
  var nodes = data.map(function (d, i) {
    var theta = i / data.length * Math.PI * 2;
    var offset = (i % 2 == 1) ? 0 : nodeRadius * 2;
    return {
      x: width / 2 + (r + offset) * Math.cos(theta),
      y: height / 2 + (r + offset) * Math.sin(theta),
      href: d,
      fixed: true,
    };
  });

  nodes.unshift({
    x: width / 2,
    y: height / 2,
    href: displayURL.val(),
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
    .attr('r', nodeRadius)
    .attr('fill', function (d) {
      console.log(d.href);
      return ($.inArray(d.href, visited) !== -1) ? '#55b' : '#aaa';
    })
    .on('click', function (d) {
      console.log(d.href);
      if (d.index != 0) {
        if (d.prefetch) {
          draw(d.prefetch);
        } else {
          load(d.href);
        }
      }
    })
    .attr('transform', function (d) {
      return 'translate(' + d.x + ', ' + d.y + ')';
    })
    .on('mouseover', function (d) {
      if (!d.prefetch) {
        console.log(d.prefetch);
        prefetch(d);
      }

      display.innerHTML = '<a href="' + d.href + '">' + d.href + '</a>';
    });
}

function prefetch(node) {
  $.get('http://localhost:3000/url?q=' + node.href, function (data) {
    node.prefetch = data;
  });
}
