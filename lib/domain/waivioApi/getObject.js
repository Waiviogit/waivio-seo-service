import axios from 'axios';
import { WAIVIO_API } from '../../constants/requestConstants.js';

const API = WAIVIO_API[process.env.NODE_ENV] || WAIVIO_API.development;

const OBJECT_URL = `${API.HOST}${API.BASE_URL}${API.WOBJECT}`;
const getObject = async ({ authorPermlink }) => {
  try {
    const result = await axios.get(`${OBJECT_URL}/${authorPermlink}`, { timeout: 5000 });

    return { result: result?.data };
  } catch (error) {
    return { error };
  }
};

export default getObject;
