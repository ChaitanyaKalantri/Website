var validator = require('validator');
var isEmpty = require('./is_empty');

module.exports = function validateProfileInput(data){
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle: '';
  data.status = !isEmpty(data.status) ? data.status: '';
  data.skills = !isEmpty(data.skills) ? data.skills: '';


  if(!validator.isLength(data.handle, {min: 2, max: 40})){
    errors.handle = 'Handle must be between 2 and 40 characters';
  }
  if(validator.isEmpty(data.handle)){
    errors.handle = 'Profile Handle is required';
  }


  if(validator.isEmpty(data.status)){
    errors.status = 'Status field is required';
  }
  if(validator.isEmpty(data.skills)){
    errors.skills = 'Skills field is required';
  }

  // Even thought these are not required: true; However, we want the URL to
  // be formatted. Hence, we are first checking if it's Empty or not.
  // If present, then we will check for the validation.
  if(!isEmpty(data.website)){
    if(!validator.isURL(data.website)){
      errors.website = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.youtube)){
    if(!validator.isURL(data.youtube)){
      errors.youtube = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.twitter)){
    if(!validator.isURL(data.twitter)){
      errors.twitter = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.facebook)){
    if(!validator.isURL(data.facebook)){
      errors.facebook = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.linkedin)){
    if(!validator.isURL(data.linkedin)){
      errors.linkedin = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.instagram)){
    if(!validator.isURL(data.instagram)){
      errors.instagram = 'Not a valid URL';
    }
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}

