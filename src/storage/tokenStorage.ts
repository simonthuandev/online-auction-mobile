import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auction_access_token';
const REFRESH_TOKEN_KEY = 'auction_refresh_token';

export interface TokenPair {
  accessToken: string | null;
  refreshToken: string | null;
}

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.warn('[tokenStorage] Error reading accessToken from SecureStore:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('[tokenStorage] Error reading refreshToken from SecureStore:', error);
      return null;
    }
  },

  async getTokens(): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
    ]);
    return { accessToken, refreshToken };
  },

  async setAccessToken(accessToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  },

  async setRefreshToken(refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  async setTokens(tokens: { accessToken: string; refreshToken: string }): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).catch(() => {}),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {}),
    ]);
  },
};

export default tokenStorage;
