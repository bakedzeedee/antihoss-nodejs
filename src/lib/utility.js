let NumUtil = {
    isInt: (query) => {
        return !isNaN(query) && !isNaN(+query) && !isNaN(parseInt(query));
    },
    isFloat: (query) => {
        return !isNaN(query) && !isNaN(+query) && !isNaN(parseFloat(query));
    }
};

let DateUtil = {
    getDateString: () => {
        const date_ob = new Date();

        const year = date_ob.getFullYear();
        const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
        const date = ('0' + date_ob.getDate()).slice(-2);

        const hours = ('0' + date_ob.getHours()).slice(-2);
        const minutes = ('0' + date_ob.getMinutes()).slice(-2);
        const seconds = ('0' + date_ob.getSeconds()).slice(-2);

        return `${year}-${month}-${date}:${hours}-${minutes}-${seconds}`;
    },

    getNewDateByMonths: (months) => {
        const today = new Date();
        const newDate = new Date();

        let newMonth = today.getMonth() + months;
        let newYear = today.getFullYear();

        while (newMonth < 0) {
            newMonth += 12;
            newYear -= 1;
        }
        while (newMonth > 11) {
            newMonth -= 12;
            newYear += 1;
        }

        newDate.setMonth(newMonth);
        newDate.setFullYear(newYear);

        const maxDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (newDate.getDate > maxDate[newMonth]) {
            newDate.setDate(maxDate[newMonth]);
        }

        return newDate;
    }
};

let StringUtil = {
    splitFirst: (string, pattern) => {
        let splitString = string.split(pattern);
        let firstPart = splitString[0]; // first delimited string
        let lastPart = ''; // remaining delimited strings, concatenated
        let result = []; // first Object is first delimited string, second Object is remaining delimited strings, concatenated

        for (let i = 1; i < splitString.length; i++) {
            lastPart += ' ' + splitString[i];
        }

        lastPart = lastPart.trim();

        result.push(firstPart);
        if (lastPart) result.push(lastPart);

        return result;
    }
}


export { NumUtil, DateUtil, StringUtil };