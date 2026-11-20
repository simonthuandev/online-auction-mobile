import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProp } from '../navigation/types';

export default function ProfileScreen() {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.badge}>FD1 Placeholder</Text>
      <Text style={styles.title}>Hồ Sơ Cá Nhân</Text>
      <Text style={styles.subtitle}>
        Xem và cập nhật thông tin tài khoản, đăng nhập / đăng xuất.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
      >
        <Text style={styles.buttonText}>Đi tới Màn hình Đăng nhập (Auth)</Text>
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
    backgroundColor: '#F1F5F9',
    color: '#334155',
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
    backgroundColor: '#0F172A',
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
