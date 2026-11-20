import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProp } from '../navigation/types';

export default function OrdersScreen() {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>FD1 Placeholder</Text>
      <Text style={styles.title}>Đơn Hàng Của Bạn</Text>
      <Text style={styles.subtitle}>
        Quản lý đơn hàng trúng đấu giá và trạng thái thanh toán COD/VNPay.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OrderDetail', { orderId: 'demo-ord-001' })}
      >
        <Text style={styles.buttonText}>Xem thử Order Detail (demo-ord-001)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  badge: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
