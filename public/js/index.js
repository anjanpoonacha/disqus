import '@babel/polyfill';
import { login } from './login';
import { addComment, likeComment, dislikeComment } from './comment';
import { showAlert } from './alert';

const commentFormDirect = document.querySelector('.form--comment-direct');
const loginForm = document.querySelector('.form--login');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (commentFormDirect) {
  const textArea = document.querySelector('.form__text');
  commentFormDirect.addEventListener('submit', e => {
    e.preventDefault();
    const formText = textArea.value;

    textArea.value = '';
    addComment(document, formText, 'comment');
  });
}

document.addEventListener('submit', e => {
  e.preventDefault();
  let text;
  if (e.srcElement != commentFormDirect) {
    const commentId = e.target.id.split('--')[1];
    try {
      text = document.querySelector(`.form__text-${commentId}`).value;
      addComment(document, text, 'subcomment', commentId);
    } catch (err) {
      if (!loginForm) {
        showAlert('error', 'Please reload the page before commenting');
      }
    }
  }
});

const setAriaAttribute = (btn, boolean) => {
  btn.setAttribute('aria-pressed', boolean);
};

document.addEventListener('click', async e => {
  let apAttr = 'aria-pressed';
  const commentId = e.srcElement.id;

  const likeBtn = document.getElementById(
    `${commentId.split('-')[0]}-like-${commentId.split('-')[2]}`
  );
  const dislikeBtn = document.getElementById(
    `${commentId.split('-')[0]}-dislike-${commentId.split('-')[2]}`
  );

  if (e.srcElement === likeBtn) {
    try {
      const commentData = await likeComment(
        commentId.split('-')[0],
        commentId.split('-')[2]
      );

      // SAVING TO A VARIABLE LEADS TO UNDESIRABLE RESULT (BECAUSE OF CACHING, I THINK!)
      console.log(commentData);
      document.querySelector(
        `.${commentId.split('-')[0]}-like-count-${commentId.split('-')[2]}`
      ).textContent = commentData.likes;

      document.querySelector(
        `.${commentId.split('-')[0]}-dislike-count-${commentId.split('-')[2]}`
      ).textContent = commentData.dislikes;
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  }
  if (e.srcElement === dislikeBtn) {
    try {
      const commentData = await dislikeComment(
        commentId.split('-')[0],
        commentId.split('-')[2]
      );
      console.log(commentData);

      // SAVING TO A VARIABLE LEADS TO UNDESIRABLE RESULT (BECAUSE OF CACHING, I THINK!)
      document.querySelector(
        `.${commentId.split('-')[0]}-like-count-${commentId.split('-')[2]}`
      ).textContent = commentData.likes;

      document.querySelector(
        `.${commentId.split('-')[0]}-dislike-count-${commentId.split('-')[2]}`
      ).textContent = commentData.dislikes;
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  }
});
