import app from './app.ts';
import config from './config.ts';

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
