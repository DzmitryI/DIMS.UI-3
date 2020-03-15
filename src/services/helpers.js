function validateControl(value, validation) {
  if (!validation) {
    return true;
  }
  let isValid = true;
  if (validation.required) {
    isValid = value.trim() !== '';
  }

  if (validation.email) {
    let reg = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    isValid = reg.exec(value);
  }

  if (validation.minLenght) {
    isValid = value.length >= validation.minLenght;
  }
  return isValid;
}

export { validateControl };
