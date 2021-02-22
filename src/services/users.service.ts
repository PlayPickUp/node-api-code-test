import knex from '../util/db';
import { User } from '../models/users.model';

const userCols = ['id', 'first_name', 'last_name', 'email', 'avatar'];

// Get Users
export const getUsers = async (
  id: string | number | undefined
): Promise<User | User[] | []> => {
  if (id) {
    try {
      const user: User = await knex
        .column(userCols)
        .select()
        .from('users')
        .where({ id })
        .catch((err: any) => new Error(err));
      return user;
    } catch (err) {
      console.error(err);
      return [];
    }
  } else {
    try {
      const users: User[] = await knex
        .column(userCols)
        .select()
        .from('users')
        .catch((err: any) => new Error(err));
      return users;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
};
