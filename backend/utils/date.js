import dayjs from 'dayjs';
import { MAX_PDF_DAYS } from './config.js';

export const getTimestamp = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
};

export const getSecondsUntilTomorrow = () => {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  return Math.round((tomorrow - now) / 1000);
};

export const excelDateToDayjs = (serial, endOfDay) => {
  let date = dayjs('1899-12-30').add(serial, 'day');
  if (endOfDay) {
    date = date.endOf('day');
  }
  return date;
};

export const isValidSubmissionDateRange = (startISO, endISO) => {
  if (!startISO || !endISO) return false;

  const start = dayjs(startISO);
  const end = dayjs(endISO);

  const diffDays = end.diff(start, 'day');

  return diffDays >= 0 && diffDays <= MAX_PDF_DAYS;
};
