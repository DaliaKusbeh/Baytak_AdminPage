import Cookies from 'js-cookie';

let authToken = null;
let adminId = null;

export const setAuthToken = (token) => {
  authToken = token;
  Cookies.set('authToken', token, { expires: 20 });
};


export const getAuthToken = () => {
  if (!authToken) {
    authToken = Cookies.get('authToken');
  }
  return authToken;
};

export const getAdminId = () => {
  if (!adminId) {
    adminId = Cookies.get('adminId');
  }
  return adminId;
};

export const clearAuthData = () => {
  authToken = null;
  adminId = null;
  Cookies.remove('authToken');
  Cookies.remove('adminId');
};
// في ملف "auth.js"

export const setAdminId = (id) => {
  adminId = id;
  Cookies.set('adminId', id, { expires: 20 });
};
