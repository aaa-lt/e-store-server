import SocialProviderStrategy from "./socialProviderStrategy.js";
import { OAuth2Client } from "google-auth-library";
import "dotenv/config";
import axios from "axios";
import axiosRetry from "axios-retry";

const redirectURL = process.env.REDIRECT_URI;
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectURL
);

class GoogleStrategy extends SocialProviderStrategy {
    getAuthorizationUrl() {
        return client.generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
            prompt: "consent",
            state: JSON.stringify({ provider: "google" }),
        });
    }

    async getUserInfo(code) {
        const { tokens } = await client.getToken(code);

        axiosRetry(axios, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
        });

        const { data: response } = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`,
                },
            }
        );

        return {
            email: response.email,
            name: response.name,
            picture: response.profilePicture,
        };
    }
}

export default GoogleStrategy;
