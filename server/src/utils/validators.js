export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validatePhoneNumber = (phone) => {
  const regex = /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return regex.test(phone);
};

export const sanitizeUserData = (user) => {
  const raw = user._doc || user.toObject?.() || user;
  const sanitized = {
    ...raw,
    joinedClubs: Array.isArray(raw.joinedClubs) ? raw.joinedClubs.filter(Boolean) : raw.joinedClubs,
    managedClubs: Array.isArray(raw.managedClubs) ? raw.managedClubs.filter(Boolean) : raw.managedClubs,
    registeredEvents: Array.isArray(raw.registeredEvents) ? raw.registeredEvents.filter(Boolean) : raw.registeredEvents,
  };

  const { password, verificationToken, __v, ...rest } = sanitized;
  return rest;
};
