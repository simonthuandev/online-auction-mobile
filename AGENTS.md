# Working Agreements & Architecture Rules — Online Auction Mobile

Repo: `online-auction-mobile`
Tech stack: **Expo SDK 58 (Managed Workflow) + React Native 0.88 + TypeScript + React Navigation v7 (Native Stack & Bottom Tabs) + TanStack Query v5 + Redux Toolkit + Axios + Socket.IO Client + Expo Secure Store**.

---

## 1. Development & Verification Commands

```bash
npx expo start            # Khởi chạy Expo development server
npm run typecheck         # Kiểm tra kiểu TypeScript (tsc --noEmit) — BẮT BUỘC CHẠY XANH
npm run lint              # Kiểm tra quy chuẩn code (eslint .)
npm run contracts:sync    # Đọc contracts/openapi/*.json và sinh src/contracts/api.generated.ts
```

> [!IMPORTANT]
> - Dự án dùng **React Navigation** (Native Stack + Bottom Tabs), **KHÔNG DÙNG Expo Router**. Toàn bộ navigation nằm trong `src/navigation/` và màn hình nằm trong `src/screens/`.
> - Mọi thay đổi code hoặc trước khi mở PR phải chạy xanh cả `npm run typecheck` và `npm run lint`.

---

## 2. Cấu trúc Thư mục Chuẩn

```text
src/
├── api/                  # client.ts (Axios cấu hình với single-flight refresh mutex), api endpoints
├── contracts/            # api.generated.ts (sinh tự động từ contracts/openapi/*.json)
├── lib/                  # Helper lõi: money.ts (BigInt), time.ts (UTC), idempotency.ts (UUID), socket.ts
├── navigation/           # RootNavigator.tsx (AuthStack, MainTabs 5 tab, DetailScreens)
├── screens/              # Màn hình ứng dụng (ExploreScreen, AuctionRoomScreen, OrderDetailScreen, etc.)
├── storage/              # tokenStorage.ts (Lưu accessToken, refreshToken bằng expo-secure-store)
└── store/                # Redux Toolkit: authSlice.ts, uiSlice.ts
```

---

## 3. Quy chuẩn Lập trình Phòng thủ & Độc lập Backend (BẮT BUỘC)

Ứng dụng Mobile phải hoạt động ổn định, **tuyệt đối không bị văng app (zero-crash)** ngay cả khi Backend chưa bật, điện thoại mất mạng hoặc API trả dữ liệu rỗng:

1. **Null Safety & Safe Navigation:**
   - Luôn dùng Optional Chaining (`?.`) và Nullish Coalescing (`??`) cho mọi dữ liệu API.
   - Text fallback: `item.title ?? 'Chưa có tiêu đề'`, `user.name ?? 'Người dùng'`, `product.description || 'Chưa có mô tả'`.
   - List fallback: `(data?.items ?? [])`. Dùng `FlatList` với prop `ListEmptyComponent` hiển thị component EmptyState với thông điệp: *"Không có dữ liệu"* hoặc *"Chưa có sản phẩm nào"*.
   - Money: `formatVnd(price ?? '0')` hoặc hiển thị `"0 ₫"`.
   - Date: `time ? formatLocalTime(time) : 'Chưa cập nhật'`.
   - Image fallback: Luôn truyền placeholder image khi `thumbnail` hoặc `avatarUrl` là `null`; bọc an toàn tránh crash khi URL ảnh không tải được.
2. **Chuẩn hóa 4 trạng thái giao diện:**
   - **Loading:** `ActivityIndicator` hoặc Skeleton view.
   - **Empty:** `ListEmptyComponent` với icon và thông điệp thân thiện *"Không có dữ liệu"*.
   - **Error / Offline:** Bắt lỗi kết nối mạng (`ERR_NETWORK`, timeout). Hiển thị banner/card lỗi với nút **"Thử lại"** gọi `refetch()`. Không throw unhandled error.
   - **Success:** Render dữ liệu với đầy đủ các fallback.
3. **UX & OS Phản hồi:**
   - Gắn `RefreshControl` cho mọi `FlatList` để người dùng có thể kéo làm mới (Pull-to-Refresh).
   - Thanh đặt giá phòng đấu giá phải bọc trong `KeyboardAvoidingView` (`behavior="padding"` trên iOS) + `SafeAreaView` để không bị bàn phím che nút bấm.
   - Kích hoạt `Haptics.notificationAsync(Success)` khi bid thành công và `Warning` khi bị vượt giá (`OUTBID`).
   - Lắng nghe `AppState` (`background -> active`) và `NetInfo` để tự kết nối lại Socket và refetch dữ liệu REST.

---

## 4. Ràng buộc Nghiệp vụ & Khớp Hợp đồng Backend

1. **Lưu Token Xác thực:**
   - Bắt buộc dùng `src/storage/tokenStorage.ts` (**`expo-secure-store`**). **CẤM DÙNG `AsyncStorage`** để lưu `accessToken` và `refreshToken`.
2. **Tiền tệ VND (BigInt):**
   - Tiền tệ là chuỗi số nguyên VND (`string`), không dùng `number` JS.
   - Mọi tính toán cộng bước giá, so sánh giá dùng `src/lib/money.ts`.
3. **Thời gian ISO UTC:**
   - Backend lưu và trả ISO UTC. Mọi input gửi lên BE phải đổi qua `.toISOString()`.
4. **Idempotency-Key:**
   - Bắt buộc gắn header `Idempotency-Key` (UUID v4) cho `POST /api/auctions/{id}/bids`, `POST /api/payments`.
5. **Đăng xuất (`POST /api/auth/logout`):**
   - Phải gửi body `{ refreshToken: string }` trước khi xóa token trong `tokenStorage`.
6. **Địa chỉ Kết nối Backend Local (Khác biệt theo OS):**
   - Android Emulator: `http://10.0.2.2:8080` (REST), `http://10.0.2.2:3003` (Socket Auction), `http://10.0.2.2:3006` (Socket Notif).
   - iOS Simulator: `http://localhost:8080`, `http://localhost:3003`, `http://localhost:3006`.
   - Thiết bị thật: Dùng IP mạng LAN của máy chạy backend (`http://192.168.x.x:PORT`).
   - Socket **không đi qua gateway :8080**, kết nối thẳng vào cổng service :3003 và :3006.
7. **Người dẫn đầu đấu giá:**
   - Schema `Auction` không có trường `leadingBidderId`. FE xác định người dẫn đầu qua `bids[0]?.bidderId` từ `GET /api/auctions/{id}/bids` hoặc event `auction:bid_updated`. Nếu trùng user hiện tại thì khóa nút bid.

---

## 5. Quy tắc Git & Pull Request

- Branch naming: `feat/<scope>/<issue>-<slug>` (ví dụ: `feat/auction/MOB-AUC-01-realtime-room`).
- Commit message: Tuân theo Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`).
- **Merge trực tiếp vào nhánh `main`** qua Pull Request (dự án không dùng nhánh `dev`).
