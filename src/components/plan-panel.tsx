import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PurchasesEntitlementInfo, PurchasesPackage } from 'react-native-purchases';

import { colors, space, type } from '@/constants/theme';

const PERIODS: Record<string, string> = { P1W: 'week', P1M: 'month', P3M: '3 months', P6M: '6 months', P1Y: 'year' };

type PlanPanelProps = {
  plan: PurchasesPackage | null;
  entitlement: PurchasesEntitlementInfo | null;
  loaded: boolean;
  children: ReactNode;
};

export function PlanPanel({ plan, entitlement, loaded, children }: PlanPanelProps) {
  const { title, priceString, subscriptionPeriod } = plan?.product ?? {};
  const period = subscriptionPeriod ? PERIODS[subscriptionPeriod] : undefined;

  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={[type.caption, styles.muted]}>
        your plan
      </Text>
      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={[type.bodyM, styles.secondary]}>{title ?? 'plan'}</Text>
          <Text testID="plan-price" style={[type.bodyM, styles.secondary]}>
            {priceString ? `${priceString}${period ? ` / ${period}` : ''}` : '…'}
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text style={[type.bodyM, styles.primary]}>status</Text>
          <Text testID="subscription-status" style={[type.bodyM, entitlement ? styles.positive : styles.primary]}>
            {!loaded ? '…' : entitlement ? 'subscribed' : 'not subscribed'}
          </Text>
        </View>
        {entitlement?.expirationDate ? (
          <View style={styles.row}>
            <Text style={[type.bodyM, styles.secondary]}>{entitlement.willRenew ? 'renews' : 'ends'}</Text>
            <Text testID="subscription-renewal" style={[type.bodyM, styles.secondary]}>
              {new Date(entitlement.expirationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ) : null}
      </View>
      {children}
      <Text style={[type.bodyS, styles.muted]}>
        you subscribe in RevenueCat&apos;s paywall and pay with its Test Store.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: space(3),
    padding: space(3),
    borderWidth: 1,
    borderColor: colors.neutral800,
    backgroundColor: colors.panel,
  },
  rows: { gap: space(2) },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: space(2) },
  total: { paddingTop: space(2), borderTopWidth: 1, borderTopColor: colors.neutral800 },
  muted: { color: colors.neutral500 },
  secondary: { color: colors.neutral300 },
  primary: { color: colors.offWhite },
  positive: { color: colors.green },
});
