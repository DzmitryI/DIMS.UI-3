import { clearObjectValue } from './helpersPage';

describe('clearObjectValue', () => {
  const taskInput = {};
  const task = {
    description: 'description task 1',
    name: 'Task №1',
  };
  const objInputClear = {};
  const objElemClear = {
    description: '',
    name: '',
  };
  const res = { objInputClear, objElemClear };
  it('clear object value', () => {
    const value = clearObjectValue(taskInput, task);
    expect(value).toEqual(res);
  });
});
