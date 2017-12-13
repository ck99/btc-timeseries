var EventEmitter2 = require('eventemitter2').EventEmitter2;

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}

function generator(baseName, directory) {
    return function(time, index) {
        if(! time) {
            return directory + baseName+".log";
        }

        var month   = time.getFullYear() + "" + pad(time.getMonth() + 1);
        var day     = pad(time.getDate());
        var hour    = pad(time.getHours());
        var minute  = pad(time.getMinutes());
        var seconds = pad(time.getSeconds());

        return directory + month + day + "-" + hour + minute + seconds + "-" + index + "-"+baseName+".log";
    };
}

var rfs    = require('rotating-file-stream');

var record = function(fileName, directory, splitSize, splitInterval) {
    var server = new EventEmitter2();

    var stream = rfs(generator(fileName, directory), {
        size:     splitSize,
        interval: splitInterval
    });

    stream.on('rotated', function(filename) {
        // rotation job completed with success producing given filename
        server.emit('logrotated', filename);
    });


    var key = 'de504dc5763aeef9ff52';
    var Pusher = require('pusher-js');
    var opts = {cluster: 'eu'};
    opts = {cluster: 'mt1'};
    var pusher = new Pusher(key, opts);
    var tradesChannel = pusher.subscribe('live_trades');

    tradesChannel.bind('trade', function(data){
        stream.write(JSON.stringify(data)+"\n");
        server.emit('trade', data);
    });

    return {
        on: function(event, cb) {
            server.on(event, cb);
        },
        stop: function() {
            pusher.disconnect();
        }
    };
};


module.exports = record;

