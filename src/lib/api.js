var request = require('request');

module.exports = {
    followerCount: function(callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/channel";

        request(url, function (err, res, body) {
            // Right now we assume there are no errors so we can parse the json body.
            var parsedBody = JSON.parse(body);
            callback(err, res, parsedBody);
        });
    },

    follows: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/user/" + username + "/stats";

        request(url, function(err, res, body) {
            // Right now we assume there are no errors so we can parse the json body.
            var parsedBody = JSON.parse(body);

            callback(err, parsedBody);
        });
    },

    //TODO: Fix endpoint
    viewers: function(callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/channel";

        request(url, function(err, res, body) {
            // Right now we assume there are no errors so we can parse the json body.
            var parsedBody = JSON.parse(body);

            callback(err, parsedBody);
        });
    },

    points: function(username, callback) {
        var url = "https://api.savageboy74.tv/v1/savagebot/user/" + username + "/points";

        request(url, function(err, res, body) {
            var parsedBody = JSON.parse(body);

            callback(err, parsedBody);
        })
    }
};
