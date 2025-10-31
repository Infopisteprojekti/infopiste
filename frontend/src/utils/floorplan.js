import roomStatus from '@/constants/roomStatus';

export const checkActive = reservation => {
  if (reservation.start.timeZone !== 'UTC') {
    console.warn('Reservation timezone not in UTC');
  }
  const now = new Date();
  const start = new Date(reservation.start.dateTime + 'Z');
  const end = new Date(reservation.end.dateTime + 'Z');
  return start < now && end > now;
};

export const addStatusToChild = (child, status) => {
  child.classList.remove(...Object.values(roomStatus));
  child.classList.add(status);
};

export const waitForPaint = () => {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
};
