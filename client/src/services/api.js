import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a central axios instance
export const api = axios.create({
  baseURL: API_BASE,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const isAuthProfileRequest = requestUrl.includes('/auth/profile') || requestUrl.includes('/auth/me');

    if (status === 401 && isAuthProfileRequest) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('authLogout'));
      // Optional: window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: async (firstName, lastName, email, password) => {
    const response = await api.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (updateData) => {
    const response = await api.put('/auth/profile', updateData);
    return response.data;
  },
};

export const clubService = {
  getClubs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/clubs?${params}`);
    return response.data;
  },

  getClub: async (clubId) => {
    const response = await api.get(`/clubs/${clubId}`);
    return response.data;
  },

  getClubDetails: async (clubId) => {
    const response = await api.get(`/clubs/${clubId}`);
    return response.data;
  },

  createClub: async (clubData) => {
    const response = await api.post('/clubs', clubData);
    return response.data;
  },

  updateClub: async (clubId, clubData) => {
    const response = await api.put(`/clubs/${clubId}`, clubData);
    return response.data;
  },

  joinClub: async (clubId) => {
    const response = await api.post(`/clubs/${clubId}/join`);
    return response.data;
  },

  leaveClub: async (clubId) => {
    const response = await api.post(`/clubs/${clubId}/leave`);
    return response.data;
  },
};

export const eventService = {
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/events?${params}`);
    return response.data;
  },

  getEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  createEvent: async (clubId, eventData) => {
    const response = await api.post(`/events/club/${clubId}`, eventData);
    return response.data;
  },

  registerEvent: async (eventId, status = 'going') => {
    const response = await api.post(`/events/${eventId}/register`, {
      status,
    });
    return response.data;
  },

  cancelEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/cancel`);
    return response.data;
  },
};

export const postService = {
  getClubPosts: async (clubId, pagination = {}) => {
    const params = new URLSearchParams(pagination);
    const response = await api.get(
      `/posts/club/${clubId}/posts?${params}`
    );
    return response.data;
  },

  createPost: async (payloadOrClubId, maybePostData = {}) => {
    const payload =
      payloadOrClubId && typeof payloadOrClubId === 'object'
        ? payloadOrClubId
        : { ...maybePostData, clubId: payloadOrClubId };
    const { clubId, content, ...postData } = payload;
    if (!clubId) {
      throw new Error('clubId is required to create a post');
    }

    const response = await api.post(`/posts/club/${clubId}`, {
      ...postData,
      content,
    });
    return response.data;
  },

  createClubPost: async (clubId, postData) => {
    const response = await api.post(`/posts/club/${clubId}`, postData);
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId, text) => {
    const response = await api.post(`/posts/${postId}/comment`, {
      text,
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
};

export const messageService = {
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  getDirectMessages: async (otherId, pagination = {}) => {
    const params = new URLSearchParams(pagination);
    const response = await api.get(`/messages/direct/${otherId}?${params}`);
    return response.data;
  },

  getClubMessages: async (clubId, pagination = {}) => {
    const params = new URLSearchParams(pagination);
    const response = await api.get(`/messages/club/${clubId}?${params}`);
    return response.data;
  },

  markAsRead: async (messageIds) => {
    const response = await api.put('/messages/mark-read', { messageIds });
    return response.data;
  },
};

export const chatService = {
  getUnreadCount: async () => {
    const response = await api.get('/chat/unread-count');
    return response.data;
  },
};

export default api;
