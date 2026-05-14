import { postService } from '../services/postService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activityLogger.js';
import { paginate } from '../utils/queryHelpers.js';

export const createPostController = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const post = await postService.createPost(req.body, req.userId, clubId);

  await logActivity(
    req.userId,
    'post',
    'post',
    post._id,
    'Created a new post',
    req
  );

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post,
  });
});

export const getPostController = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  res.json({
    success: true,
    message: 'Post retrieved',
    data: post,
  });
});

export const updatePostController = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.body);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  await logActivity(
    req.userId,
    'update',
    'post',
    post._id,
    'Updated a post',
    req
  );

  res.json({
    success: true,
    message: 'Post updated successfully',
    data: post,
  });
});

export const getClubPostsController = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const pagination = paginate(req.query);

  const result = await postService.getClubPosts(clubId, pagination);

  res.json({
    success: true,
    message: 'Club posts retrieved',
    data: result,
  });
});

export const likePostController = asyncHandler(async (req, res) => {
  const post = await postService.likePost(req.params.id, req.userId);

  res.json({
    success: true,
    message: 'Post like toggled',
    data: post,
  });
});

export const addCommentController = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const post = await postService.addComment(req.params.id, req.userId, text);

  res.json({
    success: true,
    message: 'Comment added',
    data: post,
  });
});

export const deletePostController = asyncHandler(async (req, res) => {
  const post = await postService.deletePost(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  await logActivity(
    req.userId,
    'delete',
    'post',
    req.params.id,
    'Deleted a post',
    req
  );

  res.json({
    success: true,
    message: 'Post deleted successfully',
  });
});
