var request = require('request');
var u = require('./util.js');

module.exports = {
    stats: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/user/" + username + "/stats";

        request(url, function(err, res, body) {
			if(u.isValidJson(body)) {
				callback(null, JSON.parse(body));
            } else {
                callback(new Error("Assuming URL sent an invalid JSON response " + url), null);
            }
        });
    },

    viewers: function(callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/internal/viewers";

        request(url, function(err, res, body) {
			if(u.isValidJson(body)) {
				callback(null, JSON.parse(body));
            } else {
                callback(new Error("Assuming URL sent an invalid JSON response " + url), null);
            }
        });
    },

    points: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/user/" + username + "/points";

        request(url, function(err, res, body) {
			if(u.isValidJson(body)) {
				callback(null, JSON.parse(body));
            } else {
                callback(new Error("Assuming URL sent an invalid JSON response " + url), null);
            }
        });
    },

    verified: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/verify/" + username;

        request(url, function(err, res, body) {
			if(u.isValidJson(body)) {
				callback(null, JSON.parse(body));
            } else {
                callback(new Error("Assuming URL sent an invalid JSON response " + url), null);
            }
        });
    }
};
