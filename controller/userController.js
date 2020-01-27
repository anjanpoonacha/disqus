const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('./../model/userModel');

const createToken = catchAsync(async (user, statusCode, res) => {
  const token = `logged-in-${user._id}-${Date.now()}`;

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('mocked_jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'SUCCESS',
    token
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400));
  }
  const user = await User.findOne({ email });

  if (!user || password != user.password) {
    return next(new AppError('Incorrect email or password', 401));
  }

  req.user = user;

  createToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm
  });

  req.user = user;

  createToken(newUser, 201, res);
});

exports.isLoggedIn = async (req, res, next) => {
  /* Only for rendered pages, no errors */

  // 1. Check if the cookie exists
  if (!req.cookies.mocked_jwt) {
    return next(
      new AppError('Please login to proceed with this action! ', 401)
    );
  }
  try {
    // 2. Verification token
    const userId = req.cookies.mocked_jwt.split('-')[2];

    // 3. Check if user still exists
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(
        new AppError(`User with this id doesn't exist. Please login!`, 401)
      );
    }

    // THERE IS A LOGGED USER
    res.locals.user = currentUser;
    req.user = currentUser;
    return next();
  } catch (err) {
    return next();
  }

  next();
};
