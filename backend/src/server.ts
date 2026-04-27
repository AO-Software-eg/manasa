import app from './app.ts';
import config from './config.ts';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});


app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
