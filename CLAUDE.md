# CLAUDE.md — Online Auction Mobile

Mobile app for Online Auction platform built with Expo SDK 58 (Managed Workflow), React Native 0.88, TypeScript, React Navigation v7, TanStack Query v5, Redux Toolkit, Axios, Socket.IO, and Expo Secure Store.

## Commands

```bash
npx expo start            # Start Expo dev server
npm run typecheck         # TypeScript check (tsc --noEmit) - MUST PASS
npm run lint              # ESLint check (eslint .)
npm run contracts:sync    # Sync contracts and generate src/contracts/api.generated.ts
```

## Architecture & Code Organization

- **Navigation:** React Navigation v7 in `src/navigation/` (Native Stack + Bottom Tabs). **DO NOT use Expo Router**.
- **Screens:** `src/screens/` contains all screen components.
- **Storage:** `src/storage/tokenStorage.ts` uses `expo-secure-store`. Never use `AsyncStorage` for auth tokens.
- **Core API & Interceptors:** `src/api/client.ts` contains Axios with single-flight refresh token mutex.
- **Contracts:** Generated types in `src/contracts/api.generated.ts`. Never edit generated files by hand.

## Critical Rules

1. **Defensive Coding & Zero-Crash:**
   - Always use optional chaining (`?.`) and nullish coalescing (`??`) on API responses.
   - Text fallbacks: `item.title ?? 'Chưa có tiêu đề'`, `user.name ?? 'Người dùng'`.
   - Lists: Use `FlatList` with `ListEmptyComponent` showing "Không có dữ liệu".
   - Never crash when backend is offline/unreachable: show friendly Error card with a **Retry** button (`refetch()`).
   - Image fallback when `thumbnail` or `avatarUrl` is null.
2. **Mobile UX & OS Lifecycle:**
   - Use `RefreshControl` on `FlatList` for pull-to-refresh.
   - Bid action bar must use `KeyboardAvoidingView` + `SafeAreaView` so the keyboard never obscures the bid button.
   - Haptics: trigger `Haptics.notificationAsync(Success)` on bid success, `Warning` on outbid.
   - Reconnect: listen to `AppState` (`background -> active`) and `NetInfo` to reconnect sockets and refetch data.
3. **Money & Time:**
   - Money is integer string VND (`BigInt` via `src/lib/money.ts`). Never use JS floats for money.
   - Dates are ISO UTC strings. Convert to local time for display using `src/lib/time.ts`.
4. **Backend Addresses:**
   - Android Emulator: `http://10.0.2.2:8080` (REST), `:3003` (Auction Socket), `:3006` (Notif Socket).
   - iOS Simulator: `http://localhost:8080`, `:3003`, `:3006`.
   - Physical device: Local network LAN IP (`http://192.168.x.x:PORT`).
5. **Git Workflow:**
   - Branch: `feat/<scope>/<issue>-<slug>`.
   - Always merge directly to `main` via PR (no `dev` branch).
   - Ensure `npm run typecheck` and `npm run lint` pass cleanly before submitting PR.
