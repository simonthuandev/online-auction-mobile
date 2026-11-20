import { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['auctionapp://', 'http://auctionapp', 'https://auctionapp'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Explore: 'explore',
          Auctions: 'auctions',
          Orders: 'orders',
          Notifications: 'notifications',
          Profile: 'profile',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      ProductDetail: 'products/:productId',
      AuctionRoom: 'auctions/:auctionId',
      OrderDetail: 'orders/:orderId',
      PaymentReturn: 'payment-return',
    },
  },
};

export default linking;
