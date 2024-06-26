var parseDate = d3.timeParse('%Y-%m-%d');

function accessor(d) {
    d.Date = parseDate(d.Date);
    d.Cases = +d['Daily new cases'];
    delete d['Daily new cases'];
    d.Deaths = +d['Deaths'];
    d.Hosps = +d['Total in hospital (both ICU and non-ICU)'];
    delete d['Total in hospital (both ICU and non-ICU)'];
    return d;
}

var dates = ['x'];
var cases = ['Cases'];
var hosps = ['Hospitalized with COVID symptoms'];
var all = ['Total in hospitals with COVID'];

d3.csv('./data/data.csv', accessor).then((data) => {
    data.map(d => {
        dates.push(d.Date);
        cases.push(d.Cases);
        hosps.push(d.Hosps);
        all.push(d.All);
    });

    var chart = c3.generate({
        bindto: '#container',
        data: {
            x: 'x',
            columns: [
                dates,
                cases,
                hosps,
                all
            ]
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    count: 8,
                    format: '%Y-%m-%d',
                }
            },
            y: {
                min: 100
            }
        },
        subchart: {
            show: true
        },
        tooltip: {
            show: true
        },
        padding: {
            right: 20
        }
    });

    var d = new Date();
    const today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() + 1);

    chart.zoom(['2021-11-30', '2022-03-04']);

}).catch(function (error) {
    console.log(error);
});



