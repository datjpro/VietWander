import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(
    `VietWander backend listening on http://localhost:${env.port} (db: ${app.locals.repository.mode})`
  );
});
