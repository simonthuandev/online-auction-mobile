# Online Auction Mobile Application (React Native / Expo)

Ứng dụng di động Đấu Giá Trực Tuyến (Online Auction Mobile App) được phát triển bằng React Native với Expo Managed Workflow (SDK 58), phục vụ nền tảng iOS & Android.

Dự án này là đầu ra của issue **[FE-PLAT-02]** (Checkpoint FD1) dành cho TV3 theo tài liệu [`docs/online-auction-frontend-plan.md`](file:///home/chennan/Documents/code-project/online-auction-mobile/docs/online-auction-frontend-plan.md).

---

## 1. Công nghệ & Thư viện cốt lõi (Tech Stack)

- **Framework**: Expo SDK 58, React Native 0.88, React 19, TypeScript
- **Navigation**: React Navigation v7 (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **Server State & Cache**: TanStack React Query (`@tanstack/react-query` v5)
- **Client State**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **HTTP Client**: Axios với interceptor **single-flight refresh token mutex** và chuẩn hóa Error envelope
- **Realtime**: Socket.IO client (`socket.io-client`), quản lý 2 singleton socket (`auctionSocket`, `notifSocket`), tự động reconnect theo `AppState` & `NetInfo`
- **Security Storage**: `expo-secure-store` (Keychain trên iOS / EncryptedSharedPreferences trên Android)
- **Form & Validation**: React Hook Form + Zod
- **Contract Synchronization**: `openapi-typescript` sinh types từ OpenAPI 3.1 sang `src/contracts/api.generated.ts`
- **Deep Linking**: Scheme `auctionapp://` hỗ trợ các route `orders/:orderId`, `auctions/:auctionId`, `products/:productId`, `payment-return`

---

## 2. Cấu trúc thư mục (Feature-based)

```text
├── contracts/                  # Backend contracts (OpenAPI 3.1 & socket.json)
├── scripts/
│   └── sync-contracts.mjs      # Script gộp OpenAPI JSON và sinh TypeScript types
├── src/
│   ├── api/
│   │   └── client.ts           # Axios client, single-flight refresh token mutex, error envelope
│   ├── contracts/
│   │   ├── api.generated.ts    # Types tự động sinh từ OpenAPI contracts
│   │   ├── openapi/            # Bản sao các file JSON OpenAPI từ BE
│   │   └── socket.json         # Bản sao socket event contract
│   ├── lib/
│   │   ├── socket.ts           # auctionSocket, notifSocket, AppState + NetInfo auto reconnect
│   │   ├── queryClient.ts      # TanStack Query client singleton
│   │   ├── money.ts            # BigInt VND arithmetic & formatter
│   │   ├── time.ts             # UTC ISO <-> Local GMT+7 & auction countdown
│   │   └── idempotency.ts      # UUID v4 generator cho header Idempotency-Key
│   ├── navigation/
│   │   ├── types.ts            # Type definitions cho navigation params
│   │   ├── linking.ts          # Deep link configuration (auctionapp://)
│   │   ├── RootNavigator.tsx   # Root Native Stack Navigator
│   │   ├── MainTabNavigator.tsx# 5 Tabs: Khám phá, Đấu giá, Đơn hàng, Thông báo, Cá nhân
│   │   └── AuthNavigator.tsx   # Auth Stack (Login, Register)
│   ├── screens/                # Màn hình placeholder FD1
│   ├── storage/
│   │   └── tokenStorage.ts     # expo-secure-store lưu accessToken & refreshToken
│   └── store/                  # Redux Toolkit store (authSlice, uiSlice)
├── App.tsx                     # Entry point tích hợp Providers
└── app.json                    # Cấu hình Expo, scheme "auctionapp", usesCleartextTraffic
```

---

## 3. Cấu hình Mạng & Biến môi trường (`.env`)

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

### Hướng dẫn cấu hình IP kết nối Backend theo môi trường:

| Môi trường chạy | `EXPO_PUBLIC_API_BASE_URL` | `EXPO_PUBLIC_SOCKET_AUCTION_URL` | `EXPO_PUBLIC_SOCKET_NOTIF_URL` | Ghi chú |
| --- | --- | --- | --- | --- |
| **Android Emulator** | `http://10.0.2.2:8080` | `http://10.0.2.2:3003/auctions` | `http://10.0.2.2:3006/notifications` | Android Emulator dùng `10.0.2.2` để trỏ về localhost máy host |
| **iOS Simulator** | `http://localhost:8080` | `http://localhost:3003/auctions` | `http://localhost:3006/notifications` | iOS Simulator chia sẻ mạng trực tiếp với máy macOS host |
| **Thiết bị thật (Expo Go / LAN)** | `http://<IP_LAN>:8080` | `http://<IP_LAN>:3003/auctions` | `http://<IP_LAN>:3006/notifications` | Tìm IP LAN qua lệnh `ip a` hoặc `ifconfig` (ví dụ: `192.168.1.50`) |

> [!NOTE]
> Android dev đã được bật cấu hình `usesCleartextTraffic: true` trong `app.json` để cho phép kết nối HTTP không qua HTTPS trong môi trường phát triển local.

---

## 4. Các lệnh phát triển (Commands)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Đồng bộ types từ Backend OpenAPI contracts
npm run contracts:sync

# 3. Khởi chạy Expo Dev Server
npx expo start

# 4. Kiểm tra TypeScript types
npm run typecheck

# 5. Kiểm tra linter
npm run lint
```

---

## 5. Kiểm thử Deep Linking

Ứng dụng hỗ trợ scheme `auctionapp://`. Có thể kiểm tra bằng lệnh terminal:

```bash
# Mở phòng đấu giá
npx uri-scheme open "auctionapp://auctions/auc-uuid-123" --android

# Mở chi tiết đơn hàng
npx uri-scheme open "auctionapp://orders/ord-uuid-456" --android

# Callback thanh toán VNPay
npx uri-scheme open "auctionapp://payment-return?orderId=ord-uuid-456&status=SUCCESS" --android
```
