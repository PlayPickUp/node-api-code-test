import { Request, Response } from 'express';
import {createNewEvent} from "../services/events.service";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body } = req;
  try {
    if (!req.body.name) {
      return res.status(400).json({"Error": "Events must have a name"})
    }
    await createNewEvent(body)
    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).send(err);
  }
};
