module.exports.validateSignUpInput = (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (firstName.trim() === '') {
    errors.firstName = 'Firstname must not be empty.';
  }

  if (lastName.trim() === '') {
    errors.lastName = 'Lastname must not be empty.';
  }

  if (email.trim() === '') {
    errors.email = 'Email must not be empty.';
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
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateProfileInput = (
  firstName,
  lastName,
  birthdate,
  location,
  pronouns,
  bio,
  avatar,
  coverPhoto,
  tags
) => {
  const errors = {};

  if (firstName.trim() === '') {
    errors.firstName = 'Firstname must not be empty.';
  }

  if (lastName.trim() === '') {
    errors.firstName = 'Firstname must not be empty.';
  }

  if (birthdate.trim() === '') {
    errors.birthdate = 'Birthdate must not be empty.';
  }

  if (location.trim() === '') {
    errors.location = 'Location must not be empty.';
  }

  if (pronouns.trim() === '') {
    errors.pronouns = 'Pronouns must not be empty.';
  }

  if (bio.trim() === '') {
    errors.bio = 'Bio must not be empty.';
  }

  if (avatar.trim() === '') {
    errors.avatar = 'Avatar must not be empty.';
  }

  if (coverPhoto.trim() === '') {
    errors.coverPhoto = 'Cover photo must not be empty.';
  }

  if (tags.length < 3) {
    errors.tags = 'Tags must be at least 3.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Email must not be empty.';
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
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
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validatePostInput = (title, content) => {
  const errors = {};

  if (title.trim() === '') {
    errors.title = 'Title must not be empty.';
  }

  if (content.trim() === '') {
    errors.content = 'Content must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateCommentInput = (body) => {
  const errors = {};

  if (body.trim() === '') {
    errors.body = 'Body must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
