var S = require("string");
var sprintf = require("sprintf-js");

module.exports = {
    cleanChannel: function(channel) {
        return S(channel).chompLeft('#').s;
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },

    format: function(string, args) {
        return sprintf.vsprintf(string, args);
    }
};