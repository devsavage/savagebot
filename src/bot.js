var fs = require('fs');
var http = require('http');
var chokidar = require('chokidar');
var irc = require('tmi.js');
var api = require('./lib/api.js');
var c = require('./lib/commands.js');
var db = require('./lib/database.js');
var u = require('./lib/util.js');
var config = require("../config/development.json");

var followerList = __dirname + "../data/followers.json";

var options = {
    options: {
        debug: config.bot.settings.debug,
    },

    connection: {
        cluster: config.bot.settings.cluster
    },

    identity: {
        username: config.bot.username,
        password: config.bot.oauth
    },

    channels: [config.bot.defaults.channel]
};

var client = new irc.client(options);

client.connect();

client.on("connecting", function (address, port) {
    u.log(null, "console", "Connecting To: " + address + ":" + port, true);
});

client.on("connected", function(address, port) {
    u.log(null, "console", "Connected To: " + address + ":" + port, true);
});

client.on("join", function(channel, username) {
    if(config.bot.settings.allowJoinPoints && !u.isBlacklisted(username)) {
        api.follows(username, function(err, res) {
            if(res.status == 404) {
                db.addPoints(username, config.bot.settings.joinPoints, function(err, results) {
                    if(err)
                        u.log(channel, "error", err, true);
                    else
                        u.log(channel, "event", u.format("Gave %s points for joining the channel.", username), true);
                });
            } else {
                db.addPoints(username, config.bot.settings.joinPoints * config.bot.settings.followerJoinBonus, function(err, results) {
                    if(err)
                        u.log(channel, "error", err, true);
                    else
                        u.log(channel, "event", u.format("Gave %s points for joining the channel plus extra for being a follower.", username), true);
                });
            }
        });
    }

    u.log(channel, "join", username + " has joined " + channel, true);
});

client.on("chat", function (channel, user, message, self) {
    if(config.bot.settings.allowChatPoints && !u.isBlacklisted(user.username)) {
        api.follows(user.username, function(err, res) {
            if(res.status == 404) {
                db.addPoints(user.username, config.bot.settings.chatPoints, function(err, results) {
                    if(err)
                        u.log(channel, "error", err, true);
                    else
                        u.log(channel, "event", u.format("Gave %s points for chatting.", user.username), true);
                });
            } else {
                db.addPoints(user.username, config.bot.settings.chatPoints * config.bot.settings.followerChatBonus, function(err, results) {
                    if(err)
                        u.log(channel, "error", err, true);
                    else
                        u.log(channel, "event", u.format("Gave %s points for chatting plus extra for being a follower.", user.username), true);
                });
            }
        });
    }

    c.handleMessage(channel, user, message, function(response) {
        if(response != undefined)
            client.say(channel, response);
    });

    u.log(channel, "chat", "(" + user.username + "): " + message, true);
});

client.on("disconnected", function (reason) {
    u.log(channel, "console", "Disconnected: " + reason, true);
});
