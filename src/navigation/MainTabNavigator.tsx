import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabsParamList } from './types';
import ExploreScreen from '../screens/ExploreScreen';
import AuctionsScreen from '../screens/AuctionsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🔍';
          if (route.name === 'Explore') icon = '🔍';
          else if (route.name === 'Auctions') icon = '⚡';
          else if (route.name === 'Orders') icon = '📦';
          else if (route.name === 'Notifications') icon = '🔔';
          else if (route.name === 'Profile') icon = '👤';

          return <Text style={{ fontSize: focused ? 20 : 18 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Khám Phá',
          tabBarLabel: 'Khám Phá',
        }}
      />
      <Tab.Screen
        name="Auctions"
        component={AuctionsScreen}
        options={{
          title: 'Phòng Đấu Giá',
          tabBarLabel: 'Đấu Giá',
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Đơn Hàng',
          tabBarLabel: 'Đơn Hàng',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Thông Báo',
          tabBarLabel: 'Thông Báo',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Hồ Sơ',
          tabBarLabel: 'Cá Nhân',
        }}
      />
    </Tab.Navigator>
  );
}
