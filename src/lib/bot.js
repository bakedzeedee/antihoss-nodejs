const writer = require('fs');

const client = require('./clientHelper.js');
const commands = require('./messageProcessor.js');
const { intervalMessages, stopIntervals } = require('./messageScheduler.js');
const { DateUtil } = require('./utility.js');

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('reconnect', onReconnectHandler);
client.on('disconnected', onDisconnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(channel, userstate, msg, self) {
    const message = `(${DateUtil.getDateString()}) ${userstate.username}: ${msg}\n`;
    writer.appendFile('./log.txt', message, (err) => {
        if(err) {
            console.log(err);
        }
    });

    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    console.log(`> ${channel}: ${msg}`);
    
    const command = msg.trim();
    commands.processMessage(channel, userstate, command);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    const message = `\n(* ${DateUtil.getDateString()}): Connected to ${addr}:${port}\n`;
    writer.appendFile('./log.txt', message, (err) => {
        if(err) {
            console.log(err);
        }
    });

    //schedule timer messages
    setTimeout(()=>{
        intervalMessages(client.lastJoined);
    }, 1000);
}

function onDisconnectedHandler(reason) {
    const message = `\n(* ${DateUtil.getDateString()}): Disconnected: ${reason}\n\n`;
    writer.appendFile('./log.txt', message, (err) => {
        if(err) {
            console.log(err);
        }
    });

    stopIntervals();
}

function onReconnectHandler() {
    const message = `\n(* ${DateUtil.getDateString()}): Reconnecting...\n`;
    writer.appendFile('./log.txt', message, (err) => {
        if(err) {
            console.log(err);
        }
    });
}