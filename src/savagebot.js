var irc         = require("tmi.js");
var fs          = require("fs");
var numeral     = require("numeral");
var S           = require("string");

var db          = require("./database");
var config      = require("./config");
var Logger      = require("./logger");
var Utils       = require("./utils");

var botName = config.name();
var oauth = config.oauth();
var useSpotify = config.useSpoitfyHelper();
var defaultChannel = config.defaultChannel();
var defaultIrcChannel = "#" + defaultChannel;

var options = {
    options: {
        debug: true
    },

    connection: {
        random: "chat",
        reconnect: true
    },

    identity: {
        username: botName,
        password: oauth
    },

    channels: [defaultIrcChannel]
};

var client = new irc.client(options);

client.connect();

client.on("chat", function (channel, user, message, self) {
    var isMod = user["user-type"] === "mod" || user.username === channel.replace("#", "");

    if(message.startsWith("!")) {
        handleCommands(channel, user, message, self, isMod);
    } else {
        handleMessage(channel, user, message, self, isMod);
    }
});

function handleCommands(channel, user, message, self, isMod) {
    var rawCommand = message.split(" ");
    var command = S(rawCommand[0]).chompLeft("!").s;

    switch (command) {
        case "points":
            var queryUser = rawCommand[1];

            if(queryUser != null && isMod) {
                db.getPoints(queryUser, function(err, results) {
                    if(results[0] != undefined) {
                        if(!self)
                            broadcast(channel, Utils.format("%s currently has %s points.", [queryUser, numeral(results[0].points).format('0,0')]), 3000);
                    } else if(err) {
                        Logger.console(channel, err);
                    }
                });
            } else {
                db.getPoints(user.username, function(err, results) {
                    if(results[0] != undefined) {
                        if(!self)
                            broadcast(channel, Utils.format("%s, you currently have %s points.", [user.username, numeral(results[0].points).format('0,0')]), 3000);
                    } else if(err) {
                        Logger.console(channel, err);
                    }
                });
            }
            break;
        case "hi":
            if(!self)
                broadcast(channel, Utils.format("Hi, %s!", [user.username]), 1000);
            break;
        case "slap":
            var slapTarget = rawCommand[1];

            if (slapTarget != null) {
                if(!self)
                    broadcast(channel, Utils.format("%s slapped %s! BibleThump", [user.username, slapTarget.toString()]), 2000);
            } else {
                if (!self)
                    broadcast(channel, Utils.format("%s slapped themselves! D:", [user.username]), 2000);
            }
            break;
        case "stab":
            var stabTarget = rawCommand[1];

            if (stabTarget != null) {
                if(!self)
                    broadcast(channel, Utils.format("%s just stabbed %s! D:", [user.username, stabTarget.toString()]), 2000);
            } else {
                if (!self)
                    broadcast(channel, Utils.format("%s stabbed themselves! BibleThump", [user.username]), 2000);
            }
            break;
        default:
            break;
    }

    Logger.command(channel, user.username, message);
}

function handleMessage(channel, user, message, self, isMod) {
    var msg = message.split(" ");

    switch (msg[0])
    {
        case "FeelsBadMan":
            if(!self)
                broadcast(channel, "FeelsBadMan", 1000);
            break;
        case "FeelsGoodMan":
            if(!self)
                broadcast(channel, "FeelsGoodMan", 1000);
            break;
        case "BibleThump":
            if(!self)
                broadcast(channel, "BibleThump", 1000);
            break;
        case "Kappa":
            if(!self)
                broadcast(channel, "Kappa", 1000);
            break;
        case "PogChamp":
            if(!self)
                broadcast(channel, "PogChamp", 1000);
            break;
        case "FailFish":
            if(!self)
                broadcast(channel, "FailFish", 1000);
            break;
        case "CoolCat":
            if(!self)
                broadcast(channel, "CoolCat", 1000);
            break;
        case "4Head":
            if(!self)
                broadcast(channel, "4Head", 1000);
            break;
        default:
            break;
    }

    Logger.chat(channel, user.username, message);
}

function broadcast(channel, message, delay) {
    setTimeout(function() {
        client.say(channel, message);
    }, delay);
}

