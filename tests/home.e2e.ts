import { test as base } from '@e2e-dev/mobile';
import { expect } from 'e2e';

import { skipRevenueCat, test } from './fixtures';

base('a fresh install shows the plan and the Subscribe button', async ({ app, screen }) => {
  // The app stays where the last test or run left it, signed in or subscribed.
  await app.clearState();

  // The first launch waits for Metro to bundle the app.
  await expect(screen.getByText(/^RevenueCat paywall,\s+tested end to end$/)).toBeVisible({ timeout: 60_000 });
  await expect(screen.getByTestId('subscribe')).toBeVisible();
});

test(
  "the link signs in as a new customer, and RevenueCat has it with nothing bought",
  { skip: skipRevenueCat },
  async ({ screen, revenuecat, customer }) => {
    await expect(screen.getByTestId('plan-price')).toHaveText('$9.99 / month');
    await expect(screen.getByTestId('subscription-status')).toHaveText('not subscribed');

    // The app's logIn created the customer in RevenueCat.
    await expect.poll(() => revenuecat.customer(customer), { timeout: 15_000 }).not.toBeNull();
    expect((await revenuecat.customer(customer))?.active_entitlements.items).toEqual([]);
    expect(await revenuecat.subscriptions(customer)).toEqual([]);
  },
);
