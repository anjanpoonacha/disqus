const Post = require('./../model/postModel');
const Comment = require('./../model/commentModel');
const SubComment = require('./../model/subCommentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  console.log(posts.comments);
  res.status(200).render('overview', {
    title: 'All Posts',
    posts
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
  console.log(post.comments);
  res.locals.post = post;
  res.status(200).render('post', { post });
});

const createCommentOnModel = async (model, req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug });
  const { commentId } = req.body;
  req.body.Post = post._id;
  req.body.postedBy = res.locals.user.username;

  console.log(res.locals.user.username);

  const comment = await model.create(req.body);

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      comment
    }
  });
};

exports.createComment = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  let { model } = req.body;
  model = 'subcomment';

  if (!model) return next(new AppError(`Error while creating comment`, 500));
  if (model === 'comment') {
    // const post = await Post.findOne({ slug });
    // req.body.Post = post._id;
    // const comment = Comment.create(req.body);
    return await createCommentOnModel(Comment, req, res);
  } else if (model === 'subcomment') {
    return await createCommentOnModel(SubComment, req, res);
  }

  // next();
  // res.locals.
});

// testing

// exports.getComments = catchAsync(async (req, res, next) => {
//   //
//   const comments = await Comment.find({});
//   res.status(200).json({
//     data: { comments }
//   });
// });

// exports.getPosts = catchAsync(async (req, res, next) => {
//   //
//   const posts = await Post.find({});
//   res.status(200).json({
//     data: { posts }
//   });
// });
