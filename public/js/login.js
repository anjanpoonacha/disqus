import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  console.log(email, password);

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'SUCCESS') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
