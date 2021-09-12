const { commands, modCommands, hiddenCommands, regex } = require('./commands.js');
const Queue = require('./queue.js');
const { StringUtil } = require('./utility.js');

const queue = new Queue(1000);

const processMessage = (channel, userstate, command) => {
    const commandParts = StringUtil.splitFirst(command, ' '); // split up the command
    const commandName = commandParts[0]; // first word
    const commandQuery = commandParts.length > 1 ? commandParts[1] : ''; // string after first first word

    const instant = []; // commands to be run instantly
    const queued = []; // commands to be queued and executed one after another

    /* add all matching user commands or undefined if NA */
    instant.push(commands.user[commandName]);
    instant.push(hiddenCommands.user[commandName]);

    queued.push(sounds.user[commandName]);
    queued.push(hiddenSounds.user[commandName]);
    queued.push(media.user[commandName]);
    queued.push(hiddenMedia.user[commandName]);

    /* if user is mod or broadcaster, add all matching mod commands or undefined if NA */
    if(userstate && (userstate.mod || (userstate.badges && userstate.badges.broadcaster === '1'))) {
        instant.push(commands.mod[commandName]);
        instant.push(hiddenCommands.mod[commandName]);
        
        queued.push(sounds.mod[commandName]);
        queued.push(hiddenSounds.mod[commandName]);
        queued.push(media.mod[commandName]);
        queued.push(hiddenMedia.mod[commandName]);
    }

    /* execute all matched instant commands, if defined */
    instant.forEach((fn) => {
        if(fn) {
            try {
                fn(channel, userstate, commandQuery);
                console.log(`* Executed ${commandName} command`);
            } catch (e) {
                console.error(e);
            }
        }
    });

    /* queue all matched sound/media commands, if defined */
    queued.forEach((fn) => {
        if(fn) {
            try {
                queue.enqueue(fn, this, [channel, userstate, commandQuery]);
                console.log('* Queued ' + commandName + 'command');
            } catch (e) {
                console.error(e);
            }
        }
    });

    /* try to match entire string to known command regex and execute it */
    Object.keys(regex).forEach((value) => {
        if (command.match(new RegExp(value))) {
            try {
                regex[value](channel, userstate, command);
                console.log(`* Executed ${value} regex`);
                return;
            } catch (e) {
                console.error(e);
            }
        }
    });
}

exports.processMessage = processMessage;