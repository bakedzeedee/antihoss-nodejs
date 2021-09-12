const tmi = require('tmi.js');

const channels = process.env.T_CHANNEL.split(", ");

// Define configuration options
const opts = {
    options: {
        clientId: process.env.T_CLIENT_ID,
        joinInterval: 2000
    },
    identity: {
        username: process.env.T_USER,
        password: process.env.T_PASS
    },
    channels: channels,
    connection: {
        reconnect: true,
        maxReconnectAttempts: 'Infinity',
        reconnectInterval: 1000,
        maxReconnectInterval: 30000,
        reconnectDecay: 1.5,
        secure: true
    },
};
// Create a client with our options
const client = new tmi.client(opts);

module.exports = client;