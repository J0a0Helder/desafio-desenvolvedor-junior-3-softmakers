const express = require('express');
const postsController = require('../controllers/postsController');
const tokenValidation = require('../middlewares/tokenMiddleware');

const postRouter = express.Router();

postRouter.post('/', postsController.newPost);
postRouter.put('/:id', tokenValidation, postsController.editPost);
postRouter.get('/', tokenValidation, postsController.getAll);
postRouter.get('/:id', tokenValidation, postsController.getById);
postRouter.delete('/:id', tokenValidation, postsController.deletePost);

module.exports = postRouter;