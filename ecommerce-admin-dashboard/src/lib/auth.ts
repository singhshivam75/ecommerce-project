import api from './api';

type LoginPayload = { email: string; password: string };

export async function login(payload: LoginPayload) {
  const res = await api.post('/auth/login', payload);
  const data = res.data;

  if (data?.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
  }

  return data;
}

export function logout() {
  localStorage.removeItem('accessToken');
  return api.post('/auth/logout').catch(() => null);
}

export function getLocalToken() {
  return localStorage.getItem('accessToken');
}

// ✅ FIXED JWT PARSER
export function parseJwt(token: string | null) {
  if (!token) return null;

  try {
    const base64 = token.split('.')[1];
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// ✅ TOKEN EXPIRY CHECK
export function isTokenValid(token: string | null) {
  const payload = parseJwt(token);
  if (!payload) return false;

  return payload.exp * 1000 > Date.now();
}

// ✅ ADMIN CHECK
export function isAdminToken(token: string | null) {
  const payload = parseJwt(token);
  return payload?.role === 'admin';
}