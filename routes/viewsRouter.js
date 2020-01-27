const express = require('express');

const viewsController = require('../controller/viewsController');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.post('/', viewsController.createPost);

router.get('/login', viewsController.getLoginForm);
router.post('/login', userController.login);
router.post('/signup', userController.signup);

router.get('/:slug', viewsController.getPost);

router.get('/posts/comments', viewsController.getComments);

router.use(userController.isLoggedIn);

router.post('/posts', viewsController.createComment);
router.patch('/posts/likeComment', viewsController.likeComment);
router.patch('/posts/dislikeComment', viewsController.dislikeComment);

module.exports = router;
