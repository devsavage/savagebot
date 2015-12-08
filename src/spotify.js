var spotifyWebHelper 	= require('node-spotify-webhelper');
var tracks 				= require('./tracks');
var fs 					= require("fs");
var logger 				= require("./logger");

var spotify = new spotifyWebHelper.SpotifyWebHelper();
var getTracks = tracks.allTracks();

var currentSkipVoters   = [];
var currentKeepVoters   = [];

var skipCount 			= 0;
var localSkipCount 		= 3;
var nextTrackTimer 		= 0;

var currentSong        	= "";

function getSongFile() {
    if (fs.existsSync("../data/current_song.txt")) {
        return "../data/current_song.txt";
    } else {
        return "./data/current_song.txt";
    }
}



module.exports = {
    getCurrentSong: function (callback) {
        fs.readFile(getSongFile(), 'utf-8', function(err, data) {
            if(err){
                callback(err, null);
            } else {
                callback(null, data.toString());
            }
        });
    },

    getTrack: function() {
        var trackNumber = Math.floor(Math.random() * getTracks.length);
        return getTracks[trackNumber].uri;
    },

    play: function(channel, track) {
        //Reset these values everytime we play a new song
        currentSkipVoters 	= [];
        currentKeepVoters 	= [];
        skipCount 			= 0;

        spotify.play(track, function(err, response) {
            if(err) {
                return console.log(err);
            }

            if(response) {
                if(response.track && response.track.track_resource) {
                    var currentlyPlaying 	= "Currently Playing: " + response.track.track_resource.name + " by " + response.track.artist_resource.name + " " + response.track.track_resource.location.og;

                    currentSong = currentlyPlaying;

                    fs.writeFile(getSongFile(), currentlyPlaying, function(err) {
                        if(err) {
                            return logger.console(channel, err);
                        } else {
                            logger.console(channel, "Updated Current Song File");
                        }
                    });

                    clearTimeout(nextTrackTimer);

                    var timeBeforeNextTrack = response.track.length * 1000;

                    nextTrackTimer = setTimeout(function() {
                        var newTrack = module.exports.getTrack();
                        module.exports.play(channel, newTrack);
                        logger.console(channel, "Spotify: Playing a new track.");
                    }, timeBeforeNextTrack);
                } else {
                    var newTrack = module.exports.getTrack();
                    module.exports.play(channel, newTrack);
                    logger.console(channel, "Spotify Error: Cannot play track, is Spotify open? I'll still try another track.");
                }
            }

        });
    },

    skip: function(client, channel, user, message) {
        var voter = user.username;

        if(currentSkipVoters.indexOf(voter) !== -1) {
            var message = voter + " you can only vote to skip once per song!";
            setTimeout(function() {
                client.say(channel, message);
            }, 2000);
        } else {
            currentSkipVoters.push(voter);
            console.log(voter + " is voting to skip this track!");

            var index = currentKeepVoters.indexOf(voter);
            if(index > -1) {
                currentKeepVoters.splice(index, 1);
            }

            if(skipCount === (localSkipCount - 1)) {
                skipCount = skipCount + 1;

                var message = "Enough people voted to skip this track! Now playing a new track, type !song to get the info!";

                setTimeout(function() {
                    client.say(channel, message);
                }, 2000);

                var track = module.exports.getTrack();
                module.exports.play(channel, track);
            } else {
                skipCount = skipCount + 1;

                var message = voter + " is voting to skip this track! " + skipCount + " out of " + localSkipCount + " people are voting to skip this track! Type !keep to vote to keep this track!"

                setTimeout(function() {
                    client.say(channel, message);
                }, 2000);
            }
        }
    },

    keep: function (client, channel, user, message) {

        var voter = user.username;

        if (currentKeepVoters.indexOf(voter) !== -1) {

            var message = voter + " you can only vote to keep once per song!";

            setTimeout(function() {
                client.say(channel, message);
            }, 2000);

        } else {
            currentKeepVoters.push(voter);
            console.log(voter + " is voting to keep this track!");

            var index = currentSkipVoters.indexOf(voter);

            if (index > -1) {
                currentSkipVoters.splice(index, 1);
            }

            skipCount = skipCount - 1;

            if (skipCount === -1) {
                skipCount = 0;
            }

            var message = voter + " is voting to keep this track! Vote to skip count is now " + skipCount + " out of " + localSkipCount + ". Type !skip to vote to skip this track!";

            setTimeout(function() {
                client.say(channel, message);
            }, 2000);
        }
    }
};