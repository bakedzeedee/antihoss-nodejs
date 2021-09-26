import client from './clientHelper.js';
import messages from './messages.js';

const intervals = [];

const intervalMessage = (target, messageObj) => {
    const interval = setInterval(()=>{
        client.say(target, messageObj.message).catch(()=>{});
    }, messageObj.interval);

    intervals.push(interval);
};

const intervalMessages = (target) => {
    messages.forEach((messageObj)=>{
        intervalMessage(target, messageObj);
    });
};

const stopIntervals = () => {
    intervals.forEach((interval)=> {
        clearInterval(interval);
    });
};

export { intervalMessages, stopIntervals };