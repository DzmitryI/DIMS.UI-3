import { getDate, countAge, getSort } from './helpersComponents';

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

describe('getSor', () => {
  const members = [{ name: 'Pavel' }, { name: 'Dmitriy' }, { name: 'Alina' }];
  const res = [{ name: 'Alina' }, { name: 'Dmitriy' }, { name: 'Pavel' }];
  it('sort object', () => {
    members.sort(getSort('up', 'name'));
    expect(members).toEqual(res);
  });
});
