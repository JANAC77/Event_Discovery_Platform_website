const API_BASE_URL = 'http://localhost:5000/api/events';
const UPLOAD_API_URL = 'http://localhost:5000/api/upload';

export const fetchEvents = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.q) queryParams.append('q', filters.q);
  if (filters.category && filters.category !== 'ALL') queryParams.append('category', filters.category);
  if (filters.industry && filters.industry !== 'ALL') queryParams.append('industry', filters.industry);
  if (filters.status && filters.status !== 'ALL') queryParams.append('status', filters.status);

  const url = `${API_BASE_URL}?${queryParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch events');
  }
  return data;
};

export const fetchEventById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch event details');
  }
  return data;
};

export const createEvent = async (eventData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || (data.errors ? data.errors.map(e => e.msg).join(', ') : 'Failed to create event'));
  }
  return data;
};

export const updateEvent = async (id, eventData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || (data.errors ? data.errors.map(e => e.msg).join(', ') : 'Failed to update event'));
  }
  return data;
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete event');
  }
  return data;
};

export const seedDatabase = async () => {
  const response = await fetch(`${API_BASE_URL}/seed`, {
    method: 'POST',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to seed database');
  }
  return data;
};

// Upload Event Image File to Backend
export const uploadEventImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(UPLOAD_API_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload image file');
  }
  return data;
};
