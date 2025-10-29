const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params);
  }
};

const graph = what => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`ms graph: ${what}`);
  }
};

export default { info, error, graph };
