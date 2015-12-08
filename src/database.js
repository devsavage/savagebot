var mysql = require("mysql");
var config = require("./config");

var host = config.host();
var username = config.username();
var password = config.password();
var getDB = config.database();

var database = mysql.createPool({
    host: host,
    user: username,
    password: password,
    database: getDB
});

module.exports = {

    disconnect: function() {
        database.end();
    },

    getPoints: function(username, callback) {
        var sql = "SELECT username, points FROM viewers WHERE username = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [username], function(err, results) {
                if (err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        });
    },

    getPointsById: function(id, callback) {
        var sql = "SELECT username, points FROM viewers WHERE id = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [id], function(err, results) {
                if (err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        });
    },

    addPoints: function(username, points, callback) {
        var sql = "UPDATE viewers SET points = points + ? WHERE username = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [points, username], function (err, results) {
                if (err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        });
    },

    removePoints: function(username, points, callback) {
        var sql = "UPDATE viewers SET points = points - ? WHERE username = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [points, username], function (err, results) {
                if (err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        });
    },

    checkIfUserExists: function(username, callback) {
        var sql = "SELECT username FROM viewers WHERE username = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [username], function (err, results) {
                if (err)
                    callback(err, null);
                else
                    callback(null, results[0]);

                db.release();
            });
        });
    },

    searchForCommand: function(command, callback) {
        var sql = "SELECT * FROM commands WHERE command = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [command], function (err, results) {
                if (err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        });
    },

    addCommand: function (command, response, username, channel, callback) {
        var sql = "INSERT INTO commands SET command = ?, response = ?, user = ?, channel = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [command, response, username, channel], function (err, results) {
                if (err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        });
    },

    editCommand: function (command, response, username, callback) {
        var sql = "UPDATE commands SET command = ?, response = ?, user = ? WHERE command = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [command, response, username, command], function (err, result) {
                if (err)
                    callback(err, null);
                else
                    callback(null, result);

                db.release();
            });
        });
    },

    removeCommand: function(command, callback) {
        var sql = "DELETE FROM commands WHERE command = ?";

        database.getConnection(function(err, db) {
            db.query(sql, [command], function(err, result) {
                if (err)
                    callback(err, null);
                else
                    callback(null, result);

                db.release();
            });
        });
    }
};