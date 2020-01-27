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
    } catch (err) {
      showAlert('error', 'Please reload the page before commenting');
    }
    addComment(document, text, 'subcomment', commentId);
  }
});

document.addEventListener('click', async e => {
  let apAttr = 'aria-pressed';
  const commentId = e.srcElement.id;

  const likeBtn = document.getElementById(
    `${commentId.split('-')[0]}-like-${commentId.split('-')[2]}`
  );
  const dislikeBtn = document.getElementById(
    `${commentId.split('-')[0]}-dislike-${commentId.split('-')[2]}`
  );

  // console.log(JSON.parse(likeBtn.getAttribute(apAttr)));

  if (e.srcElement === likeBtn) {
    if (JSON.parse(likeBtn.getAttribute(apAttr))) {
      document.querySelector(
        `.${commentId.split('-')[0]}-like-count-${commentId.split('-')[2]}`
      ).textContent++;

      if (JSON.parse(dislikeBtn.getAttribute(apAttr))) {
        dislikeBtn.setAttribute(apAttr, false);
        //
        document.querySelector(
          `.${commentId.split('-')[0]}-dislike-count-${commentId.split('-')[2]}`
        ).textContent--;
      }
    } else {
      likeBtn.setAttribute(apAttr, true);
    }
    // (comment || subcomment, commentId)
    return await likeComment(commentId.split('-')[0], commentId.split('-')[2]);
  }

  if (e.srcElement === dislikeBtn) {
    if (JSON.parse(dislikeBtn.getAttribute(apAttr))) {
      // ASSIGNING TO A VARIABLE LEADS TO  UNDESIRABLE RESULT DUE TO CACHE
      document.querySelector(
        `.${commentId.split('-')[0]}-dislike-count-${commentId.split('-')[2]}`
      ).textContent++;

      if (JSON.parse(likeBtn.getAttribute(apAttr))) {
        likeBtn.setAttribute(apAttr, false);

        document.querySelector(
          `.${commentId.split('-')[0]}-like-count-${commentId.split('-')[2]}`
        ).textContent--;
      }
      //
    } else {
      dislikeBtn.setAttribute(apAttr, true);
    }
    // (comment || subcomment, commentId)
    return await dislikeComment(
      commentId.split('-')[0],
      commentId.split('-')[2]
    );
  }
});
