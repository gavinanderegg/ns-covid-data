// based on: https://bl.ocks.org/EfratVil/92f894ac0ba265192411e73f633a3e2f

var svg = d3.select('svg#mainData');

var parseDate = d3.timeParse('%Y-%m-%d');

var x = d3.scaleTime().range([0, svg.node().clientWidth]);
var y = d3.scaleLinear().range([svg.node().clientHeight, 0]);

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

d3.csv('./data/data.csv', accessor).then((data) => {
    x.domain(d3.extent(data, function (d) { return d.Date; }));
    y.domain([0, d3.max(data, function (d) { return d.Cases; })]);

    chart.append('path')
        .datum(data)
        .attr('class', 'line casesLine')
        .attr('d', casesLine);

    chart.append('path')
        .datum(data)
        .attr('class', 'line hospsLine')
        .attr('d', hospsLine);

    chart.append('path')
        .datum(data)
        .attr('class', 'line deathsLine')
        .attr('d', deathsLine);
}).catch(function (error) {
    console.log(error);
});

function accessor(d) {
    d.Date = parseDate(d.Date);
    d.Cases = +d['Daily new cases'];
    delete d['Daily new cases'];
    d.Deaths = +d['Deaths'];
    d.Hosps = +d['Total in hospital (both ICU and non-ICU)'];
    delete d['Total in hospital (both ICU and non-ICU)'];
    return d;
}



