import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, AppNavigationProp } from '../navigation/types';

export default function PaymentReturnScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'PaymentReturn'>>();
  const navigation = useNavigation<AppNavigationProp>();
  const params = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>VNPay Deep Link</Text>
      <Text style={styles.title}>Kết Quả Thanh Toán</Text>
      <Text style={styles.subtitle}>
        Màn hình hứng callback từ VNPay Gateway (auctionapp://payment-return)
      </Text>

      {params?.orderId && (
        <Text style={styles.paramText}>Order ID: {params.orderId}</Text>
      )}
      {params?.status && (
        <Text style={styles.paramText}>Status: {params.status}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' })}
      >
        <Text style={styles.buttonText}>Quay lại danh sách Đơn hàng</Text>
      </TouchableOpacity>
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
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  paramText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#0369A1',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
