var s = require('./lib/series');


var series = [5, 13, 23];
var timeseries = [];
for(var sn in series) {
    timeseries.push(s(series[sn]));
}


var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./logs/bitstamp-trades.log')
});

lineReader.on('line', function (line) {
    var data = JSON.parse(line);

    for(var t in timeseries)
    {
        timeseries[t].add(data.timestamp, data.price, data.amount);
    }

    // timeseries.add(data.timestamp, data.price, data.amount);
});

lineReader.on('close', function() {
    for(var s in series)
    {
        console.log(series[s] + " :: " + timeseries[s].bars.length);
        console.log(timeseries[s].bars[timeseries[s].bars.length -1].getData());
    }
});


