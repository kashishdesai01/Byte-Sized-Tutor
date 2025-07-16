export const API_URL = 'http://127.0.0.1:8000';

export const getAuthHeaders = (token, isJson = true) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    if (isJson) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};