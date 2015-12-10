Savagebot
=========

Savagebot is a Twitch.tv chat moderation bot built in node.js  

### This branch is stable. See the dev branch for the most up to date changes and fixes.  

**Features:**

- Point system w/ add and remove commands
- Raffle system
- Spotify system
- Fun commands: !slap, !stab
- Command system w/ add, remove and edit commands
- Support for whispers

**Planned Features:**
- Better Structure
- Poll System
- Link and Emote Checks

This repository is only meant to used as a reference. You may use any or all of the code provided in your project.

You may see me call "config" for things like oauth token or database info. I have included that file below, update it to fit your needs.

---------------------------------------------------------------
**Basic Config File:**

~~~ javascript
module.exports = {
    oauth: function() {
        return "oauth:YOUROAUTHTOKENHERE123";
    },

    defaultChannel: function() {
        return "DEFAULT_BOT_CHANNEL";
    },

    defaultGroupChannel: function() {
        return "#DEFAULT_BOT_GROUP_CHANNEL";
    },

    host: function() {
        return "DATABASE_HOST";
    },

    username: function() {
        return "DATABASE_USERNAME";
    },

    password: function () {
        return "DATABASE_PASSWORD";
    },

    database: function () {
        return "DATABASE_TABLE";
    },

	//Set to true to enable the Spotify auto-play function
    useSpoitfyHelper: function () {
        return false;
    },

    joiningPoints: function() {
        return 5;
    },

    chattingPoints: function() {
        return 1;
    }
};
~~~

---------------------------------------------------------------


## Dependencies

- [tmi.js](https://www.npmjs.com/package/tmi.js)
- [string](https://www.npmjs.com/package/string)
- [mysql](https://www.npmjs.com/package/mysql)
- [numeral](https://www.npmjs.com/package/numeral)
- [sprintf-js](https://www.npmjs.com/package/sprintf-js)

---------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2015 savageboy74

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------

<p><img alt="MIT License" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png"></img></p>
