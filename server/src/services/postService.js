import Post from '../models/Post.js';
import Club from '../models/Club.js';
import mongoose from 'mongoose';

export const postService = {
  async createPost(postData, authorId, clubId) {
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      const error = new Error('Invalid club id');
      error.status = 400;
      throw error;
    }

    const content = postData.content?.trim();
    if (!content) {
      const error = new Error('Post content is required');
      error.status = 400;
      throw error;
    }

    const club = await Club.findOne({ _id: clubId, isActive: true });
    if (!club) {
      const error = new Error('Club not found');
      error.status = 404;
      throw error;
    }

    const post = new Post({
      ...postData,
      content,
      author: authorId,
      club: clubId,
    });

    await post.save();

    return await post.populate([
      { path: 'author', select: 'firstName lastName profileImage' },
      { path: 'club', select: 'name' },
    ]);
  },

  async getPostById(postId) {
    return await Post.findById(postId)
      .populate('author', 'firstName lastName profileImage email')
      .populate('club', 'name')
      .populate('likes.user', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage');
  },

  async updatePost(postId, updateData) {
    const allowedUpdates = ['content', 'images', 'visibility', 'isPinned'];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    return await Post.findByIdAndUpdate(postId, updates, { new: true });
  },

  async getClubPosts(clubId, pagination) {
    const posts = await Post.find({ club: clubId })
      .populate('author', 'firstName lastName profileImage')
      .populate('comments.user', 'firstName lastName profileImage')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(pagination.limit)
      .skip(pagination.skip);

    const total = await Post.countDocuments({ club: clubId });

    return {
      posts,
      total,
      pages: Math.ceil(total / pagination.limit),
    };
  },

  async likePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    const likeIndex = post.likes.findIndex((l) => l.user.toString() === userId);

    if (likeIndex >= 0) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({ user: userId });
    }

    return await post.save();
  },

  async addComment(postId, userId, text) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    post.comments.push({ user: userId, text });
    return await post.save();
  },

  async deletePost(postId) {
    return await Post.findByIdAndDelete(postId);
  },
};
