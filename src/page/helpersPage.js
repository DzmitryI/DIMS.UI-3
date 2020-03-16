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
  if (objElemClear['directionId']) {
    objElemClear['directionId'] = 'direction1';
  }
  if (objElemClear['sex']) {
    objElemClear['sex'] = 'sex1';
  }
  if (objElemClear['description']) {
    objElemClear['description'] = '';
  }
  const res = {
    objInputClear,
    objElemClear,
  };
  return res;
}

export { clearOblectValue };
