import { CronJob } from 'cron';

const checkClosingProps = new CronJob(
  '* * * * * *',
  () => {
    console.log('Every second!');
  },
  null,
  true,
  'America/Los_Angeles'
);

export default checkClosingProps;
