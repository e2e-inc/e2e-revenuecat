import { describe } from '@e2e-dev/mobile';
import type { Agent, Screen } from 'e2e';
import { expect } from 'e2e';

import { customerLink, skip, test } from './fixtures';
import type { RevenueCat } from './revenuecat';

const CLOSED = 'paywall closed. nothing was charged.';
const FIVE_MINUTES = 5 * 60_000;

// From our Subscribe button to RevenueCat's Test Store dialog for the monthly plan.
async function openTestStoreDialog(agent: Agent, screen: Screen) {
  await screen.getByTestId('subscribe').tap();
  await agent.act("choose the Monthly plan on RevenueCat's paywall and tap Purchase");
  await agent.assert('a Test Store Purchase dialog for the monthly product at $9.99 is showing', { vision: true });
}

async function expectNothingBought(revenuecat: RevenueCat, customer: string) {
  expect(await revenuecat.subscriptions(customer)).toEqual([]);
  expect((await revenuecat.customer(customer))?.active_entitlements.items).toEqual([]);
}

// RevenueCat's paywall and Test Store dialog are native screens the app doesn't own, so these tests retry.
describe('paywall', { tags: ['paywall'], skip, retries: 2, timeout: 180_000 }, () => {
  test('a valid test purchase subscribes, and RevenueCat records it', async ({ agent, screen, revenuecat, customer }) => {
    await openTestStoreDialog(agent, screen);

    await agent.act('tap Test valid purchase in the Test Store dialog');
    await expect(screen.getByTestId('subscription-status')).toHaveText('subscribed', { timeout: 30_000 });
    await expect(screen.getByTestId('subscription-renewal')).toBeVisible();

    const [subscription, ...others] = await revenuecat.subscriptions(customer);
    expect(others).toEqual([]);
    expect(subscription).toMatchObject({
      store: 'test_store',
      environment: 'sandbox',
      status: 'active',
      gives_access: true,
      auto_renewal_status: 'will_renew',
    });
    expect(subscription?.entitlements.items).toHaveLength(1);
    expect(await revenuecat.storeIdentifier(subscription?.product_id ?? '')).toBe('monthly');
    // The Test Store runs a month in five minutes.
    expect((subscription?.current_period_ends_at ?? 0) - (subscription?.current_period_starts_at ?? 0)).toBe(
      FIVE_MINUTES,
    );
  });

  test(
    'a failed test purchase subscribes nothing',
    {
      agentContext:
        'Test failed purchase makes the purchase fail on purpose, so an error afterwards is the expected outcome, not a failure.',
    },
    async ({ agent, screen, platform, revenuecat, customer }) => {
      await openTestStoreDialog(agent, screen);

      await agent.act('tap Test failed purchase in the Test Store dialog');
      // Android shows the simulated error; iOS goes back to the paywall without one.
      if (platform === 'android') {
        await agent.assert('an error says the purchase failure was simulated in the Test Store', { vision: true });
      } else {
        await agent.assert('the paywall is showing, and the Test Store dialog is gone', { vision: true });
      }

      await agent.act('close the paywall');
      await expect(screen.getByTestId('paywall-notice')).toHaveText(CLOSED);
      await expect(screen.getByTestId('subscription-status')).toHaveText('not subscribed');
      await expectNothingBought(revenuecat, customer);
    },
  );

  test('cancelling in the Test Store dialog subscribes nothing', async ({ agent, screen, revenuecat, customer }) => {
    await openTestStoreDialog(agent, screen);

    await agent.act('tap Cancel in the Test Store dialog');
    await agent.assert('the paywall is showing, and the Test Store dialog is gone', { vision: true });

    await agent.act('close the paywall');
    await expect(screen.getByTestId('paywall-notice')).toHaveText(CLOSED);
    await expect(screen.getByTestId('subscription-status')).toHaveText('not subscribed');
    await expectNothingBought(revenuecat, customer);
  });

  test('closing the paywall charges nothing', async ({ agent, screen, revenuecat, customer }) => {
    await screen.getByTestId('subscribe').tap();
    await agent.assert("RevenueCat's paywall offers the Monthly plan at $9.99", { vision: true });

    await agent.act('close the paywall');
    await expect(screen.getByTestId('paywall-notice')).toHaveText(CLOSED);
    await expect(screen.getByTestId('subscription-status')).toHaveText('not subscribed');
    await expectNothingBought(revenuecat, customer);
  });

  test('a fresh install that signs back in keeps the subscription', async ({
    agent,
    app,
    device,
    screen,
    revenuecat,
    customer,
  }) => {
    await openTestStoreDialog(agent, screen);
    await agent.act('tap Test valid purchase in the Test Store dialog');
    await expect(screen.getByTestId('subscription-status')).toHaveText('subscribed', { timeout: 30_000 });

    // The Test Store can't restore purchases on a fresh install; signing in as the same customer does.
    await app.clearState();
    await device.openLink(customerLink(customer));
    await expect(screen.getByTestId('customer-id')).toHaveText(customer, { timeout: 30_000 });
    await expect(screen.getByTestId('subscription-status')).toHaveText('subscribed');
    await expect(screen.getByTestId('subscribe')).toBeHidden();

    expect(await revenuecat.subscriptions(customer)).toHaveLength(1);
  });
});
