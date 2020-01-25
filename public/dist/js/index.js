import '@babel/polyfill';

const commentForm = document.querySelector('.comment-form');

if (commentForm) {
  commentForm.addEventListener('submit', e => {
    event.preventDefault();
  });
}
