import writer from 'fs';

import client from './clientHelper.js';
import { DateUtil } from './utility.js';

const ban = (channel, username, reason, event = '') => {
    client.ban(channel, username, reason)
    .then(() => {
        writer.appendFile(`./banned/${event}_${channel}.txt`, `${username}\n`, (err) => {
            if(err) {
                console.error(err);
            }
        });

        const logMsg = `\n(* ${DateUtil.getDateString()}): Banned '${username}': ${reason}\n`;
        writer.appendFile(`./channels/${channel}_log.txt`, logMsg, (err) => {
            if(err) {
                console.error(err);
            }
        });
        
        console.log(`[${channel}] Banned: ${username}`);
    })
    .catch((err) => {
        const logMsg = `\n(* ${DateUtil.getDateString()}): Failed to ban '${username}': ${err}\n`;
        writer.appendFile(`./channels/${channel}_log.txt`, logMsg, (err) => {
            if(err) {
                console.error(err);
            }
        });
        
        console.error(logMsg);
    });
};

const unban = (channel, username) => {
    client.unban(channel, username)
    .then(() => {
        const logMsg = `\n(* ${DateUtil.getDateString()}): Unbanned '${username}'\n`;
        writer.appendFile(`./channels/${channel}_log.txt`, logMsg, (err) => {
            if(err) {
                console.error(err);
            }
        });
        
        console.log(`[${channel}] Banned: ${username}`);
    })
    .catch((err) => {
        const logMsg = `\n(* ${DateUtil.getDateString()}): Failed to unban '${username}': ${err}\n`;
        writer.appendFile(`./channels/${channel}_log.txt`, logMsg, (err) => {
            if(err) {
                console.error(err);
            }
        });
        
        console.error(logMsg);
    });
};

export { ban };