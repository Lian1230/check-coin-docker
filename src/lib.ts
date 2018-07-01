import { merge, set } from 'lodash';
import axios from 'axios';
import mailer from './mailer';
import { interval } from './config';

export const limit = {
  ETH: {
    low: null,
    high: null,
  },
  LTC: {
    low: null,
    high: null,
  },
};

export const getPrice = () =>
  axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,ETH,LTC,CAD')
    .then(res => {
      if (res.status !== 200) {
        throw res;
      }
      return res.data;
    });

export const formatData = data => Object.keys(data)
  .reduce(
    (obj, key) => (key !== 'CAD')
      ? Object.assign(obj, { [key]: data.CAD / data[key] })
      : obj,
    { LIMIT: JSON.stringify(limit), RAW: JSON.stringify(data) },
);

/* return array of coins that reached the limit */
export const checkLimit = data => Object.keys(data)
  .filter(key => !!limit[key])
  .reduce(
    (reached, key) => {
      if (limit[key].low && data[key] < limit[key].low) {
        merge(limit, { [key]: { low: null } });
        return reached.concat(key);
      }
      if (limit[key].high && data[key] > limit[key].high) {
        merge(limit, { [key]: { high: null } });
        return reached.concat(key);
      }
      return reached;
    },
    []);

const sendMail = () => {
  let checkTime = 0;
  return (data, reached) => {
    checkTime += 1;
    const hits = !!reached[0] ? reached.join(' ') : null;
    if (24 * 60 / interval === checkTime) {
      mailer(data, hits);
      checkTime = 0;
    }
    else if (hits) mailer(data, hits);
  };
};

export const sendAlert = sendMail();

export const setLimit = newLimit => merge(limit, newLimit);

export const formatQuery = (query) => {
  const output = {};
  for (const key of Object.keys(query)) {
    if (!key.match(/(eth|btc|ltc)\.(low|high)/)
      || !query[key]
      || !query[key].match(/[0-9]+/)
    ) return false;
    const newKey = key
      .split('.')
      .map((value, index) => index === 0 ? value.toUpperCase() : value)
      .join('.');
    const newValue = query[key] === 'null' ? null : parseInt(query[key], 10);
    set(output, newKey, newValue);
  }
  return output;
};
