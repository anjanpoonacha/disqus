const express = require('express');

const viewsController = require('../controller/viewsController');
const userController = require('../controller/userController');

const router = express.Router();

// router.get('/posts/comments', viewsController.getComments);
// router.get('/posts', viewsController.getPosts);

router.post('/', viewsController.createPost);
router.get('/', viewsController.getOverview);

router.get('/:slug', viewsController.getPost);

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.use(userController.isLoggedIn);

router.post('/:slug', viewsController.createComment);

module.exports = router;
