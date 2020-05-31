import { getDate, countAge } from './helpersComponents';

describe('getDate', () => {
  it('get correct date', () => {
    const value = getDate('1999-12-31T22:00:00.000Z');
    expect(value).toEqual('31.12.1999');
  });
});

describe('countAge', () => {
  it('get current age', () => {
    const value = countAge('1999-12-31T22:00:00.000Z');
    expect(value).toEqual(20);
  });
});
