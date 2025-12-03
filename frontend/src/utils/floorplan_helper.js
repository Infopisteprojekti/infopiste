const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // 3 seconds

export const fetchWithRetry = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(fn, retries - 1);
    }
    throw err;
  }
};
