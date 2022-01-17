// based on: https://bl.ocks.org/EfratVil/92f894ac0ba265192411e73f633a3e2f

var svg = d3.select('svg#mainData'),
    margin = { top: 20, right: 20, bottom: 110, left: 40 },
    margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
    width = +document.querySelector('svg#mainData').clientWidth - margin.left - margin.right,
    height = +document.querySelector('svg#mainData').clientHeight - margin.top - margin.bottom,
    height2 = +document.querySelector('svg#mainData').clientHeight - margin2.top - margin2.bottom;

var parseDate = d3.timeParse('%Y-%m-%d');

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on('brush end', brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed);

var line = d3.line()
    .x(function (d) { return x(d.Date); })
    .y(function (d) { return y(d.Hosp); });

var line2 = d3.line()
    .x(function (d) { return x2(d.Date); })
    .y(function (d) { return y2(d.Hosp); });

var clip = svg.append('defs').append('svg:clipPath')
    .attr('id', 'clip')
    .append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0);

var Line_chart = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('clip-path', 'url(#clip)');

var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

d3.csv('./data/data.csv', type, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) { return d.Date; }));
    y.domain([0, d3.max(data, function (d) { return d.Hosp; })]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    focus.append('g')
        .attr('class', 'axis axis--y')
        .call(yAxis);

    Line_chart.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);

    context.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line2);

    context.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height2 + ')')
        .call(xAxis2);

    context.append('g')
        .attr('class', 'brush')
        .call(brush)
        .call(brush.move, x.range());

    svg.append('rect')
        .attr('class', 'zoom')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);

    console.log(data);
});

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    Line_chart.select('.line').attr('d', line);
    focus.select('.axis--x').call(xAxis);
    svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    Line_chart.select('.line').attr('d', line);
    focus.select('.axis--x').call(xAxis);
    context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
    d.Date = parseDate(d.Date);
    d.Hosp = +d['Total in hospital (both ICU and non-ICU)'];
    return d;
}