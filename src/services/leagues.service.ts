import { Leagues } from '../models/leagues.model';
import knex from '../util/db';

export const getLeagues = (): Leagues => {
  const leagues: Leagues = [
    {
      value: 'boxing',
      label: 'Boxing',
    },
    {
      value: 'cbb',
      label: 'CBB',
    },
    {
      value: 'cfb',
      label: 'CFB',
    },
    {
      value: 'mlb',
      label: 'MLB',
    },
    {
      value: 'mma',
      label: 'MMA',
    },
    {
      value: 'nba',
      label: 'NBA',
    },
    {
      value: 'nfl',
      label: 'NFL',
    },
    {
      value: 'nhl',
      label: 'NHL',
    },
    {
      value: 'pll',
      label: 'PLL',
    },
    {
      value: 'soccer',
      label: 'Soccer',
    },
    {
      value: 'golf',
      label: 'Golf',
    },
    {
      value: 'tennis',
      label: 'Tennis',
    },
    {
      value: 'wrestling',
      label: 'Wrestling',
    },
  ];
  return leagues;
};

export const getLeaguePostCount = async (
  league: string
): Promise<Array<{ count: string }>> => {
  const count = await knex('posts')
    .where(knex.raw(`league->>'leagues' like ?`, [league]))
    .andWhere({ deleted_at: null })
    .count()
    .catch((err: string) => {
      throw new Error(err);
    });
  return count;
};
