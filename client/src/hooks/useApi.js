import { useCallback, useState } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      const config = { method, url };
      if (data) config.data = data;
      const response = await axios(config);
      setLoading(false);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { request, loading, error };
};

export const useClubs = () => {
  const { request, loading, error } = useApi();

  const getClubs = useCallback(
    async (filters = {}) => {
      const params = new URLSearchParams(filters);
      return request('GET', `/api/clubs?${params}`);
    },
    [request]
  );

  const getClub = useCallback(
    async (clubId) => {
      return request('GET', `/api/clubs/${clubId}`);
    },
    [request]
  );

  const createClub = useCallback(
    async (clubData) => {
      return request('POST', '/api/clubs', clubData);
    },
    [request]
  );

  const updateClub = useCallback(
    async (clubId, clubData) => {
      return request('PUT', `/api/clubs/${clubId}`, clubData);
    },
    [request]
  );

  const joinClub = useCallback(
    async (clubId) => {
      return request('POST', `/api/clubs/${clubId}/join`);
    },
    [request]
  );

  const leaveClub = useCallback(
    async (clubId) => {
      return request('POST', `/api/clubs/${clubId}/leave`);
    },
    [request]
  );

  return {
    getClubs,
    getClub,
    createClub,
    updateClub,
    joinClub,
    leaveClub,
    loading,
    error,
  };
};

export const useEvents = () => {
  const { request, loading, error } = useApi();

  const getEvents = useCallback(
    async (filters = {}) => {
      const params = new URLSearchParams(filters);
      return request('GET', `/api/events?${params}`);
    },
    [request]
  );

  const getEvent = useCallback(
    async (eventId) => {
      return request('GET', `/api/events/${eventId}`);
    },
    [request]
  );

  const createEvent = useCallback(
    async (clubId, eventData) => {
      return request('POST', `/api/events/club/${clubId}`, eventData);
    },
    [request]
  );

  const registerEvent = useCallback(
    async (eventId, status = 'going') => {
      return request('POST', `/api/events/${eventId}/register`, { status });
    },
    [request]
  );

  return {
    getEvents,
    getEvent,
    createEvent,
    registerEvent,
    loading,
    error,
  };
};

export const usePosts = () => {
  const { request, loading, error } = useApi();

  const getClubPosts = useCallback(
    async (clubId, pagination = {}) => {
      const params = new URLSearchParams(pagination);
      return request('GET', `/api/posts/club/${clubId}/posts?${params}`);
    },
    [request]
  );

  const createPost = useCallback(
    async (clubId, postData) => {
      return request('POST', `/api/posts/club/${clubId}`, postData);
    },
    [request]
  );

  const likePost = useCallback(
    async (postId) => {
      return request('POST', `/api/posts/${postId}/like`);
    },
    [request]
  );

  const addComment = useCallback(
    async (postId, text) => {
      return request('POST', `/api/posts/${postId}/comment`, { text });
    },
    [request]
  );

  return {
    getClubPosts,
    createPost,
    likePost,
    addComment,
    loading,
    error,
  };
};
