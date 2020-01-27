const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'A comment cannot be blank']
    },
    Post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'A comment must have a ref to Post']
    },
    postedBy: { type: String, required: [true, 'Please provide the username'] },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likedBy: [Array],
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    },
    disLikedBy: [Array]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

commentSchema.virtual('subComment', {
  ref: 'SubComment',
  localField: '_id',
  foreignField: 'Comment'
});

commentSchema.pre(/^find/, function(next) {
  this.populate('subComment').sort({ createdAt: -1 });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
