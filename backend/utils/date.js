import dayjs from 'dayjs';

export const getSecondsUntilTomorrow = () => {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  return Math.round((tomorrow - now) / 1000);
};

export const excelDateToDayjs = serial => {
  return dayjs('1899-12-30').add(serial, 'day');
};
