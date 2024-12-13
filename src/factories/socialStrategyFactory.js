import GoogleStrategy from "../strategies/googleStrategy.js";
import GithubStrategy from "../strategies/githubStrategy.js";

class SocialStrategyFactory {
    static getStrategy(provider) {
        switch (provider) {
            case "google":
                return new GoogleStrategy();
            case "github":
                return new GithubStrategy();
            default:
                throw new Error("Invalid provider");
        }
    }
}

export default SocialStrategyFactory;
