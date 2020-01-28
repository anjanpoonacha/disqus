const Post = require('./../model/postModel');
const Comment = require('./../model/commentModel');
const SubComment = require('./../model/subCommentModel');
const User = require('./../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const posts = await Post.find().sort({ postedAt: -1 });
  res.status(200).render('overview', {
    title: 'All Posts',
    posts
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: `Login`
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  //
  const post = await Post.create(req.body);
  res.status(200).json({
    status: 'SUCCESS',
    data: {
      post
    }
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug });
  res.locals.post = post;
  res.status(200).render('post', { title: post.title, post });
});

const createCommentOnModel = async (model, req, res) => {
  const { slug } = req.body;
  const post = await Post.findOne({ slug });
  const { commentId } = req.body;
  req.body.Post = post._id || null;
  req.body.postedBy = req.user.username;

  const comment = await model.create(req.body);

  res.status(200).json({
    status: 'SUCCESS',
    comment
  });
};

exports.createComment = catchAsync(async (req, res, next) => {
  let { model } = req.body;

  if (!model) return next(new AppError(`Error while creating comment`, 500));
  if (model === 'comment') {
    return await createCommentOnModel(Comment, req, res);
  } else if (model === 'subcomment') {
    return await createCommentOnModel(SubComment, req, res);
  }
});

exports.likeComment = catchAsync(async (req, res, next) => {
  const { commentId, commentType } = req.body;
  const { username } = req.user;

  let updatedComment;
  let commentModel =
    commentType === 'subcomment'
      ? SubComment
      : commentType === 'comment'
      ? Comment
      : null;

  if (!commentModel) {
    return next(
      new AppError('Something went wrong! Check Model in Like or Dislike.', 500)
    );
  }

  if (!commentId) {
    return next(new AppError('Please provide the comment ID', 400));
  }

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    return next(new AppError('The comment was not found', 400));
  }
  if (comment.likedBy.includes(username)) {
    return next(new AppError('You already liked this post!', 400));
  }
  if (comment.disLikedBy.includes(username)) {
    comment.dislikes--;
    const arrIndex = comment.disLikedBy.indexOf(username);
    comment.disLikedBy.splice(arrIndex, 1);
  }
  comment.likes++;
  comment.likedBy.push(username);
  updatedComment = await comment.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ status: 'SUCCESS', message: 'Liked!', updatedComment });
});

exports.dislikeComment = catchAsync(async (req, res, next) => {
  const { commentId, commentType } = req.body;
  let updatedComment;
  let commentModel =
    commentType === 'subcomment'
      ? SubComment
      : commentType === 'comment'
      ? Comment
      : null;

  if (!commentModel) {
    return next(
      new AppError('Something went wrong! Check Model in Like or Dislike.', 500)
    );
  }

  const { username } = req.user;

  if (!commentId) {
    return next(new AppError('Please provide the comment ID', 400));
  }

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    return next(new AppError('The comment was not found', 400));
  }
  if (comment.disLikedBy.includes(username)) {
    return next(new AppError('You already disliked this post', 400));
  }
  if (comment.likedBy.includes(username)) {
    comment.likes--;
    const arrIndex = comment.likedBy.indexOf(username);
    comment.likedBy.splice(arrIndex, 1);
  }
  comment.dislikes++;
  comment.disLikedBy.push(username);
  updatedComment = await comment.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ status: 'SUCCESS', message: 'Disiked!', updatedComment });
});

// testing

exports.getComments = catchAsync(async (req, res, next) => {
  //
  const comments = await Comment.find({});
  res.status(200).json({
    data: { comments }
  });
});

// exports.getPosts = catchAsync(async (req, res, next) => {
//   //
//   const posts = await Post.find({});
//   res.status(200).json({
//     data: { posts }
//   });
// });

// const str = 'sub-';
// let commentModel;

// const strType = str.split('-')[0];

// commentModel =
//   strType === 'sub' ? SubComment : strType === 'direct' ? Comment : null;

// console.log(commentModel);
