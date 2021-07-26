import round from 'lodash/round';

export const calculateMoneyline = (popularity: number): number => {
  // formula constructed from this source:
  // https://sportsprofit.wordpress.com/2010/06/29/how-to-convert-a-money-line-into-a-percentage-and-vice-versa/
  if (popularity > 50) {
    const moneyline = (popularity / (100 - popularity)) * -100;
    return round(moneyline);
  } else {
    const moneyline = ((100 - popularity) / popularity) * 100;
    return round(moneyline);
  }
};

export const calculatePoints = (moneyline: number): number => {
  const wager = 25;
  // if positive moneyline
  if (Math.sign(moneyline) === 1) {
    const points = wager * (moneyline / 100);
    return round(points + wager);
  } else {
    const points = wager / ((moneyline * -1) / 100);
    return round(points + wager);
  }
};
