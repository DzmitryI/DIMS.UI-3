function clearOblectValue(objInput, objElem) {
  const objInputClear = { ...objInput };
  const objElemClear = { ...objElem };
  Object.keys(objInputClear).forEach((key) => {
    if (objInputClear[key]) {
      objInputClear[key].value = '';
      objInputClear[key].touched = false;
      objInputClear[key].valid = false;
      objElemClear[key] = '';
    }
  });
  if (objElemClear.directionId) {
    objElemClear.directionId = 'direction1';
  }
  if (objElemClear.sex) {
    objElemClear.sex = 'sex1';
  }
  if (objElemClear.description) {
    objElemClear.description = '';
  }
  if (objElemClear.trackNote) {
    objElemClear.trackNote = '';
  }
  if (objElemClear.startDate) {
    objElemClear.startDate = new Date();
  }
  if (objElemClear.deadlineDate) {
    objElemClear.deadlineDate = new Date();
  }
  const res = {
    objInputClear,
    objElemClear,
  };
  return res;
}

function updateInput(objInput, objValues) {
  const objInputUpdate = { ...objInput };
  Object.entries(objValues).forEach(([key, value]) => {
    if (objInputUpdate[key]) {
      objInputUpdate[key].value = value;
      objInputUpdate[key].touched = true;
      objInputUpdate[key].valid = true;
    }
  });
  return objInputUpdate;
}
export { clearOblectValue, updateInput };
