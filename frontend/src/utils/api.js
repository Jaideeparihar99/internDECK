const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body = null, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (body) => request('POST', '/auth/register', body),
  login: (body) => request('POST', '/auth/login', body),
  me: () => request('GET', '/auth/me'),

  // Students
  getMyProfile: () => request('GET', '/students/me'),
  updateProfile: (body) => request('PUT', '/students/me', body),
  uploadResume: (formData) => request('POST', '/students/upload-resume', formData, true),
  getStudents: (params = '') => request('GET', `/students?${params}`),
  getMentoredStudents: () => request('GET', '/students/mentored'),

  // Companies
  getCompanies: () => request('GET', '/companies'),
  getRecommended: () => request('GET', '/companies/recommended'),
  getCompanyStats: () => request('GET', '/companies/stats'),
  postCompany: (body) => request('POST', '/companies', body),
  updateCompany: (id, body) => request('PUT', `/companies/${id}`, body),
  getCompany: (id) => request('GET', `/companies/${id}`),

  // Applications
  apply: (companyId, body) => request('POST', `/applications/${companyId}`, body),
  getMyApplications: () => request('GET', '/applications/mine'),
  getPendingMentor: () => request('GET', '/applications/pending-mentor'),
  mentorDecision: (id, body) => request('PATCH', `/applications/${id}/mentor`, body),
  getAllApplications: (params = '') => request('GET', `/applications/all?${params}`),
  updateStatus: (id, body) => request('PATCH', `/applications/${id}/status`, body),

  // Interviews
  scheduleInterview: (body) => request('POST', '/interviews', body),
  getMyInterviews: () => request('GET', '/interviews/mine'),
  getAllInterviews: (params = '') => request('GET', `/interviews?${params}`),
  updateOutcome: (id, body) => request('PATCH', `/interviews/${id}/outcome`, body),

  // Feedback
  submitFeedback: (body) => request('POST', '/feedback', body),
  getFeedback: () => request('GET', '/feedback'),
  verifyCert: (code) => request('GET', `/feedback/verify/${code}`)
};
