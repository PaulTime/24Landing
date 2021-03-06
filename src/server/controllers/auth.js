import bcrypt from 'bcrypt';

import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  REDIS_SESSION_TTL,
} from 'common/config';
import User from 'server/models/user';
import redis from 'server/services/redis';
import { generateRandomToken } from 'server/helpers';

export const registration = async (request, response) => {
  try {
    const { body } = request;
    const userInDB = await User.findOne({ phone: body.phone, email: body.email }).exec();

    if (userInDB) {
      response
        .status(400)
        .json({ phone: 'not unique', email: 'not unique' });
      return;
    }

    const user = await User.create({ ...body, password: bcrypt.hashSync(body.password, 10) });

    await createSession(response, user);
  } catch (error) {
    response
      .status(500)
      .json({ error: error.toString() });
  }
};

export const login = async (request, response) => {
  try {
    const { phone, password } = request.body;
    const user = await User.findOne({ phone }).exec() || {};

    if (!user.password) {
      response
        .status(400)
        .json({ phone: 'no user that matched such phone number' });
      return;
    }

    if (bcrypt.compareSync(password, user.password)) {
      await createSession(response, user);
      return;
    }

    response
      .status(400)
      .json({ password: 'wrong password' });
  } catch (error) {
    response
      .status(500)
      .json({ error: error.toString() });
  }
};

export const refresh = async (request, response) => {
  try {
    const { [REFRESH_TOKEN_NAME]: refreshToken, _session } = request.cookies;
    const userRefreshToken = await redis.client.hget(_session, REFRESH_TOKEN_NAME);

    if (refreshToken !== userRefreshToken) {
      response
        .status(400)
        .json({ token: 'incorrect refresh token' });
      return;
    }

    await createSession(response, {}, _session);
  } catch (error) {
    response
      .status(500)
      .json({ error: error.toString() });
  }
};

export const logout = async (request, response) => {
  try {
    const { _session } = request.cookies;
    await redis.client.del(_session);

    response
      .clearCookie(ACCESS_TOKEN_NAME, { httpOnly: true, maxAge: ACCESS_TOKEN_TTL })
      .clearCookie(REFRESH_TOKEN_NAME, { httpOnly: true, maxAge: REFRESH_TOKEN_TTL })
      .clearCookie('_session', { httpOnly: true, maxAge: REDIS_SESSION_TTL })
      .sendStatus(200);
  } catch (error) {
    response
      .status(500)
      .json({ error: error.toString() });
  }
};

const createSession = async (response, data = {}, _session) => {
  const accessToken = generateRandomToken();
  const refreshToken = generateRandomToken();
  const sessionId = _session || generateRandomToken();

  await redis.client.hmset(sessionId, {
    ...data,
    [ACCESS_TOKEN_NAME]: accessToken,
    [REFRESH_TOKEN_NAME]: refreshToken,
  });
  await redis.client.pexpire(sessionId, REDIS_SESSION_TTL);

  response
    .cookie(ACCESS_TOKEN_NAME, accessToken, { httpOnly: true, maxAge: ACCESS_TOKEN_TTL })
    .cookie(REFRESH_TOKEN_NAME, refreshToken, { httpOnly: true, maxAge: REFRESH_TOKEN_TTL })
    .cookie('_session', sessionId, { httpOnly: true, maxAge: REDIS_SESSION_TTL })
    .status(200)
    .json({ [ACCESS_TOKEN_NAME]: accessToken, [REFRESH_TOKEN_NAME]: refreshToken });
};
