class SocialProviderStrategy {
    async getAuthorizationUrl() {
        throw new Error("Method 'getAuthorizationUrl()' must be implemented.");
    }
    async getUserInfo(code) {
        throw new Error("Method 'getUserInfo()' must be implemented.");
    }
}

export default SocialProviderStrategy;
