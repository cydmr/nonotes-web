import {message} from 'antd';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const host = 'http://localhost:4000';

export const request = {
  post: async (url, data, secured) => {
    if (secured && !cookies.get('token')) return false;
    try {
      const res = await fetch(host + url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': cookies.get('token') || '',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.status === 400) result.errors.map(i => message.error(i.msg));
      else return result;
    } catch (error) {
      message.error('Some shit happened');
      console.log(error);
      // error.errors.map((i) => message.error(i.msg));
    }
  },

  get: async url => {
    if (!cookies.get('token')) return false;
    try {
      const res = await fetch(host + url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': cookies.get('token'),

          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const result = await res.json();
      return result;
    } catch (error) {
      message.error('Some shit happened');
      console.log(error);
    }
  },

  put: async (url, data) => {
    if (!cookies.get('token')) return false;
    try {
      const res = await fetch(host + url, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': cookies.get('token'),

          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === 400) result.errors.map(i => message.error(i.msg));
      else return result;
    } catch (error) {
      message.error('Some shit happened');
      console.log(error);
    }
  },

  delete: async url => {
    if (!cookies.get('token')) return false;
    try {
      const res = await fetch(host + url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': cookies.get('token'),

          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const result = await res.json();
      if (res.status === 400) result.errors.map(i => message.error(i.msg));
      else if (res.status === 500) message.error('server error');
      else return result;
    } catch (error) {
      message.error('Some shit happened');
      console.log(error);
    }
  },
};
