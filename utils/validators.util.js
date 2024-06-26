module.exports.validateSignUpInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username must not be empty.';
  }

  if (email.trim() === '') {
    errors.username = 'Username must not be empty.';
  } else {
    const regEx = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address.';
    }
  }

  if (password === '') {
    errors.password = 'Password must not be empty.';
  } else {
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords must match.';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateProfileInput = (name, birthdate) => {
  const errors = {};

  if (name.trim() === '') {
    errors.name = 'Name must not be empty.';
  }

  if (birthdate.trim() === '') {
    errors.birthdate = 'Birthdate must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username must not be empty.';
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateSubForumInput = (name, description) => {
  const errors = {};

  if (name.trim() === '') {
    errors.name = 'Name must not be empty.';
  }

  if (description.trim() === '') {
    errors.description = 'Description must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validatePostInput = (title, body, subForum) => {
  const errors = {};

  if (title.trim() === '') {
    errors.title = 'Title must not be empty.';
  }

  if (body.trim() === '') {
    errors.body = 'Body must not be empty.';
  }

  if (subForum.trim() === '') {
    errors.subForum = 'Subforum must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateCommentInput = body => {
  const errors = {};

  if (body.trim() === '') {
    errors.body = 'Body must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
