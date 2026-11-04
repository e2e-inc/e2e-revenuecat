import { LogBox } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesEntitlementInfo } from 'react-native-purchases';

const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? '';

// The SDK reports a failed or cancelled purchase as a console error, which a Debug build would show over the app.
LogBox.ignoreLogs(['[RevenueCat]']);

/** Why the app can't talk to RevenueCat, or null when it can. */
export function keyProblem(): string | null {
  if (!apiKey) return 'set EXPO_PUBLIC_REVENUECAT_API_KEY to your RevenueCat Test Store key.';
  // Only a Test Store key: any other key would reach a real store.
  if (!apiKey.startsWith('test_')) return 'this demo only runs with a RevenueCat Test Store key (test_…).';
  return null;
}

export async function setUpRevenueCat() {
  if (!(await Purchases.isConfigured())) Purchases.configure({ apiKey });
}

// The demo has one plan, so any active entitlement means subscribed.
export function activeEntitlement(info: CustomerInfo | null): PurchasesEntitlementInfo | null {
  return info ? (Object.values(info.entitlements.active)[0] ?? null) : null;
}
