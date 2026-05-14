import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  register: async (firstName, lastName, email, password) => {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get(`${API_BASE}/auth/profile`);
    return response.data;
  },

  updateProfile: async (updateData) => {
    const response = await axios.put(`${API_BASE}/auth/profile`, updateData);
    return response.data;
  },
};

export const clubService = {
  getClubs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_BASE}/clubs?${params}`);
    return response.data;
  },

  getClub: async (clubId) => {
    const response = await axios.get(`${API_BASE}/clubs/${clubId}`);
    return response.data;
  },

  createClub: async (clubData) => {
    const response = await axios.post(`${API_BASE}/clubs`, clubData);
    return response.data;
  },

  updateClub: async (clubId, clubData) => {
    const response = await axios.put(`${API_BASE}/clubs/${clubId}`, clubData);
    return response.data;
  },

  joinClub: async (clubId) => {
    const response = await axios.post(`${API_BASE}/clubs/${clubId}/join`);
    return response.data;
  },

  leaveClub: async (clubId) => {
    const response = await axios.post(`${API_BASE}/clubs/${clubId}/leave`);
    return response.data;
  },
};

export const eventService = {
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_BASE}/events?${params}`);
    return response.data;
  },

  getEvent: async (eventId) => {
    const response = await axios.get(`${API_BASE}/events/${eventId}`);
    return response.data;
  },

  createEvent: async (clubId, eventData) => {
    const response = await axios.post(`${API_BASE}/events/club/${clubId}`, eventData);
    return response.data;
  },

  registerEvent: async (eventId, status = 'going') => {
    const response = await axios.post(`${API_BASE}/events/${eventId}/register`, {
      status,
    });
    return response.data;
  },
};

export const postService = {
  getClubPosts: async (clubId, pagination = {}) => {
    const params = new URLSearchParams(pagination);
    const response = await axios.get(
      `${API_BASE}/posts/club/${clubId}/posts?${params}`
    );
    return response.data;
  },

  createPost: async (clubId, postData) => {
    const response = await axios.post(`${API_BASE}/posts/club/${clubId}`, postData);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await axios.post(`${API_BASE}/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId, text) => {
    const response = await axios.post(`${API_BASE}/posts/${postId}/comment`, {
      text,
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await axios.delete(`${API_BASE}/posts/${postId}`);
    return response.data;
  },
};

export const messageService = {
  sendMessage: async (messageData) => {
    const response = await axios.post(`${API_BASE}/messages`, messageData);
    return response.data;
  },

  getDirectMessages: async (otherId, pagination = {}) => {
    const params = new URLSearchParams(pagination);
    const response = await axios.get(`${API_BASE}/messages/direct/${otherId}?${params}`);
    return response.data;
  },

  getClubMessages: async (clubId, pagination = {}) => {
    const params = new URLSearchParams(pagination);
    const response = await axios.get(`${API_BASE}/messages/club/${clubId}?${params}`);
    return response.data;
  },

  markAsRead: async (messageIds) => {
    const response = await axios.put(`${API_BASE}/messages/mark-read`, { messageIds });
    return response.data;
  },
};
