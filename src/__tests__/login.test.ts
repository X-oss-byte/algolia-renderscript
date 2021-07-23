import type { Protocol } from 'puppeteer-core/lib/esm/puppeteer/api-docs-entry';

import { sendLoginRequest } from './helpers';

it('should error when no username', async () => {
  const { res, body } = await sendLoginRequest({
    url: 'http://localhost:3000/secure/login',
    username: '',
    password: 'password',
  });

  expect(res.statusCode).toEqual(400);

  expect(JSON.parse(body)).toEqual({
    details: [
      {
        label: 'username',
        message: 'username is required',
        type: 'required',
      },
    ],
    error: true,
    message: 'Bad Request',
  });
});

it('should error when no password', async () => {
  const { res, body } = await sendLoginRequest({
    url: 'http://localhost:3000/secure/login',
    username: 'admin',
    password: '',
  });

  expect(res.statusCode).toEqual(400);

  expect(JSON.parse(body)).toEqual({
    details: [
      {
        label: 'password',
        message: 'password is required',
        type: 'required',
      },
    ],
    error: true,
    message: 'Bad Request',
  });
});

it('should works with correct credentials', async () => {
  const { res, body } = await sendLoginRequest({
    url: 'http://localhost:3000/secure/login',
    username: 'admin',
    password: 'password',
  });

  expect(res.statusCode).toEqual(200);

  const cookies = JSON.parse(body).cookies;
  expect(
    cookies.find(
      (cookie: Protocol.Network.Cookie) => cookie.name === 'sessionToken'
    )
  ).toMatchSnapshot();
  // Check that we actually went through the form
  expect(
    cookies.find((cookie: Protocol.Network.Cookie) => cookie.name === '_csrf')
  ).not.toBeUndefined();
});

it('should works even with a 2-steps login', async () => {
  const { res, body } = await sendLoginRequest({
    url: 'http://localhost:3000/secure/login/step1',
    username: 'admin',
    password: 'password',
  });

  expect(res.statusCode).toEqual(200);

  const cookies = JSON.parse(body).cookies;
  expect(
    cookies.find(
      (cookie: Protocol.Network.Cookie) => cookie.name === 'sessionToken'
    )
  ).toMatchSnapshot();
  // Check that we actually went through the form
  expect(
    cookies.find((cookie: Protocol.Network.Cookie) => cookie.name === '_csrf')
  ).not.toBeUndefined();
});

it('should works with a 2-steps JS login', async () => {
  const { res, body } = await sendLoginRequest({
    url: 'http://localhost:3000/secure/login/2steps',
    username: 'admin',
    password: 'password',
  });

  expect(res.statusCode).toEqual(200);

  const cookies = JSON.parse(body).cookies;
  expect(
    cookies.find(
      (cookie: Protocol.Network.Cookie) => cookie.name === 'sessionToken'
    )
  ).toMatchSnapshot();
  // Check that we actually went through the form
  expect(
    cookies.find((cookie: Protocol.Network.Cookie) => cookie.name === '_csrf')
  ).not.toBeUndefined();
});

it('should works but not get a session token with bad credentials', async () => {
  const { res, body } = await sendLoginRequest({
    url: 'http://localhost:3000/secure/login',
    username: 'admin',
    password: 'admin',
  });

  expect(res.statusCode).toEqual(200);

  const cookies = JSON.parse(body).cookies;
  expect(
    cookies.find(
      (cookie: Protocol.Network.Cookie) => cookie.name === 'sessionToken'
    )
  ).toBeUndefined();
  // Check that we actually went through the form
  expect(
    cookies.find((cookie: Protocol.Network.Cookie) => cookie.name === '_csrf')
  ).not.toBeUndefined();
});