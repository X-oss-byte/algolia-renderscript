import { request } from 'undici';

import { wait } from './src/helpers/wait';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function setup() {
  const max = 50;
  let curr = 0;

  while (curr < max) {
    curr += 1;
    try {
      const { statusCode } = await request('http://localhost:3000/ready');
      console.log('API statusCode:', statusCode);

      if (statusCode === 200) {
        console.log('API Ready');
        break;
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      await wait(500);
    }
  }
}
