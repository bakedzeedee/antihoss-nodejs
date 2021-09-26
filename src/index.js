import writer from 'fs';

process.on('uncaughtException', err => {
    writer.appendFile('./log.txt', `>>There was an uncaught error: ${err.message}\n`, (err2) => {
        if(err) {
            console.error(err);
        }
    });
    console.error('There was an uncaught error', err);
    process.exit(-1);
})

const envConfig = (await import('dotenv')).config();
if(envConfig.error) {
    console.error("Could not load properties from .env file.");
    throw envConfig.error;
}

await import('./lib/bot.js');