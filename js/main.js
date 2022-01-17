// based on: https://bl.ocks.org/EfratVil/92f894ac0ba265192411e73f633a3e2f

var svg = d3.select('svg#mainData');

var parseDate = d3.timeParse('%Y-%m-%d');

d3.csv('./data/data.csv', accessor).then((data) => {
    console.log(data);
}).catch(function (error) {
    console.log(error);
});

function accessor(d) {
    d.Date = parseDate(d.Date);
    d.Cases = +d['Daily new cases'];
    d.Deaths = +d['Deaths'];
    d.Hosp = +d['Total in hospital (both ICU and non-ICU)'];
    return d;
}