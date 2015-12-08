var fs = require("fs");
var Utils = require("./utils");

function getTime() {
    var time = '';
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    if(hours < 10) { hours = '0' + hours };
    if(minutes < 10) { minutes = '0' + minutes };
    if(seconds < 10) { seconds = '0' + seconds };

    time += hours + ':' + minutes + ':' + seconds;

    return time;
}

module.exports = {
    log: function(channel, type, user, message) {
        var file = "";

        var getFileLocation = function() {
            switch (type) {
                case "chat":
                    if (fs.existsSync("../logs/chat.log")) {
                        file = "../logs/chat.log";
                    } else {
                        file = "./logs/chat.log";
                    }
                    break;
                case "command":
                    if (fs.existsSync("../logs/commands.log")) {
                        file = "../logs/commands.log";
                    } else {
                        file = "./logs/commands.log";
                    }
                    break;
                default:
                    if (fs.existsSync("../logs/console.log")) {
                        file = "../logs/console.log";
                    } else {
                        file = "./logs/console.log";
                    }
                    break;
            }
        };

        getFileLocation();
        //
        //fs.appendFile(file, "[" + getTime() + "] " + "[" + channel + "] " + "[" + type.toUpperCase() + "] " + message + "\n", function(err) {
        //    if(err)
        //        console.log(err);
        //});

        fs.appendFile(file, Utils.format("[%s] [%s] [%s] <%s> %s", [getTime(), type.toUpperCase(), channel, user, message]) + "\n", function(err) {
            if(err)
                console.log(err);
        });

        console.log(Utils.format("[%s] [%s] [%s] <%s> %s", [getTime(), type.toUpperCase(), channel, user, message]));
    },

    chat: function(channel, user, message) {
        this.log(channel, "chat", user, message);
    },

    command: function(channel, user, message) {
        this.log(channel, "command", user, message);
    },

    console: function(channel, message) {
        console.log("[" + getTime() + "] " + "[CONSOLE] " + "[" + channel + "] " + message);
    }
};