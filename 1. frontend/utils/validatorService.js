var errors = [];

function next(value){
  errors = [];
  errors.push({message: value});
  return errors;
}

export const usernameValidator = (username) => {
    if(username === ""){
      return next("Please enter username field")
    }
    if (username.length <= 3) {
      return next("Username must be at least four characters");
    }
    if (/[^\w]/g.test(username)) {
      return next("Username can contain only underscores, letters and numbers")
    }
    if (/^[0-9]/.test(username)) {
      return next("Username cannot start with a number")
    }
    if (username.length >= 21) {
      return next("Username must be at most 20 characters");
    }
}

export const emailValidator = (email) => {
  if(email === ""){
    return next("Please enter email field")
  }
  if (!/[a-z0-9]{6,}@g?e?mail.com/.test(email) || /^[0-9]/.test(email)) {
    return next("Please enter a valid email address")
  }  
}


export const passwordValidator = (password, password2) => {
    if (password === "" || password2 === "") {
      return next("Please enter password value");
    }
    if (password.length < 6) {
      return next("Your password must be at least 8 characters long")
    }
    if (/\s/.test(password) || /\s/.test(password2)) {
      return next("Your password must not contain whitespaces")
    }
    if (password.search(/[a-z]/i) < 0) {
      return next("Your password must contain at least one letter.")
    }
    if (password.search(/[0-9]/) < 0) {
      return next("Your password must contain at least one digit.")
    }
    if (password !== password2) {
      return next("Please enter matching passwords")
    }  
}
