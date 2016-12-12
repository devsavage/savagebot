var fs = require('fs');
var http = require('http');
var chokidar = require('chokidar');
var irc = require('tmi.js');
var api = require('./lib/api.js');
var c = require('./lib/commands.js');
var db = require('./lib/database.js');
var u = require('./lib/util.js');
var env = require("../config/environment.json");
var config = require("../config/" + env.type + ".json");
var internal = require('./lib/internal.js');

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

client.on("join", function(channel, username) {
    if(config.bot.settings.allowJoinPoints && !u.isBlacklisted(username)) {
        api.stats(username, function(err, res) {
            if(err) {
                u.log(null, "error", err, true);
                internal.offline(function(err, res) {
                    if(res != null) {
                        u.log(null, "console", "Updated API Status To Offline", true);
                    } else {
                        u.log(null, "console", "Error Updating API Status To Offline", true);
                    }
                });
                throw err;
            }

            if(res.data.follow_date == null) {
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

        api.verified(username, function(err, res) {
            if(err) {
                u.log(null, "error", err, true);
                internal.offline(function(err, res) {
                    if(res != null) {
                        u.log(null, "console", "Updated API Status To Offline", true);
                    } else {
                        u.log(null, "console", "Error Updating API Status To Offline", true);
                    }
                });
                throw err;
            }

            if(res.verified) {
                db.addPoints(username, config.bot.settings.verifiedJoinBonus, function(err, results) {
                    if(err)
                        u.log(channel, "error", err, true);
                    else
                        u.log(channel, "event", u.format("Gave %s points for connecting with savageboy74.tv.", username), true);
                });
            }
        });
    }

    u.log(channel, "join", username + " has joined " + channel, true);
});

client.on("chat", function (channel, user, message, self) {
    if(self) {
        return false;
    }

    c.handleMessage(client, channel, user, message, function(response, shouldWait = true, allowPoints = true) {
        if(response != undefined || response != null) {
          if(shouldWait) {
            setTimeout(function() {
                client.say(channel, response);
            }, config.bot.settings.commands.responseTime);
          } else {
            client.say(channel, response);
          }
        }

        if(allowPoints) {
            api.verified(user.username, function(err, res) {
                if(err) {
                    u.log(null, "error", err, true);
                    internal.offline(function(err, res) {
                        if(res != null) {
                            u.log(null, "console", "Updated API Status To Offline", true);
                        } else {
                            u.log(null, "console", "Error Updating API Status To Offline", true);
                        }
                    });
                    throw err;
                }

                if(res.verified && !u.isBlacklisted(user.username)) {
                    db.addPoints(user.username, config.bot.settings.verifiedChatBonus, function(err, results) {
                        if(err)
                            u.log(channel, "error", err, true);
                        else
                            u.log(channel, "event", u.format("Gave %s points for connecting with savageboy74.tv.", user.username), true);
                    });
                }
            });

            if(config.bot.settings.allowChatPoints && !u.isBlacklisted(user.username)) {
                api.stats(user.username, function(err, res) {
                    if(err) {
                        u.log(null, "error", err, true);
                        internal.offline(function(err, res) {
                            if(res != null) {
                                u.log(null, "console", "Updated API Status To Offline", true);
                            } else {
                                u.log(null, "console", "Error Updating API Status To Offline", true);
                            }
                        });
                        throw err;
                    }

                    if(res.data.follow_date == null) {
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
        }
    });

    u.log(channel, "chat", "<" + user.username + ">: " + message, true);
});

client.on("disconnected", function (reason) {
    internal.offline(function(err, res) {
        if(res != null) {
            u.log(null, "console", "Updated API Status To Offline", true);
        } else {
            u.log(null, "console", "Error Updating API Status To Offline", true);
        }
    });

    u.log(null, "console", "Disconnected: " + reason, true);
});

client.on("join", function (channel, username, self) {
    if(self) {
        u.log(null, "console", "Joined Channel: " + channel, true);
        internal.online(function(err, res) {
            if(res != null) {
                u.log(null, "console", "Updated API Status To Online", true);
            } else {
                u.log(null, "console", "Error Updating API Status To Online", true);
            }
        });
    }
});

client.on("part", function(channel, username, self) {
    if(self) {
        u.log(null, "console", "Parted Channel: " + channel, true);
        internal.offline(function(err, res) {
            if(res != null) {
                u.log(null, "console", "Updated API Status To Offline", true);
            } else {
                u.log(null, "console", "Error Updating API Status To Offline", true);
            }
        });
    }
});
