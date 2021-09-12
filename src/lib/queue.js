class Queue {
    constructor(period) {
        this.period = period;
        this.queue = [];
        this.poller = null;
        this.drawing = false;
        document.addEventListener("Clear", () => {this.drawing = false});
    }

    enqueue(fn, context, args) {
        let event = () => {
            fn.apply(context, args);
        }
        this.queue.push(event);
        this.dequeue();
        if(this.poller === null) {
            this.poller = setInterval(() => {
                this.dequeue();
            }, this.period);
        }
    }

    dequeue() {
        if(this.drawing === false) {
            if(this.queue.length === 0 && this.poller) {
                clearInterval(this.poller);
                this.poller = null;
            }
            else if(this.queue.length > 0) {
                this.drawing = true;
                let event = this.queue.shift();
                event();
            }
        }
    }
}

export default Queue;