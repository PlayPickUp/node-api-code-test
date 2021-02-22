import { Request, Response } from 'express';

import { getUsers } from '../services/users.service';

export const users = async (req: Request, res: Response): Promise<Response> => {
  const id = req.query.id as string;
  const users = await getUsers(id);
  if (!users) {
    return res.sendStatus(500);
  }
  return res.json(users);
};
