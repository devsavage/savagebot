var u = require("./util.js");
var api = require("./api.js");

var raffle = {
    active: false,
    time: 30000,
    users: []
};

var startRaffle = function (time = null, callback) {
    if(!raffle.active) {
        if(time != null) {
            if(time.toString().length == 2) {
                time = time * 1000;
            }

      		if(time > 300000) {
      			callback("Raffle duration must be 5 minutes or less!");
      		} else {
      			raffle.time = time;
      		}
        }

        raffle.active = true;

        var raffleTime = convertTime(raffle.time);

        callback(u.format("A raffle has begun! Type \"!join\" to enter! The raffile will end in %s!", raffleTime));

        setTimeout(function() {
            endRaffle(function(winningMessage) {
                callback(winningMessage);
            });
        }, raffle.time);
    } else {
        //We don't need to add time remaining since it's not really the "time remaining".
        callback("A raffle has already been started! Type \"!join\" to enter!");
    }
};

var addUserToRaffle = function(username, callback) {
    getIsRaffleActive(function(active) {
        if(active) {
            if(raffle.users.indexOf(username) == -1) {
                raffle.users.push(username);

                api.viewers(function(err, res) {
                    if(!err) {
                      // We limit telling users they joined the raffle if there are more than 20 viewers at a time.
                        if(res.viewers <= 20) {
                            setTimeout(function() {
                                callback(u.format("%s, you have entered the raffle!", username));
                            }, 1000);
                        }
                    }
                });
            }
        } else {
            setTimeout(function() {
                callback(u.format("%s, there is no active raffle to join!", username));
            }, 2000);
        }
    });
};

var endRaffle = function(callback) {
    getIsRaffleActive(function(active) {
        if(active) {
            if(raffle.users.length > 0) {
                callback(u.format("The raffle has ended! And the winner is.... !!! %s !!! Congratulations! FeelsGoodMan", raffle.users[Math.floor(Math.random() * raffle.users.length)]));
            } else {
                callback("Nobody won the raffle because nobody entered! FeelsBadMan");
            }

            raffle.active = false;
            raffle.time = 30000;
            raffle.users = [];
        }
    });
};

var getIsRaffleActive = function(callback) {
    callback(raffle.active);
};


var convertTime = function (num) {
    var seconds = Math.floor(num / 1000);

    if(num >= 60000) {
        var minutes = Math.floor(seconds / 60);
        var minFormat = (minutes == 1) ? " minute" : " minutes";

        return minutes + minFormat;
    }

    return seconds + " seconds";
}

module.exports = {
    startRaffle: startRaffle,
    addUserToRaffle: addUserToRaffle
};
