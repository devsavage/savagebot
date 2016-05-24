Savagebot
=========

Wow another rewrite? Yeah, lol. This time I won't be trying to make another "moderation" bot but just build on them with some more features aside from moderation.  
This project requires node >= 6.0  

**Features:**

- Point system w/ add and remove commands
- Raffle system
- Another cool thing... coming soon.........  

---------------------------------------------------------------
The config file you see me reference in some files...  

~~~ json
{
    "bot": {
        "version": "5.1.0",
        "username": "savagebot",
        "oauth": "oauth:******************************",
        "defaults": {
            "channel": "default_channel",
            "group": "default_group_channel"
        },

        "settings": {
            "debug": false,
            "cluster": "aws",
            "blacklist": ["savagebot", "nightbot", "moobot", "xanbot"],
            "allowJoinPoints": true,
            "joinPoints": 2,
            "followerJoinBonus": 2,
            "verifiedChatBonus": 2,
            "verifiedJoinBonus": 2,
            "allowChatPoints": true,
            "chatPoints": 1,
            "followerChatBonus": 2,
            "commands": {
                "validPointCommands": ["add", "remove"],
                "responseTime": 2000
            }
        }
    },

    "mysql": {
        "host": "127.0.0.1",
        "username": "root",
        "password": "",
        "database": "savagebot"
    }
}
~~~
---------------------------------------------------------------
The MIT License (MIT)

Copyright (c) 2016 savageboy74

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
