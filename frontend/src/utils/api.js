const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth functions
export const login = (email, password) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = (name, email, password, role, studentId, branch, semester) => {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, studentId, branch, semester }),
  });
};

// Student functions
export const getProfile = () => {
  return request('/students/me');
};

export const updateProfile = (data) => {
  return request('/students/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const token = getToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${BASE_URL}/students/upload-resume`, {
    method: 'POST',
    headers,
    body: formData,
  }).then((res) => {
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  });
};

// Company functions
export const getCompanies = () => {
  return request('/companies');
};

export const getRecommended = () => {
  return request('/companies/recommended');
};

export const postCompany = (data) => {
  return request('/companies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPlacementStats = () => {
  return request('/companies/stats');
};

// Application functions
export const applyToCompany = (companyId) => {
  return request(`/applications/${companyId}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};

export const getApplications = () => {
  return request('/applications/mine');
};

export const getPendingApprovals = () => {
  return request('/applications/pending-mentor');
};

export const respondToApproval = (applicationId, mentorApproved, mentorNote, status) => {
  return request(`/applications/${applicationId}/mentor`, {
    method: 'PATCH',
    body: JSON.stringify({ mentorApproved, mentorNote, status }),
  });
};

// Feedback functions
export const submitFeedback = (data) => {
  return request('/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getCertificates = () => {
  return request('/feedback');
};
