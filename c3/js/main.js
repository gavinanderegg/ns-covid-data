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

d3.csv('../data/data.csv', accessor).then((data) => {
    csvData = data;
    console.log(data);
}).catch(function (error) {
    console.log(error);
});


var chart = c3.generate({
    bindto: '#mainData',
    data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
        ]
    }
});

