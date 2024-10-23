import moment from 'moment-timezone';

export const isFromLastWeek = (dateAdded) => {
  const now = moment().tz('Australia/Sydney');
  const currentDay = now.day();
  const currentHour = now.hour();

  let startDate = now
    .clone()
    .startOf('week')
    .add(3, 'days')
    .hour(7)
    .minute(0)
    .second(0);

  if (currentDay < 3 || (currentDay === 3 && currentHour < 7)) {
    startDate.subtract(7, 'days');
  }

  const itemDate = moment(dateAdded).tz('Australia/Sydney');
  return itemDate.isBefore(startDate);
};
