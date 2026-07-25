import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// 🔥 DEBUG (VERY IMPORTANT)
console.log("API BASE URL:", api.defaults.baseURL);
console.log("SENDING REQUEST TO:", api.defaults.baseURL);

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
  try {
    const response = await api.post('/register', body);

    console.log("REGISTER SUCCESS:", response.data); // ✅ debug

    return response.data; // ✅ important
  } catch (err) {
    console.log("REGISTER ERROR FULL:", err); // 👈 full error
    console.log("REGISTER ERROR DATA:", err.response?.data);

    // 👇 IMPORTANT: return proper message
    throw err.response?.data || { message: "Registration failed" };
  }
}

export async function login(body) {
  try {
    console.log("LOGIN REQUEST:", body); // DEBUG
    const { data } = await api.post('/login', body);
    return data;
  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);
    throw err;
  }
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

export async function sendChatMessage(history, message) {
  const { data } = await api.post('/chat', { history, message });
  return data;
}

export default api;