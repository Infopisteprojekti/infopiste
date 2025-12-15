import { getTimestamp } from './date.js';

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${getTimestamp()}]`, ...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[${getTimestamp()}]`, ...params);
  }
};

const graph = what => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${getTimestamp()}] ms graph: ${what}`);
  }
};

export default { info, error, graph };
