import axios from 'axios';
import { showAlert } from './alert';

export const addComment = async (document, text, commentType, Comment) => {
  const model = commentType;
  const slug = document.location.pathname.split('/')[1];

  try {
    const res = await axios({
      // url: 'http://127.0.0.1:3000/posts/',
      url: '/posts/',
      method: 'POST',
      data: { text, model, slug, Comment }
    });

    const comment = { ...res.data.comment };

    // HTML ELEMENT FOR  DIRECT COMMENT
    const htmlDirectComment = `
    <div class="comment__wrapper comment__wrapper-direct-${comment.Post}"><img class="comment__user-img" src="/img/${comment.postedBy}.png"
    alt="User">
  <div class="comment__user-name">${comment.postedBy}</div>
  <div class="comment__text">${comment.text}</div>
</div>
<div class="comment__cta mg-bt-sm comment__cta--direct-${comment.Post}">
  <div class="btn-reply" id="reply-checkbox--0" role="checkbox" onclick="changeCheckbox()" aria-checked="false">Reply
  </div>
  <div class="btn-like" aria-pressed="false" role="button">Like ${comment.likes}</div>
  <div class="btn-dislike" aria-pressed="false" role="button">Dislike ${comment.dislikes}</div>
  <form class="form--comment-sub"><textarea class="form__text form__text-${comment.Post}"
      placeholder="Write your thoughts..." required="" name="comment" id="" rows="5"
      style="resize: none; width: 100%; "></textarea><button
      class="btn btn--grey btn--reply btn-comment.Post" type="submit">Add comment</button></form>
</div>
    `;

    // HTML ELEMENT FOR SUBCOMMENT
    let htmlSubComment = `
    <div class="sub-comment">
  <div class="comment__wrapper comment__wrapper-sub-${comment._id}">
    <img class="comment__user-img" src="/img/default.png" alt="User 1" />
    <div class="comment__user-name">${comment.postedBy}</div>
    <div class="comment__text"><p>${comment.text}</p></div>
  </div>
  <div class="comment__cta mg-bt-sm comment__cta--sub-${comment._id}">
    <div
      class="btn-like"
      aria-pressed="false"
      role="button"
      id="like-${comment._id}"
    >
      Like 0
    </div>
    <div
      class="btn-dislike"
      aria-pressed="false"
      role="button"
      id="like-${comment._id}"
    >
      Dislike 0
    </div>
  </div>
</div>`;

    let html;

    // RENDER HTML
    if (commentType === 'comment') {
      html = htmlDirectComment;

      document
        .querySelector('.form--comment-direct')
        .insertAdjacentHTML('afterend', html);
      //
    } else if (commentType === 'subcomment') {
      //
      html = htmlSubComment;
      document
        .querySelector(`.comment__cta--direct-${Comment}`)
        .insertAdjacentHTML('afterend', html);
    }

    // CLOSE REPLY FORM
    document.querySelectorAll('.btn-reply').forEach(el => {
      el.setAttribute('aria-checked', false);
    });

    // SHOW ALERT
    if (res.data.status === 'SUCCESS') {
      showAlert('success', 'Comment successful');
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

export const likeComment = async (commentType, commentId) => {
  try {
    const res = await axios({
      // url: 'http://127.0.0.1:3000/posts/likeComment',
      url: '/posts/likeComment',
      method: 'PATCH',
      data: {
        commentType,
        commentId
      }
    });
    return res.data.updatedComment;
  } catch (err) {
    showAlert('error', err.response.data.message);
    throw err;
  }
};

export const dislikeComment = async (commentType, commentId) => {
  try {
    const res = await axios({
      // url: 'http://127.0.0.1:3000/posts/dislikeComment',
      url: '/posts/dislikeComment',
      method: 'PATCH',
      data: {
        commentType,
        commentId
      }
    });
    return res.data.updatedComment;
  } catch (err) {
    showAlert('error', err.response.data.message);
    throw err;
  }
};
