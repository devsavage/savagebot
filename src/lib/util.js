var util = require("util");
var _ = require("underscore");
var fs = require('fs');
var env = require("../../config/environment.json");
var config = require("../../config/" + env.type + ".json");
var logFile = "./data/log.txt";

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
    var currentTime = new Date();

    var str         = '';

    var month       = currentTime.getUTCMonth() + 1;
    var day         = currentTime.getUTCDate();
    var year         = currentTime.getUTCFullYear();
    var hours       = currentTime.getHours();
    var minutes     = currentTime.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    str += month + "/" + day + "/" + year + " " + hours + ":" + minutes + ampm;

    return str;
}

var getFollowAge = function getFollowAge(username, followDate) {
    var toDate = new Date();
    var levels = 3;
    var prefix = null;
    followDate = new Date(followDate);
    var lang = {
            "date.past": "{0} ago",
            "date.future": "in {0}",
            "date.now": "now",
            "date.year": "{0} year",
            "date.years": "{0} years",
            "date.years.prefixed": "{0} years",
            "date.month": "{0} month",
            "date.months": "{0} months",
            "date.months.prefixed": "{0} months",
            "date.day": "{0} day",
            "date.days": "{0} days",
            "date.days.prefixed": "{0} days",
            "date.hour": "{0} hour",
            "date.hours": "{0} hours",
            "date.hours.prefixed": "{0} hours",
            "date.minute": "{0} minute",
            "date.minutes": "{0} minutes",
            "date.minutes.prefixed": "{0} minutes",
            "date.second": "{0} second",
            "date.seconds": "{0} seconds",
            "date.seconds.prefixed": "{0} seconds",
        },
        langFn = function(id,params){
            var returnValue = lang[id] || "";
            if(params){
                for(var i=0;i<params.length;i++){
                    returnValue = returnValue.replace("{"+i+"}",params[i]);
                }
            }
            return returnValue;
        },
        toDate = toDate ? toDate : new Date(),
        diff = followDate - toDate,
        past = diff < 0 ? true : false,
        diff = diff < 0 ? diff * -1 : diff,
        date = new Date(new Date(1970,0,1,0).getTime()+diff),
        returnString = '',
        count = 0,
        years = (date.getFullYear() - 1970);
    if(years > 0){
        var langSingle = "date.year" + (prefix ? "" : ""),
            langMultiple = "date.years" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (years > 1 ? langFn(langMultiple,[years]) : langFn(langSingle,[years]));
        count ++;
    }
    var months = date.getMonth();
    if(count < levels && months > 0){
        var langSingle = "date.month" + (prefix ? "" : ""),
            langMultiple = "date.months" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (months > 1 ? langFn(langMultiple,[months]) : langFn(langSingle,[months]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var days = date.getDate() - 1;
    if(count < levels && days > 0){
        var langSingle = "date.day" + (prefix ? "" : ""),
            langMultiple = "date.days" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (days > 1 ? langFn(langMultiple,[days]) : langFn(langSingle,[days]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var hours = date.getHours();
    if(count < levels && hours > 0){
        var langSingle = "date.hour" + (prefix ? "" : ""),
            langMultiple = "date.hours" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (hours > 1 ? langFn(langMultiple,[hours]) : langFn(langSingle,[hours]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var minutes = date.getMinutes();
    if(count < levels && minutes > 0){
        var langSingle = "date.minute" + (prefix ? "" : ""),
            langMultiple = "date.minutes" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (minutes > 1 ? langFn(langMultiple,[minutes]) : langFn(langSingle,[minutes]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    var seconds = date.getSeconds();
    if(count < levels && seconds > 0){
        var langSingle = "date.second" + (prefix ? "" : ""),
            langMultiple = "date.seconds" + (prefix ? ".prefixed" : "");
        returnString += (count > 0 ?  ', ' : '') + (seconds > 1 ? langFn(langMultiple,[seconds]) : langFn(langSingle,[seconds]));
        count ++;
    } else {
        if(count > 0)
            count = 99;
    }
    if(prefix){
        if(returnString == ""){
            returnString = langFn("date.now");
        } else if(past)
            returnString = langFn("date.past",[returnString]);
        else
            returnString = langFn("date.future",[returnString]);
    }
    return username + ", you have been following for " + returnString + "!";
}

var isValidJson = function isValidJson(string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }

    return true;
}

module.exports = {
    inArray: inArray,
    isBlacklisted: isBlacklisted,
    log: log,
    format: format,
    isMod: isMod,
    getFollowAge: getFollowAge,
    isValidJson: isValidJson
};
