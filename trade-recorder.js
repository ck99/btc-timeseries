var recorder = require('./lib/recorder');
var recordingStream = recorder('bitstamp-trades', 'logs/', '10M', '1h');
var moment = require('moment');
var formatCurrency = require('format-currency');

var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'my window title';

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
    top: 'center',
    left: 'center',
    width: '75%',
    height: '50%',
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'magenta',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});

// Append our box to the screen.
screen.append(box);


var log = blessed.log({
    parent: box,
    scrollback: 10,
    style: {
        fg: 'white',
        bg: 'magenta',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});


var currOpts = { format: '%s%v', code: 'USD', symbol: '$' };
recordingStream.on('trade', function(data){
    var dateStr = moment( data.timestamp+"000" , "x").format("HH:mm:ss");
    var TValue = formatCurrency(data.amount * data.price, currOpts);
    log.add(((data.type == 1) ? "SELL" : "BUY ") + " " + data.amount_str + " @ " + data.price_str + " USD ["+dateStr+"] "+TValue);
    screen.render();
});



// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    recordingStream.stop();
    return process.exit(0);
});

screen.render();