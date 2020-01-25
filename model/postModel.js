const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'A Post cannot be empty']
    },
    slug: String,
    postedAt: {
      type: Date,
      default: Date.now
    },
    postedBy: {
      type: String,
      required: [true, 'A Post must have an author.']
    },
    description: {
      type: String,
      required: [true, 'A post description cannot be empty']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postSchema.virtual('comments', {
  // populate getPosts
  ref: 'Comment',
  foreignField: 'Post',
  localField: '_id'
});

// postSchema.index({ title: 1 }, { unique: true });

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'comments'
  });
  next();
});

postSchema.pre('save', function() {
  this.slug = slugify(this.title, { lower: true });
});
// postSchema.virtual('slug').get(function() {});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
