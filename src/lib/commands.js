var S = require('string');
var db = require("./database.js");
var raffle = require("./raffle.js");
var u = require("./util.js");
var api = require('./api.js');
var numbro = require('numbro');

module.exports = {
    handleMessage: function(channel, user, message, callback) {
        var msg = message.split(" ");
        var option = null;
        var command = S(msg[0]).chompLeft("!").s.toLowerCase();
        var validOptions = ["add", "remove"];

        if(msg[1] != undefined)
            option = msg[1].toLowerCase();

        switch(command) {
            case "points":
                if(option != null && u.inArray(option, validOptions)) {
                    switch(option) {
                        case "add":
                            if(msg[2] != undefined && msg[3] != undefined) {
                                var points = msg[2];
                                var username = msg[3];
                                if(u.isMod(user)) {
                                    db.addPoints(username, points, function(err, results) {
                                        if(results != null) {
                                            db.getPoints(username, function(error, res) {
                                                if(res != null)
                                                    callback(u.format("%s now has %s points.", username, numbro(res).format('0,0')));
                                            });
                                        }
                                    });
                                }
                            } else {
                                callback("Incorrect syntax! Use: !points add <amount> <username>");
                            }
                            break;
                        case "remove":
                            // Remove points from user if the sender is a moderator
                            if(u.isMod(user)) {

                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    db.getPoints(user.username, function(err, res) {
                        if(res != null)
                            callback(u.format("%s, you have %s points.", user.username, numbro(res).format('0,0')));
                        else {
                            callback(u.format("%s, you don't have any points!", user.username));
                        }
                    });
                }
                break;
            case "raffle":
                if(u.isMod(user)) {
                    var time = msg[1] || 30000;
                    raffle.startRaffle(time, function(message) {
                        if(message != null) {
                            callback(message);
                            u.log(channel, "event", u.format("A raffle was started by %s", user.username), true);
                        }
                    });
                }
                break;
            case "join":
                raffle.addUserToRaffle(user.username, function(message) {
                    if(message != null)
                        callback(message);
                });
                break;
            case "followage":
            case "followsince":
                api.stats(user.username, function(err, res) {
                    if(err)
                        throw err;

                    if(res.status == 200 && res.data.follow_date != null) {
                        console.log(res.data.follow_date);
                        callback(u.format("%s", u.getFollowAge(user.username, res.data.follow_date)));
                    } else if(res.data.follow_date == null) {
                        callback(u.format("%s, you don't follow the channel! :(", user.username));
                    }
                });
                break;
            default:
                break;
        }
    },
};
