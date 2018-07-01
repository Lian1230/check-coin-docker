import { Injectable } from '@nestjs/common';
import { setLimit, formatQuery, getPrice, formatData, checkLimit, sendAlert } from './lib';
import { interval } from './config';

let render;
const getData = () => getPrice()
  .then(formatData)
  .then(dat => render = dat)
  .then(() => sendAlert(render, checkLimit(render)))
  .catch(e => render = e);
getData();
setInterval(() => getData(), interval * 60 * 1000);

@Injectable()
export class AppService {
  check() {
    return render;
  }
  setLimit(query) {
    const newLimit = formatQuery(query);
    return newLimit
      ? setLimit(newLimit)
      : 'Invalid Query Format.';
  }
}
