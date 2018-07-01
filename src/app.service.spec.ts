import { merge } from 'lodash';
import { formatQuery, limit, formatData, checkLimit, setLimit } from './lib';

const mockRawData = { BTC: 0.07101, ETH: 1, LTC: 5.53, CAD: 607.95 };
const defaultLimit = { ETH: { high: null, low: null }, LTC: { high: null, low: null } };
const formattedData = {
  BTC: 8561.47021546261,
  ETH: 607.95,
  LTC: 109.9367088607595,
  Limit: defaultLimit,
  Raw: {
    BTC: 0.07101,
    CAD: 607.95,
    ETH: 1,
    LTC: 5.53,
  },
};
const newLimit = { ETH: { low: 610 } };
const query = {
  'eth.low': '500',
  'ltc.high': '300',
};
const formattedQuery = {
  ETH: { low: 500 },
  LTC: { high: 300 },
};

describe('Test format data', () => {
  it('should return the formatted data', () => {
    expect(formatData(mockRawData)).toEqual(formattedData);
  });
});

describe('Test set limit', () => {
  it('should return the new limit', () => {
    const afterSet = merge({}, limit, newLimit);
    expect(setLimit(newLimit)).toEqual(afterSet);
    expect(limit).toEqual(afterSet);
  });
});

describe('Test check limit', () => {
  it('should return the reached items', () => {
    expect(checkLimit(formattedData)).toEqual(['ETH']);
  });
  it('should set limit to null', () => {
    expect(limit).toEqual(defaultLimit);
  });
});

describe('Test format set limit query', () => {
  it('should return the new limit from query', () => {
    expect(formatQuery(query)).toEqual(formattedQuery);
  });
});
