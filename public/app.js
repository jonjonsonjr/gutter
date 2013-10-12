var graph = d3.select('#graph');
var svg = graph.append('svg').attr('width', '800').attr('height','600');
var width = 800;
var height = 600;
$.support.cors = true;

svg.append('svg:circle')
    .attr('class', 'node')
    .attr('r', '50')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .style('fill', function (d) {
        return 'rgb(100,20,200)';
    })
    .on('click', loadPage);


function loadPage() {
    $.get('/url?q=http://www.google.com', function (data) {
        console.log(data);
    })
    .fail(function (err) {
        console.log(err);
    });
}
