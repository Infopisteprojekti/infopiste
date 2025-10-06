import { createApp, initApp } from './app.js';
import logger from './utils/logger.js';
import { PORT } from './utils/config.js';

await initApp();
const app = createApp();

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
