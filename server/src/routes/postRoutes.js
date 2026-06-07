import express from 'express';
import {
  createPostController,
  getPostController,
  updatePostController,
  getClubPostsController,
  likePostController,
  addCommentController,
  deletePostController,
} from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/:id', optionalAuth, getPostController);
router.get('/club/:clubId/posts', optionalAuth, getClubPostsController);


router.post('/club/:clubId', authMiddleware, createPostController);
router.put('/:id', authMiddleware, updatePostController);
router.delete('/:id', authMiddleware, deletePostController);
router.post('/:id/like', authMiddleware, likePostController);
router.post('/:id/comment', authMiddleware, addCommentController);

export default router;
