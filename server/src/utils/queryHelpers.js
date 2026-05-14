export const paginate = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const filterQuery = (query, allowedFields) => {
  const filtered = {};
  allowedFields.forEach((field) => {
    if (query[field]) {
      filtered[field] = query[field];
    }
  });
  return filtered;
};

export const sortQuery = (query) => {
  if (!query.sort) return {};
  
  const sortFields = {};
  query.sort.split(',').forEach((field) => {
    if (field.startsWith('-')) {
      sortFields[field.substring(1)] = -1;
    } else {
      sortFields[field] = 1;
    }
  });
  return sortFields;
};

export const createApiResponse = (success, message, data = null, error = null) => {
  return {
    success,
    message,
    ...(data && { data }),
    ...(error && { error }),
  };
};
