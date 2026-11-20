import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const productId = route.params?.productId;

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>FD1 Placeholder</Text>
      <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>
      <Text style={styles.paramText}>Product ID: {productId || 'N/A'}</Text>
      <Text style={styles.subtitle}>
        Xem thông tin chi tiết, hình ảnh và lịch sử phiên đấu giá của sản phẩm.
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
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
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
    color: '#2563EB',
    marginBottom: 12,
    backgroundColor: '#EFF6FF',
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
