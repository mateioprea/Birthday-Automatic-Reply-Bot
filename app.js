var login = require("facebook-chat-api");
var readline = require("readline");
var config = require("./helpers/config.js").config();
var NodeCache = require( "node-cache" );
var myCache = new NodeCache();
// Create simple echo bot

var parseMessage = function(message) {
    return message.replace(/[^\w\s]|(.)(?=\1)/gi, "");
};

login({email: config.facebook.email, password: config.facebook.password}, function callback (err, api) {
    if(err) return console.error(err);

    api.listen(function callback(err, message) {
        if(!message.isGroup) {
            if(message.body) {
                var replySent = 0;
                //check to match message
                myCache.get("user" + message.senderID, function(err, value) {
                    if(value == undefined) {
                        var messageToParse = parseMessage(message.body);
                        config.wishes.forEach(function(m) {
                            if(new RegExp("\\b" + m.toLowerCase() + "\\b").test(messageToParse.toLowerCase()) && !replySent) {
                                myCache.set("user" + message.senderID, true);
                                replySent = 1;
                                var sentMessage = "Multumesc frumos! :D";
                                console.log(new Date(), " Got message: " + messageToParse + "." + " Sent reply: " + sentMessage);
                                api.sendMessage(sentMessage, message.threadID);
                            }
                        });
                    }
                });
            }
        }
    });
});