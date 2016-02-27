var request = require('request');

module.exports = {
    followerCount: function(callback) {
        var url = "https://savageboy74.tv/api/savagebot/followers";

        request(url, function (err, res, body) {
            // Right now we assume there are no errors so we can parse the json body.
            var parsedBody = JSON.parse(body);
            callback(err, res, parsedBody);
        });
    },

    follows: function(username, callback) {
        var url = "https://savageboy74.tv/api/savagebot/" + username + "/follows";

        request(url, function(err, res, body) {
            // Right now we assume there are no errors so we can parse the json body.
            var parsedBody = JSON.parse(body);

            callback(err, parsedBody);
        });
    },

    viewers: function(callback) {
        var url = "https://savageboy74.tv/api/savagebot/viewers";
        request(url, function(err, res, body) {
            // Right now we assume there are no errors so we can parse the json body.
            var parsedBody = JSON.parse(body);

            callback(err, parsedBody);
        });
    }
};
