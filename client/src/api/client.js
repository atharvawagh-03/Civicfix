import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('civicfix_token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('civicfix_token');
  }
}

const saved = localStorage.getItem('civicfix_token');
if (saved) setAuthToken(saved);

export async function register(body) {
  const { data } = await api.post('/register', body);
  return data;
}

export async function login(body) {
  const { data } = await api.post('/login', body);
  return data;
}

export async function fetchIssues(params) {
  const { data } = await api.get('/issues', { params });
  return data;
}

export async function fetchIssue(id) {
  const { data } = await api.get(`/issue/${id}`);
  return data;
}

export async function createIssue(formData) {
  const { data } = await api.post('/issue', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateIssue(id, body) {
  const { data } = await api.put(`/issue/${id}`, body);
  return data;
}

export async function deleteIssue(id) {
  const { data } = await api.delete(`/issue/${id}`);
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get('/analytics');
  return data;
}

export default api;
