import { useCallback, useEffect, useState } from 'react';
import Purchases, {
  type CustomerInfo,
  type CustomerInfoUpdateListener,
  type PurchasesPackage,
} from 'react-native-purchases';

import { activeEntitlement, keyProblem, setUpRevenueCat } from '@/lib/revenuecat';

/**
 * The monthly plan from RevenueCat's current offering, and the customer's entitlement.
 * With a `customer`, signs in as that customer first.
 */
export function useSubscription(customer: string | undefined) {
  const [error, setError] = useState<string | null>(keyProblem);
  const [plan, setPlan] = useState<PurchasesPackage | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (keyProblem()) return;
    let current = true;
    const listener: CustomerInfoUpdateListener = (info) => {
      if (current) setCustomerInfo(info);
    };

    (async () => {
      try {
        await setUpRevenueCat();
        if (!current) return;
        Purchases.addCustomerInfoUpdateListener(listener);
        if (customer) await Purchases.logIn(customer);
        const [offerings, info, id] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
          Purchases.getAppUserID(),
        ]);
        if (!current) return;
        const monthly = offerings.current?.monthly;
        if (!monthly) throw new Error('the current offering has no monthly package');
        setPlan(monthly);
        setCustomerInfo(info);
        setCustomerId(id);
        setError(null);
      } catch (e) {
        if (current) setError(`couldn't load the plan from RevenueCat: ${e instanceof Error ? e.message : String(e)}.`);
      }
    })();

    return () => {
      current = false;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [customer]);

  const refresh = useCallback(async () => {
    const info = await Purchases.getCustomerInfo();
    setCustomerInfo(info);
    return info;
  }, []);

  return { error, plan, customerId, entitlement: activeEntitlement(customerInfo), refresh };
}
