import { AppState, AppStateStatus } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { io, Socket } from 'socket.io-client';
import { tokenStorage } from '../storage/tokenStorage';
import { onTokenRefreshed, onUnauthorized } from '../api/client';
import { queryClient as defaultQueryClient } from './queryClient';
import type { QueryClient } from '@tanstack/react-query';

export const SOCKET_AUCTION_URL =
  process.env.EXPO_PUBLIC_SOCKET_AUCTION_URL || 'http://localhost:3003/auctions';

export const SOCKET_NOTIF_URL =
  process.env.EXPO_PUBLIC_SOCKET_NOTIF_URL || 'http://localhost:3006/notifications';

// 2 Singleton sockets matching contracts/socket.json
export const auctionSocket: Socket = io(SOCKET_AUCTION_URL, {
  transports: ['websocket'],
  path: '/socket.io',
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const notifSocket: Socket = io(SOCKET_NOTIF_URL, {
  transports: ['websocket'],
  path: '/socket.io',
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

/**
 * Connect both sockets using current accessToken stored in SecureStore
 */
export async function connectSockets(): Promise<void> {
  const token = await tokenStorage.getAccessToken();

  if (token) {
    auctionSocket.auth = { token };
    notifSocket.auth = { token };
  } else {
    auctionSocket.auth = {};
    notifSocket.auth = {};
  }

  if (!auctionSocket.connected) {
    auctionSocket.connect();
  }
  if (!notifSocket.connected) {
    notifSocket.connect();
  }
}

/**
 * Disconnect both sockets
 */
export function disconnectSockets(): void {
  auctionSocket.disconnect();
  notifSocket.disconnect();
}

/**
 * Reconnect both sockets with updated token and sync queries
 */
export async function reconnectSockets(qc?: QueryClient): Promise<void> {
  const targetClient = qc || defaultQueryClient;
  disconnectSockets();
  await connectSockets();
  targetClient.invalidateQueries();
}

/**
 * Sets up listeners for AppState (background -> active) and NetInfo (offline -> online),
 * and handles token refresh/logout socket synchronization.
 */
export function setupSocketAutoReconnect(qc: QueryClient = defaultQueryClient): () => void {
  let currentAppState: string = AppState.currentState || 'active';
  let isWasOffline = false;

  // 1. Listen for AppState changes
  const appStateSubscription = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
    const isReturningToActive =
      (currentAppState === 'background' || currentAppState === 'inactive') &&
      nextState === 'active';

    currentAppState = nextState;

    if (isReturningToActive) {
      console.log('[socket] App entered foreground, reconnecting sockets and invalidating queries...');
      await reconnectSockets(qc);
    }
  });

  // 2. Listen for Network status changes
  const netInfoUnsubscribe = NetInfo.addEventListener(async (state: NetInfoState) => {
    const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);

    if (!isOnline) {
      isWasOffline = true;
    } else if (isWasOffline) {
      isWasOffline = false;
      console.log('[socket] Network recovered, reconnecting sockets and invalidating queries...');
      await reconnectSockets(qc);
    }
  });

  // 3. Listen for token refresh event from Axios client
  const unsubscribeTokenRefreshed = onTokenRefreshed((newToken: string) => {
    auctionSocket.auth = { token: newToken };
    notifSocket.auth = { token: newToken };

    if (auctionSocket.connected) {
      auctionSocket.disconnect().connect();
    }
    if (notifSocket.connected) {
      notifSocket.disconnect().connect();
    }
  });

  // 4. Listen for unauthorized / forced logout
  const unsubscribeUnauthorized = onUnauthorized(() => {
    disconnectSockets();
    qc.clear();
  });

  // Return comprehensive cleanup function
  return () => {
    appStateSubscription.remove();
    netInfoUnsubscribe();
    unsubscribeTokenRefreshed();
    unsubscribeUnauthorized();
  };
}
