import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AuctionRoomScreen from '../screens/AuctionRoomScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import PaymentReturnScreen from '../screens/PaymentReturnScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: '#0F172A',
        headerBackTitle: 'Quay lại',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Chi Tiết Sản Phẩm' }}
      />
      <Stack.Screen
        name="AuctionRoom"
        component={AuctionRoomScreen}
        options={{ title: 'Phòng Đấu Giá' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Chi Tiết Đơn Hàng' }}
      />
      <Stack.Screen
        name="PaymentReturn"
        component={PaymentReturnScreen}
        options={{ title: 'Kết Quả Thanh Toán' }}
      />
    </Stack.Navigator>
  );
}
