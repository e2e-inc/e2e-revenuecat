import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/logo';
import { colors, space, type } from '@/constants/theme';

const E2E_DOCS_URL = 'https://e2e.tester.army/docs';

export function SiteHeader() {
  return (
    <View style={styles.header}>
      <Logo height={24} />
      <Link href={E2E_DOCS_URL} accessibilityLabel="docs" style={[type.caption, styles.docs]}>
        [ docs ]
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: space(8),
    marginHorizontal: -space(3),
    paddingHorizontal: space(3),
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  docs: { color: colors.offWhite },
});
