var mysql = require('mysql');
var config = require("../../config/development.json");

var database = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database
});

module.exports = {
    quit: function() {
        database.end();
    },

    getPoints: function(username, callback) {
        var query = "SELECT * FROM points WHERE username = ?";
        database.getConnection(function(err, db) {
            db.query(query, [username], function(err, results) {
                if(err)
                    callback(err, null);
                else
                    if(results[0] != null)
                        callback(null, results[0].points);
                else
                    callback(null, null);

                db.release();
            });
        });
    },

    addPoints: function(username, points, callback) {
        var query = "INSERT INTO points (username, points, created_at, updated_at) VALUES(?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE points = points + " + points + ", updated_at = NOW()";
        database.getConnection(function(err, db) {
            db.query(query, [username, points], function(err, results) {
                if(err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        })
    },

    removePoints: function(username, points, callback) {
        var query = "UPDATE points SET points = points - ?, updated_at = NOW() WHERE username = ?";
        database.getConnection(function(err, db) {
            db.query(query, [username, points], function(err, results) {
                if(err)
                    callback(err, null);
                else
                    callback(null, results);

                db.release();
            });
        })
    }
};
