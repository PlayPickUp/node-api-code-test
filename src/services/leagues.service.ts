import { Leagues } from '../models/leagues.model';
import knex from '../util/db';

export const getLeagues = (): Leagues => {
  const leagues: Leagues = [
    {
      value: 'boxing',
      label: 'Boxing',
    },
    {
      value: 'ncaab',
      label: 'NCAAB',
    },
    {
      value: 'ncaaf',
      label: 'NCAAF',
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
    {
      value: 'horse-racing',
      label: 'Horse Racing',
    },
    {
      value: 'olympics',
      label: 'Olympics',
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
