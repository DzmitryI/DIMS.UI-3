const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_API_BASE_FIREBASE,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

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

function formValid(inputs) {
  let isFormValid = true;
  Object.keys(inputs).forEach((name) => {
    isFormValid = inputs[name].valid && isFormValid;
  });
  return isFormValid;
}

function fillControl(input, controlName) {
  input[controlName].valid = true;
  input[controlName].touched = true;
  return input;
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

export { validateControl, createControl, createNotify, fillControl, formValid, config };
