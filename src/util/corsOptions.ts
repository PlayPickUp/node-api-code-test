import { CorsOptions } from 'cors';
import {
  corsWhitelistDev,
  corsWhitelistProd,
  publicWhiteList,
} from '../constants/corsWhitelist';

const { NODE_ENV } = process.env;

export const publicCorsConfig: CorsOptions = {
  origin: publicWhiteList,
  optionsSuccessStatus: 200,
  credentials: true,
};

export const privateCorsConfig: CorsOptions = {
  origin: NODE_ENV !== 'production' ? corsWhitelistDev : corsWhitelistProd,
  optionsSuccessStatus: 200,
  credentials: true,
};
