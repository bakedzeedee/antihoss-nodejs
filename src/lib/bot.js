import writer from 'fs';

import client from './clientHelper.js';
import { processMessage } from './messageProcessor.js';
import { intervalMessages, stopIntervals } from './messageScheduler.js';
import { DateUtil } from './utility.js';
import banList from './banList.js';

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('disconnected', onDisconnectedHandler);
// client.on('join', onJoin);
client.on('reconnect', onReconnectHandler);
client.on('roomstate', onRoomstate);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(channel, userstate, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const command = msg.trim();
    processMessage(channel, userstate, command);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    const logMsg = `\n(* ${DateUtil.getDateString()}): Connected to ${addr}:${port}\n`;
    writer.appendFile('./log.txt', logMsg, (err) => {
        if(err) {
            console.error(err);
        }
    });
    console.log(logMsg);

    //schedule timer messages
    setTimeout(()=>{
        intervalMessages(client.lastJoined);
    }, 1000);
}

function onDisconnectedHandler(reason) {
    const logMsg = `\n(* ${DateUtil.getDateString()}): Disconnected: ${reason}\n\n`;
    writer.appendFile('./log.txt', logMsg, (err) => {
        if(err) {
            console.error(err);
        }
    });
    console.log(logMsg);

    stopIntervals();
}

function onReconnectHandler() {
    const logMsg = `\n(* ${DateUtil.getDateString()}): Reconnecting...\n`;
    writer.appendFile('./log.txt', logMsg, (err) => {
        if(err) {
            console.error(err);
        }
    });
    console.log(logMsg);
}

function onJoin(channel, username, self) {
    let rawUsername = username.replace(/#/, '');

    /* check username of newly joined user against list of name patterns to ban */
    banList.forEach((pattern) => {
        if (pattern.test(rawUsername)) actions.ban(channel, rawUsername, 'Malicious Bot Detected', 'join');
    })
}

// Called every time client joined a channel's chat
function onRoomstate(channel, state) {
    client.mods(channel)
    .then((mods) => {
        if(!mods.includes(client.username)) {
            client.say(channel, `@${channel.replace(/#/, '')} Please mod me to enable features. Just type into chat: /mod ${client.username}`).catch(()=>{});
        }
    }).catch((err) => {
        const logMsg = `\n(* ${DateUtil.getDateString()}): Couldn't retrieve roomstate upon entering room...\n`;
        writer.appendFile(`./channels/${channel}_log.txt`, logMsg, (err) => {
            if(err) {
                console.error(err);
            }
        });
        console.error(logMsg);
    });
}
