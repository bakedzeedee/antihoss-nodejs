import { commands, hiddenCommands } from './commands.js';
import { StringUtil } from './utility.js';

const processMessage = (channel, userstate, command) => {
    const commandParts = StringUtil.splitFirst(command, ' '); // split up the command
    const commandName = commandParts[0]; // first word
    const commandQuery = commandParts.length > 1 ? commandParts[1] : ''; // string after first first word

    //TO-DO have 'instant' be a single command
    //   use nullish coalesce operator to simplify 'instant' assignment
    const instant = []; // commands to be run instantly

    /* add all matching user commands */
    let userCommand = commands.user[commandName];
    let userHiddenCommand = hiddenCommands.user[commandName];
    if (userCommand) instant.push(userCommand);
    if (userHiddenCommand) instant.push(userHiddenCommand);

    /* if user is mod or broadcaster, add all matching mod commands, */
    if (userstate?.mod || userstate?.badges?.broadcaster) {
        let modCommand = commands.mod[commandName];
        let modHiddenCommand = hiddenCommands.mod[commandName];
        if (modCommand) instant.push(modCommand);
        if (modHiddenCommand) instant.push(modHiddenCommand);
    }

    /* if user is broadcaster, add all matching broadcaster commands */
    if (userstate?.badges?.broadcaster) {
        let broadcasterCommand = commands.broadcaster[commandName];
        let broadcasterHiddenCommand = hiddenCommands.broadcaster[commandName];
        if (broadcasterCommand) instant.push(broadcasterCommand);
        if (broadcasterHiddenCommand) instant.push(broadcasterHiddenCommand);
    }

    /* execute all matched instant commands */
    instant.forEach((command) => {
        try {
            command(channel, userstate, commandQuery);
            console.log(`* Executed ${commandName} command`);
        } catch (e) {
            console.error(e);
        }
    });
};

export { processMessage };