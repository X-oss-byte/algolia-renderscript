import { StatsD } from 'hot-shots';

import { report } from './errorReporting';

const client = new StatsD({
  host: process.env.DOGSTATSD_HOST || 'localhost',
  port: 8125,
  prefix: process.env.DOGSTATSD_PREFIX || 'alg.crawler.',
  mock: process.env.NODE_ENV !== 'production',
  globalTags: {
    env: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  },
  errorHandler(error: Error): void {
    report(error);
  },
});

export function close(): Promise<void> {
  return new Promise((resolve, reject) => {
    client.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export const stats = client;
