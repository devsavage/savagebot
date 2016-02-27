var util = require("util");
var _ = require("underscore");
var fs = require('fs');
var config = require("../../config/development.json");
var logFile = "../data/log.txt";

var isMod = function(user) {
    if(user["user-type"] != undefined && user["user-type"] === "mod")
        return true;
    else
        return false;
}

var format = function(f) {
    var formatRegExp = /%[sdj%]/g;
    if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
            case '%s': return String(args[i++]);
            case '%d': return Number(args[i++]);
            case '%j':
            try {
                return JSON.stringify(args[i++]);
            } catch (_) {
                return '[Circular]';
            }
            default:
            return x;
        }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
            str += ' ' + x;
        } else {
            str += ' ' + inspect(x);
        }
    }
    return str;
}

var isString = function isString(arg) {
    return typeof arg === 'string';
}

var inArray = function(value, array) {
    return _.contains(array, value);
}

var isBlacklisted = function(username) {
    return inArray(username, config.bot.settings.blacklist);
}

var log = function(channel, type, message, outputToConsole = false) {
    if(channel !== null) {
        fs.appendFile(logFile, "[" + getTime() + "] " + "[" + channel.toString() + "]" + " [" + type.toString().toUpperCase() +"] " + message.toString() + "\n", function(err) {
            if (err) throw err;
        });
    } else {
        fs.appendFile(logFile, "[" + getTime() + "] " + " [" + type.toString().toUpperCase() +"] " + message.toString() + "\n", function(err) {
            if (err) throw err;
        });
    }

    if(outputToConsole) {
        if(channel)
            console.log("[%s] [%s] [%s] %s", getTime(), channel, type.toUpperCase(), message);
        else
            console.log("[%s] [%s] %s", getTime(), type.toUpperCase(), message);
    }
}

var getTime = function getTime() {
    var str         = '';

    var currentTime = new Date();

    var hours       = currentTime.getHours();
    var minutes     = currentTime.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    str += hours + ":" + minutes + ampm;

    return str;
}

module.exports = {
    inArray: inArray,
    isBlacklisted: isBlacklisted,
    log: log,
    format: format,
    isMod: isMod
};
