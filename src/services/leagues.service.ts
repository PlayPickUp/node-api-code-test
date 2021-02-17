import {Leagues} from '../models/leagues.model';

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
