import Post from '../models/Post.js';

export const postService = {
  async createPost(postData, authorId, clubId) {
    const post = new Post({
      ...postData,
      author: authorId,
      club: clubId,
    });

    return await post.save();
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
