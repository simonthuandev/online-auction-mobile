import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProp } from '../navigation/types';

export default function ExploreScreen() {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>FD1 Placeholder</Text>
      <Text style={styles.title}>Khám Phá Sản Phẩm</Text>
      <Text style={styles.subtitle}>
        Danh sách sản phẩm và danh mục đấu giá công khai.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProductDetail', { productId: 'demo-prod-001' })}
      >
        <Text style={styles.buttonText}>Xem thử Product Detail (demo-prod-001)</Text>
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
    backgroundColor: '#E2E8F0',
    color: '#475569',
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
    backgroundColor: '#2563EB',
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
