import moment from 'moment-timezone';

export const epochNow = moment().tz('America/New_York').format('X');
export const epochNowPlus48 = moment()
  .tz('America/New_York')
  .add(48, 'hours')
  .format('X'); // 48 hours out
