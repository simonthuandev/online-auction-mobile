import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';

export default function AuctionRoomScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'AuctionRoom'>>();
  const auctionId = route.params?.auctionId;

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>FD1 Placeholder</Text>
      <Text style={styles.title}>Phòng Đấu Giá Realtime</Text>
      <Text style={styles.paramText}>Auction ID: {auctionId || 'N/A'}</Text>
      <Text style={styles.subtitle}>
        Cập nhật bước giá thời gian thực qua socket: auction:bid_updated, auction:status_changed.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  paramText: {
    fontSize: 15,
    fontFamily: 'monospace',
    color: '#D97706',
    marginBottom: 12,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});
