var tickbar = require('./tickbar');

var series = function(rate) {
    var bars = [];
    var currentBar = undefined;

    var add = function(time, price, volume) {
        if(!currentBar || currentBar.isClosed()) {
            currentBar = tickbar(rate);
            bars.push(currentBar);
        }

        var overflow = {
            time: time,
            price: price,
            volume: volume
        };
        do {
            overflow = currentBar.add(overflow.time, overflow.price, overflow.volume);
            if(overflow) {
                currentBar = tickbar(rate);
                bars.push(currentBar);
            }
        } while(overflow);
    };

    return {
        add: add,
        bars: bars
    };
};

module.exports = series;

