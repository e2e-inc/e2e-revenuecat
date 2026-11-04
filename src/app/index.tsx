import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { PlanPanel } from '@/components/plan-panel';
import { SiteHeader } from '@/components/site-header';
import { colors, space, type } from '@/constants/theme';
import { useSubscription } from '@/hooks/use-subscription';
import { activeEntitlement } from '@/lib/revenuecat';

// RevenueCat's rule for app user ids. The tests open e2erevenuecat:///?customer=<id> to sign in as one.
const CUSTOMER_ID = /^[A-Za-z0-9_-]{1,100}$/;

export default function HomeScreen() {
  const params = useLocalSearchParams<{ customer?: string }>();
  const customer = params.customer && CUSTOMER_ID.test(params.customer) ? params.customer : undefined;
  const { error, plan, customerId, entitlement, refresh } = useSubscription(customer);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [paywallError, setPaywallError] = useState<string | null>(null);

  async function subscribe() {
    setNotice(null);
    setPaywallError(null);
    setPaywallOpen(true);
    try {
      await RevenueCatUI.presentPaywall();
      // Its result differs by platform after a failed purchase, so ask RevenueCat for the entitlement instead.
      if (!activeEntitlement(await refresh())) setNotice('paywall closed. nothing was charged.');
    } catch (e) {
      setPaywallError(`couldn't open RevenueCat's paywall: ${e instanceof Error ? e.message : String(e)}.`);
    } finally {
      setPaywallOpen(false);
    }
  }

  const shownError = error ?? paywallError;

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <SiteHeader />
        <View style={styles.main}>
          <Text style={[type.caption, styles.eyebrow]}>RevenueCat example</Text>
          <Text accessibilityRole="header" style={[type.h1, styles.heading]}>
            RevenueCat paywall,{'\n'}tested end to end
          </Text>
          <Text style={[type.bodyL, styles.lede]}>
            a real in-app purchase in RevenueCat&apos;s Test Store, tested with e2e: on the device, and against what
            RevenueCat recorded.
          </Text>
          <Text style={[type.codeS, styles.note]}>
            Test Store: “Test valid purchase” subscribes, “Test failed purchase” fails. nothing is charged.
          </Text>

          <View style={styles.panel}>
            <PlanPanel plan={plan} entitlement={entitlement} loaded={customerId !== null}>
              {entitlement ? null : (
                <Button
                  testID="subscribe"
                  label={paywallOpen ? 'opening paywall…' : 'subscribe'}
                  disabled={!plan || paywallOpen}
                  onPress={subscribe}
                />
              )}
            </PlanPanel>
          </View>

          {notice ? (
            <Text testID="paywall-notice" style={[type.bodyM, styles.notice]}>
              {notice}
            </Text>
          ) : null}
          {shownError ? (
            <Text testID="purchases-error" accessibilityRole="alert" style={[type.bodyM, styles.error]}>
              {shownError}
            </Text>
          ) : null}
          {customerId ? (
            <View style={styles.customer}>
              <Text style={[type.caption, styles.muted]}>customer</Text>
              <Text testID="customer-id" selectable style={[type.codeS, styles.secondary, styles.customerId]}>
                {customerId}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.black },
  content: { flexGrow: 1, paddingHorizontal: space(3), paddingBottom: space(4) },
  main: { flex: 1, justifyContent: 'center', paddingTop: space(5) },
  eyebrow: { color: colors.mint },
  heading: { marginTop: space(2), color: colors.offWhite },
  lede: { marginTop: space(2), color: colors.neutral400 },
  note: { marginTop: space(3), color: colors.neutral500 },
  panel: { marginTop: space(5) },
  notice: { marginTop: space(2), color: colors.neutral300 },
  error: { marginTop: space(2), color: colors.mint },
  customer: { flexDirection: 'row', alignItems: 'center', gap: space(1), marginTop: space(2) },
  customerId: { flexShrink: 1 },
  muted: { color: colors.neutral500 },
  secondary: { color: colors.neutral300 },
});
