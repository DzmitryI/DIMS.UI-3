function validateControl(value, validation) {
  let isValid = true;

  if (!validation) {
    return true;
  }
  if (validation.required) {
    isValid = value.trim() !== '';
  }

  if (validation.email) {
    const reg = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    isValid = !!reg.exec(value);
  }

  if (validation.minLenght) {
    isValid = value.length >= validation.minLenght;
  }
  return isValid;
}

function createControl(config, validation) {
  return {
    ...config,
    validation,
    valid: !validation,
    touched: false,
    value: '',
  };
}

function createNotify() {
  return {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    rtl: false,
  };
}

export { validateControl, createControl, createNotify };
