var svg = d3.select('svg#mainData');

var parseDate = d3.timeParse('%Y-%m-%d');

var margin = { top: 0, right: 40, bottom: 50, left: 70 };
var width = svg.node().clientWidth - margin.left - margin.right;
var height = svg.node().clientHeight - margin.top - margin.bottom;
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var casesLine = d3.line()
    .x(function (d) { return x(d.Date); })
    .y(function (d) { return y(d.Cases); });

var hospsLine = d3.line()
    .x(function (d) { return x(d.Date); })
    .y(function (d) { return y(d.Hosps); });

var deathsLine = d3.line()
    .x(function (d) { return x(d.Date); })
    .y(function (d) { return y(d.Deaths); });

var chart = svg.append('g')
    .attr('class', 'lines');

var csvData;

d3.csv('../data/data.csv', accessor).then((data) => {
    csvData = data;
    draw();
}).catch(function (error) {
    console.log(error);
});

function draw() {
    width = svg.node().clientWidth - margin.left - margin.right;
    height = svg.node().clientHeight - margin.top - margin.bottom;
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(csvData, function (d) { return d.Date; }));
    y.domain([0, d3.max(csvData, function (d) { return d.Cases; })]);

    svg.selectAll('*').remove();

    var labels = [
        { 'name': 'Cases', 'color': '#888'},
        { 'name': 'Hospitalizations', 'color': '#AC0' },
        { 'name': 'Deaths', 'color': '#C40' }
    ];

    svg.selectAll('dots')
        .data(labels)
        .enter()
        .append('circle')
        .attr('cx', 100)
        .attr('cy', function (d, i) { return 25 + i * 25 })
        .style('fill', function (d) { return d.color })
        .attr('r', 7);

    svg.selectAll('labels')
        .data(labels)
        .enter()
        .append('text')
        .attr('x', 120)
        .attr('y', function (d, i) { return 25 + i * 25 })
        .style('fill', function (d) { return d.color })
        .text(function (d) { return d.name })
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');

    var chart = svg.append('g')
        .attr('class', 'lines')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + height + ')')
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',0)')
        .call(d3.axisLeft(y));

    chart.append('path')
        .datum(csvData)
        .attr('class', 'line casesLine')
        .attr('d', casesLine);

    chart.append('path')
        .datum(csvData)
        .attr('class', 'line hospsLine')
        .attr('d', hospsLine);

    chart.append('path')
        .datum(csvData)
        .attr('class', 'line deathsLine')
        .attr('d', deathsLine);
}

window.addEventListener('resize', draw);

function accessor(d) {
    d.Date = parseDate(d.Date);
    d.Cases = +d['Daily new cases'];
    delete d['Daily new cases'];
    d.Deaths = +d['Deaths'];
    d.Hosps = +d['Total in hospital (both ICU and non-ICU)'];
    delete d['Total in hospital (both ICU and non-ICU)'];
    return d;
}



