const { client } = require('./clientHelper.js');
const { messages } = require('./messages.js');

const intervals = [];

const intervalMessage = (target, messageObj) => {
    const interval = setInterval(()=>{
        client.say(target, messageObj.message);
    }, messageObj.interval);

    intervals.push(interval);
}

exports.intervalMessages = (target) => {
    messages.forEach((messageObj)=>{
        intervalMessage(target, messageObj);
    });
}

exports.stopIntervals = () => {
    intervals.forEach((interval)=> {
        clearInterval(interval);
    });
}