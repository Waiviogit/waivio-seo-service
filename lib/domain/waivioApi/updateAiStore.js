import axios from 'axios';
import { WAIVIO_API } from '../../constants/requestConstants.js';
import getConfig from '../../config/config.js';

const API = WAIVIO_API[process.env.NODE_ENV] || WAIVIO_API.development;

const UPDATE_URL = `${API.HOST}${API.BASE_URL}${API.SITES}${API.ASSISTANT}${API.CUSTOM}`;
const updateAiStore = async ({ host, userName }) => {
  try {
    const config = await getConfig();
    const { security } = config;
    const result = await axios.post(
      UPDATE_URL,
      { host, userName, key: security.waivioApiKey },
      {
        timeout: 20000,
      },
    );

    return { result: result?.data ?? [] };
  } catch (error) {
    return { error };
  }
};

export default updateAiStore;
