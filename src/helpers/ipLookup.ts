import axios from 'axios';
import { IPInfoPayload } from '../types';
import { pickupErrorHandler } from './errorHandler';

const { IPINFO_TOKEN } = process.env;

const ipLookup = async (ip: string): Promise<IPInfoPayload | void> => {
  try {
    const response = await axios
      .get<IPInfoPayload>(`https://ipinfo.io/${ip}`, {
        params: { token: IPINFO_TOKEN },
      })
      .catch((err: Error) => {
        throw err;
      });
    if (!response || !response.data) {
      throw new Error('[ipLookup]: Could not get response from IPInfo');
    }
    return response.data;
  } catch (err) {
    pickupErrorHandler(err);
  }
};

export default ipLookup;
