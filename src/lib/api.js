var request = require('request');
var u = require('./util.js');

module.exports = {
    stats: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/user/" + username + "/stats";

        request(url, function(err, res, body) {
            if(err) {
                callback(err, null);
            } else if(!u.isValidJson(body)) {
                callback(new Error("Invalid JSON response " + url), null);
            } else {
                callback(null, JSON.parse(body));
            }
        });
    },

    viewers: function(callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/internal/viewers";

        request(url, function(err, res, body) {
            if(err) {
                callback(err, null);
            } else if(!u.isValidJson(body)) {
                callback(new Error("Invalid JSON response " + url), null);
            } else {
                callback(null, JSON.parse(body));
            }
        });
    },

    points: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/user/" + username + "/points";

        request(url, function(err, res, body) {
            if(err) {
                callback(err, null);
            } else if(!u.isValidJson(body)) {
                callback(new Error("Invalid JSON response " + url), null);
            } else {
                callback(null, JSON.parse(body));
            }
        })
    },

    verified: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/verify/" + username;

        request(url, function(err, res, body) {
            if(err) {
                callback(err, null);
            } else if(!u.isValidJson(body)) {
                callback(new Error("Invalid JSON response " + url), null);
            } else {
                callback(null, JSON.parse(body));
            }
        })
    }
};
