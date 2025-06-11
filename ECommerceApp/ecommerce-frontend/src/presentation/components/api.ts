import axios from 'axios';
import { API_BASE_URL } from '../../infrastructure/services/ApiConfig';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(form: ContactForm) {
  const response = await axios.post(`${API_BASE_URL}/contact`, form);
  return response.data;
}
