# Expo SDK Upgrade Plan — swinn-client

**From:** Expo SDK 43 (RN 0.64.3, React 17.0.1)
**To:** Expo SDK 57 (RN 0.86, React 19.2)
**Strategy:** Staged in-place with **collapsed early phases**. Jump straight to SDK 50 (first checkpoint that boots on Node 20), then step **50 → 52 → 57**. UI layer NativeBase v2 → gluestack-ui.
**Created:** 2026-07-14

**Environment:** Node pinned to **20** via `.nvmrc` (managed with `fnm`); bump to 22 for SDK 57. Run `fnm use` in the repo before any node/expo command. No SDK 43–49 boot — those need Node 16/18 and the deprecated global expo-cli and carry no value.

---

## Guiding rules
- One phase at a time. Do not advance until the app **builds and runs on iOS + Android** and `npx expo-doctor` is clean.
- Commit at every green checkpoint. Branch: `feature/expo-sdk-upgrade`.
- Use `npx expo install <pkg>@<sdk> --fix` to align dependency versions to each SDK, then `npx expo-doctor`.
- Once native deps change, test via an **EAS dev build**, not Expo Go.

## Codebase-specific hazards (address as they come up)
- [ ] `native-base@2.13.13` — unmaintained, replace with **gluestack-ui** (Phase 3). Touches every screen.
- [ ] Dual navigation: remove legacy `react-navigation@4` + `react-navigation-stack` + `react-navigation-tabs`; keep `@react-navigation/*`, take v5 → v7.
- [ ] `expo eject` script — removed SDK 46, replace with `expo prebuild` (CNG).
- [ ] `expo-random` — removed SDK 51 → `expo-crypto`.
- [ ] `expo-barcode-scanner` — deprecated → `expo-camera` (affects QR scanning, PR #34).
- [ ] `expo-battery` — move from devDependencies to dependencies.
- [ ] `react-native-reanimated` 2.2 → 4.x (worklets + Babel plugin changes).
- [ ] New Architecture default-on from SDK 52 — every native dep must be Fabric-compatible.
- [ ] `socket.io-client@2` + `laravel-echo` — revalidate against server (Phase 4).

---

## Phase 0 — Prep  ✅ (in progress)
- [x] Create branch `feature/expo-sdk-upgrade`.
- [x] Install `fnm`, pin Node 20 via `.nvmrc`.
- [ ] Current Xcode + Android SDK.
- [ ] Add `eas.json`; configure EAS Build for dev builds.

## Phase 1 — Jump to SDK 50 (first runnable checkpoint)  ✅ bundles
- [x] Delete stale SDK-43 `yarn.lock`; set `expo` ~50, `react` 18.2, `react-native` 0.73.
- [x] `npx expo install --fix` to align all expo-managed deps.
- [x] Remove `eject` script; remove legacy `react-navigation@4` trio (were dead — zero imports).
- [x] Upgrade `@react-navigation/*` v5 → v6 (+ `tabBarIcon` `tintColor` → `color`).
- [x] `expo-random` → `expo-crypto` (was unused; nothing to rewire).
- [x] `react-native-reanimated` 2.2 → 3.x (Babel plugin added).
- [x] **Replace NativeBase v2 → gluestack-ui** — all 28 files converted; icons → `@expo/vector-icons`.
- [x] Add `@babel/plugin-transform-class-static-block` (gluestack react-stately/react-aria deps need it).
- [x] `expo-doctor` clean (16/16); `expo export` (iOS) bundles successfully.
- [ ] Run on iOS + Android device/simulator (dev build) to confirm runtime — **not yet done**.

## Phase 2 — SDK 50 → 52  ✅ bundles
- [x] Bump to SDK 52 (RN 0.76.9, React 18.3.1); `expo install --fix` aligned.
- [x] `expo-barcode-scanner` (removed in SDK 51) → `expo-camera` `CameraView` + `useCameraPermissions` in QRReaderScreen.
- [x] React Navigation v6 → v7.
- [x] `.gitignore` `.expo/`; untrack `.expo`. `expo-doctor` 18/18; `expo export` (iOS) bundles.
- [ ] Runtime verification on device (New Arch default-on) — not yet done.

## Phase 3 — SDK 52 → 57
- [ ] Step SDKs 53, 54, 55, 56, 57.
- [ ] React 18 → 19.2, RN → 0.86.
- [ ] Android edge-to-edge (SDK 53+).
- [ ] Reanimated 3 → 4.
- [ ] Revalidate `socket.io-client` / `laravel-echo` vs server.
- [ ] Checkpoint.

## Phase 4 — Verify & land
- [ ] `npx expo-doctor` clean.
- [ ] Dev build runs on iOS + Android; smoke-test auth, QR add-contact, threads/echo, navigation.
- [ ] Merge to master.

---

## NativeBase v2 → gluestack-ui mapping (apply to remaining ~25 files)
Reference conversions done: `screens/LoadingScreen.js`, `components/common/Loading.js`, `components/common/CustomHeader.js`.

| NativeBase v2 | Replacement |
| --- | --- |
| `Container` | `<Box flex={1}>` |
| `Content` | `<ScrollView>` (gluestack or RN) |
| `Header` | `<HStack alignItems="center" justifyContent="space-between" px="$3" py="$2">` |
| `Left` / `Body` / `Right` | `<Box flexBasis="10%/80%/10%">` |
| `Title` | `<Heading>` |
| `Text` | `<Text>` (gluestack) |
| `Button transparent` | `<Button variant="link">` |
| `Button` | `<Button><ButtonText>…</ButtonText></Button>` |
| `Icon name='…'` (Ionicons) | `@expo/vector-icons` `<Ionicons name size />` (rename legacy `ios-*`) |
| `Spinner` | `<Spinner>` |
| `List` / `ListItem` | `<VStack>` / `<HStack>` rows |
| `Thumbnail` | `<Avatar>`/`<AvatarImage>` or `<Image>` |
| `Badge` | `<Badge><BadgeText>…</BadgeText></Badge>` |
| `Switch` | `<Switch>` |
| `Item` / `Input` | `<Input><InputField/></Input>` |

Icons: use `@expo/vector-icons` (bundled with Expo), NOT `react-native-vector-icons` (needs native font config). Legacy Ionicons names like `ios-arrow-back` → `chevron-back`.

## Fallback
If Phase 3 (NativeBase → gluestack + New Arch) proves more costly than a rewrite, reconsider scaffolding a fresh SDK 57 app and porting screens. Re-evaluate at the Phase 3 checkpoint.
