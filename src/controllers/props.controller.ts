import { Request, Response } from 'express';
import { getProps } from '../services/props.service';

export const props = async (
  req: Request,
  res: Response
): Promise<Response<any> | void> => {
  // add any  controller work here - below is just placeholder - you may or may not need to adjust this function
  const payload = await getProps();
  res.json(payload);
};
