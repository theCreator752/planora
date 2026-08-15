import { api, setTokens, clearTokens, setStoredUser, clearStoredUser } from './client.js';

export async function signup({ name, email, password }) {
  const data = await api.post('/auth/signup', { name, email, password }, { auth: false });
  setTokens(data);
  setStoredUser(data.user);
  return data.user;
}

export async function login({ email, password }) {
  const data = await api.post('/auth/login', { email, password }, { auth: false });
  setTokens(data);
  setStoredUser(data.user);
  return data.user;
}

export async function logout(refreshToken) {
  try {
    await api.post('/auth/logout', { refreshToken }, { auth: false });
  } finally {
    clearTokens();
    clearStoredUser();
  }
}

export function forgotPassword(email) {
  return api.post('/auth/forgot-password', { email }, { auth: false });
}

export function resetPassword({ token, newPassword }) {
  return api.post('/auth/reset-password', { token, newPassword }, { auth: false });
}
