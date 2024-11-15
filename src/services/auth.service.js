import User from "../models/user.js";
import { passwordCompare, passwordHash } from "./bcrypt.service.js";
import authUtility from "../utils/jwt.utility.js";
import jwt from "jsonwebtoken";
import { getSASToken } from "../utils/sas.utility.js";
import axios from "axios";
import axiosRetry from "axios-retry";
import { getUserPasswordByUsername } from "./user.service.js";

const userRegisterService = async (reqBody) => {
  const friendlyName = reqBody.friendlyName
    ? reqBody.friendlyName
    : reqBody.username;
  const userType = reqBody.userType ? reqBody.userType : "regular";

  const user = await User.create({
    username: reqBody.username,
    friendly_name: friendlyName,
    password: (await passwordHash(reqBody.password)) ?? null,
    email: reqBody.email,
    user_type: userType,
    profileImageUrl: reqBody.profileImageUrl ?? null,
  });
  user.sasToken = getSASToken();
  return user;
};

const userLoginService = async (reqBody) => {
  const user = await getUserPasswordByUsername(reqBody.username);
  if (!user) {
    return false;
  }
  if (await passwordCompare(reqBody.password, user.password)) {
    user.sasToken = getSASToken();
    return user;
  }
};

const tokenRefreshService = (reqBody) => {
  const refreshToken = reqBody["refreshToken"].split(" ")[1];
  if (!refreshToken) {
    return undefined;
  }
  try {
    return authUtility.createAccessToken(
      jwt.verify(refreshToken, process.env.SECRETKEY).userId
    );
  } catch (error) {
    return undefined;
  }
};

const googleAuthService = async (credentials) => {
  try {
    axiosRetry(axios, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    });

    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
        },
      }
    );

    return userInfoResponse;
  } catch (error) {
    console.log(error);
    return;
  }
};

const githubAuthService = async (code) => {
  try {
    axiosRetry(axios, {
      retries: 1,
      retryDelay: axiosRetry.exponentialDelay,
    });

    const userInfoResponse = await axios.get(
      "https://github.com/login/oauth/access_token",
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: `http://127.0.0.1:8000/oauth/callback`,
        },
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "application/json",
        },
      }
    );

    const accessToken = userInfoResponse.data.access_token;
    if (!accessToken) {
      throw new Error("Failed to obtain access token");
    }

    const userProfileResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return {
      access_token: userInfoResponse.data.access_token,
      profilePicture: userProfileResponse.data.avatar_url,
      name: userProfileResponse.data.name,
      email: emailResponse.data[0].email,
    };
  } catch (error) {
    console.log(error);
    return;
  }
};

export {
  userRegisterService,
  userLoginService,
  tokenRefreshService,
  googleAuthService,
  githubAuthService,
};
