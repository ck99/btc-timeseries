var formatCurrency = require('format-currency');
var currOpts = { format: '%v', code: 'BTC', maxFraction: 8  };

require('./decimal-polyfill');

var tickbar = function(rate) {
    var bar = {
        start_time: null,
        end_time: null,
        open: null,
        high: null,
        low: null,
        close: null,
        volume: 0,
        bar_is_open: true,
        trades: 0
    };

    var addPrice = function(price) {
        bar.close = price;

        if(!bar.open) {
            bar.open = price;
        }

        if(!bar.high || price > bar.high) {
            bar.high = price;
        }

        if(!bar.low || price < bar.low) {
            bar.low = price;
        }
    };

    var addVolume = function(volume) {
        var diff = 0;
        if( (bar.volume + volume) >= rate) {
            diff = rate - bar.volume;
            bar.volume = rate;
            diff = volume - diff;
        } else {
            bar.volume = bar.volume + volume;
        }
        bar.volume = bar.volume.toFixedDown(8);
        return diff.toFixedDown(8);
    };

    var add = function(time, price, volume) {
        if(!bar.bar_is_open) {
            return {
                time: time,
                price: price,
                volume: volume
            }
        }

        bar.end_time = time;
        if(!bar.start_time) {
            bar.start_time = time;
        }
        addPrice(price);
        var remainder = addVolume(volume);
        bar.trades = bar.trades+1;

        if(remainder > 0) {
            bar.bar_is_open = false;
            return {
                time: time,
                price: price,
                volume: remainder
            }
        }

    };

    var getData = function() {
        return {
            start_time:  bar.start_time,
            end_time:    bar.end_time,
            open:        bar.open,
            high:        bar.high,
            low:         bar.low,
            close:       bar.close,
            volume:      bar.volume, //formatCurrency(bar.volume, currOpts),
            trades:      bar.trades,
            bar_is_open: bar.bar_is_open
        };
    };

    return {
        add: add,
        getData: getData,
        isClosed: function() {
            return !bar.bar_is_open;
        }
    }
};

module.exports = tickbar;