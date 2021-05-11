import isArray from 'lodash/isArray';

export const handleLeagueValue = (league: string | string[]): string => {
  if (isArray(league)) {
    return league[0];
  } else {
    const leagueArray = league.split(',');
    return leagueArray[0];
  }
};
