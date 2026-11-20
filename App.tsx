import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/store';
import { queryClient } from './src/lib/queryClient';
import { linking } from './src/navigation/linking';
import RootNavigator from './src/navigation/RootNavigator';
import { setupSocketAutoReconnect, connectSockets, disconnectSockets } from './src/lib/socket';

export default function App() {
  useEffect(() => {
    // 1. Setup listeners for AppState (background -> active) and NetInfo (offline -> online)
    const cleanupSockets = setupSocketAutoReconnect(queryClient);

    // 2. Connect sockets if token exists
    connectSockets().catch((err) => {
      console.warn('[App] Initial socket connection error:', err);
    });

    return () => {
      cleanupSockets();
      disconnectSockets();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer linking={linking}>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </QueryClientProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
