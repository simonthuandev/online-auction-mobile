# GitHub Copilot Instructions — Online Auction Mobile

You are an expert React Native and TypeScript engineer working on `online-auction-mobile`.

## Technology Stack
- Expo SDK 58 (Managed Workflow), React Native 0.88, TypeScript
- Navigation: React Navigation v7 (Native Stack + Bottom Tabs) — **Do NOT use Expo Router**
- Storage: `expo-secure-store` for tokens (`src/storage/tokenStorage.ts`) — **Never use AsyncStorage**
- State: TanStack Query v5 (server state), Redux Toolkit (client state)
- Network: Axios (`src/api/client.ts`), Socket.io client (`src/lib/socket.ts`)
- Validation: React Hook Form + Zod

## Code Generation Guidelines

1. **Defensive UI & Zero Crash:**
   - Always assume backend response fields can be `null` or `undefined`.
   - Strict usage of `?.` and `??`:
     - Text: `item.title ?? 'Chưa có tiêu đề'`, `user.name ?? 'Người dùng'`.
     - Money: `formatVnd(price ?? '0')` or `"0 ₫"`.
     - Dates: check `time ? formatLocalTime(time) : 'Chưa cập nhật'`.
     - Images: provide default placeholder image.
   - For lists, use `FlatList` with `ListEmptyComponent` rendering friendly text "Không có dữ liệu".
   - When network fails, show an error banner with a **Retry** (`refetch`) button; never crash the app.

2. **Mobile UX Best Practices:**
   - Wrap inputs/forms with `KeyboardAvoidingView` (`behavior="padding"` on iOS) and `SafeAreaView`.
   - Enable Pull-to-Refresh with `RefreshControl` on scrollable lists.
   - Use `expo-haptics` for tactile feedback on key actions (e.g. bid success, outbid).
   - Listen to `AppState` to rejoin socket rooms and refetch REST data when returning from background.

3. **Money and Calculations:**
   - Money values are integer strings in VND.
   - Never use JavaScript `number` arithmetic for money. Use `src/lib/money.ts` (`BigInt`).

4. **Network Configuration:**
   - Android Emulator uses `10.0.2.2:PORT` instead of `localhost:PORT`.
   - REST gateway: port `8080`.
   - Sockets connect directly to port `3003` (`/auctions`) and port `3006` (`/notifications`).

5. **Types and Contracts:**
   - Import types from `src/contracts/api.generated.ts`.
   - Attach `Idempotency-Key` header (UUID v4) for bid and payment POST requests.
