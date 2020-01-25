const mongoose = require('mongoose');

const subCommentSchema = mongoose.Schema({
  text: {
    type: String,
    required: [true, 'A comment cannot be blank']
  },
  Comment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
    required: [true, 'A sub comment must have a ref to comment']
  },
  postedBy: {
    type: String,
    required: [true, 'Provide the username for a subcomment']
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [Array],
  dislikes: {
    type: Number,
    default: 0
  },
  disLikedBy: [Array]
});

const SubComment = mongoose.model('SubComment', subCommentSchema);

module.exports = SubComment;
