import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabsParamList = {
  Explore: undefined;
  Auctions: undefined;
  Orders: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  ProductDetail: { productId: string };
  AuctionRoom: { auctionId: string };
  OrderDetail: { orderId: string };
  PaymentReturn?: { status?: string; orderId?: string; vnp_ResponseCode?: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabsScreenProps<T extends keyof MainTabsParamList> = BottomTabScreenProps<
  MainTabsParamList,
  T
>;

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
