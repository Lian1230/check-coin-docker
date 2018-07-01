"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const axios_1 = require("axios");
const mailer_1 = require("./mailer");
const config_1 = require("./config");
exports.limit = {
    ETH: {
        low: null,
        high: null,
    },
    LTC: {
        low: null,
        high: null,
    },
};
exports.getPrice = () => axios_1.default.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,ETH,LTC,CAD')
    .then(res => {
    if (res.status !== 200) {
        throw res;
    }
    return res.data;
});
exports.formatData = data => Object.keys(data)
    .reduce((obj, key) => (key !== 'CAD')
    ? Object.assign(obj, { [key]: data.CAD / data[key] })
    : obj, { raw: data });
exports.checkLimit = data => Object.keys(data)
    .filter(key => key !== 'raw' && !!exports.limit[key])
    .reduce((reached, key) => {
    if (exports.limit[key].low && data[key] < exports.limit[key].low) {
        lodash_1.merge(exports.limit, { [key]: { low: null } });
        return reached.concat(key);
    }
    if (exports.limit[key].high && data[key] > exports.limit[key].high) {
        lodash_1.merge(exports.limit, { [key]: { high: null } });
        return reached.concat(key);
    }
    return reached;
}, []);
const sendMail = () => {
    let checkTime = 0;
    return (data, reached) => {
        checkTime += 1;
        const hits = !!reached[0] ? reached.join(' ') : null;
        if (24 * 60 / config_1.interval === checkTime) {
            mailer_1.default(data, hits);
            checkTime = 0;
        }
        else if (hits)
            mailer_1.default(data, hits);
    };
};
exports.sendAlert = sendMail();
exports.setLimit = newLimit => lodash_1.merge(exports.limit, newLimit);
exports.formatQuery = (query) => {
    const output = {};
    for (const key of Object.keys(query)) {
        if (!key.match(/(eth|btc|ltc)\.(low|high)/)
            || !query[key]
            || !query[key].match(/[0-9]+/))
            return false;
        const newKey = key
            .split('.')
            .map((value, index) => index === 0 ? value.toUpperCase() : value)
            .join('.');
        const newValue = query[key] === 'null' ? null : parseInt(query[key], 10);
        lodash_1.set(output, newKey, newValue);
    }
    return output;
};
//# sourceMappingURL=lib.js.map