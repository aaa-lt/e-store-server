import SocialProviderStrategy from "./socialProviderStrategy.js";
import "dotenv/config";
import axios from "axios";
import axiosRetry from "axios-retry";

class GithubStrategy extends SocialProviderStrategy {
    getAuthorizationUrl() {
        const client_id = process.env.GITHUB_CLIENT_ID;
        const redirect_uri = process.env.REDIRECT_URI;
        const state = JSON.stringify({ provider: "github" });
        return `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&scope=user:email%20read:user&redirect_uri=${redirect_uri}&state=${state}`;
    }

    async getUserInfo(code) {
        axiosRetry(axios, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
        });

        const {
            data: { access_token },
        } = await axios.get("https://github.com/login/oauth/access_token", {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
            },
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "application/json",
            },
        });

        const [profileResponse, emailResponse] = await Promise.all([
            axios.get("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }),
            axios.get("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }),
        ]);

        return {
            email: emailResponse.data[0].email,
            name: profileResponse.data.name,
            profilePicture: profileResponse.data.avatar_url,
        };
    }
}

export default GithubStrategy;
