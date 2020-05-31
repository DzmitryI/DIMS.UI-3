function clearOblectValue(objInput, objElem) {
  const objInputClear = { ...objInput };
  const objElemClear = { ...objElem };
  Object.keys(objInputClear).forEach((key) => {
    if (objInputClear[key]) {
      objInputClear[key].value = '';
      objInputClear[key].touched = false;
      objInputClear[key].valid = false;
    }
  });
  Object.keys(objElemClear).forEach((key) => {
    console.log(objElemClear[key]);
    if (key === 'directionId') {
      objElemClear[key] = 'direction1';
    } else if (key === 'sex') {
      objElemClear[key] = 'sex1';
    } else if (['startDate', 'deadlineDate', 'birthDate'].includes(key)) {
      objElemClear[key] = new Date();
    } else {
      objElemClear[key] = '';
    }
  });

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
