import { StyleSheet } from 'react-native';

// The e2e design system's palette, 8px spacing scale and phone type scale.
export const colors = {
  black: '#000000',
  offWhite: '#f7f7f7',
  gray: '#b1b1b1',
  blue: '#1a5fff',
  navy: '#0032a8',
  green: '#64ff9d',
  mint: '#8af9ff',
  neutral300: '#c8c8c8',
  neutral400: '#b1b1b1',
  neutral500: '#8d8d8d',
  neutral600: '#686868',
  neutral700: '#434343',
  neutral800: '#1c1c1c',
  blue400: '#88b0ff',
  // neutral800 at 40%, the fill of a panel.
  panel: 'rgba(28, 28, 28, 0.4)',
};

// `space(1)` is 8px, `space(0.5)` 4px.
export const space = (step: number) => step * 8;

// Cassette, e2e's brand face, is licensed and not part of this repository, so text uses the
// platform's system font. JetBrains Mono (OFL) stands in for Cassette Mono and sets code.
export const fonts = {
  mono: 'JetBrains Mono',
};

export const type = StyleSheet.create({
  display: { fontSize: 48, lineHeight: 48, letterSpacing: -0.96 },
  h1: { fontSize: 39, lineHeight: 37, letterSpacing: -1.17 },
  h2: { fontSize: 34, lineHeight: 37, letterSpacing: -1.02 },
  h3: { fontSize: 29, lineHeight: 32 },
  h4: { fontSize: 25, lineHeight: 28 },
  h5: { fontSize: 22, lineHeight: 24 },
  bodyXl: { fontSize: 22, lineHeight: 31 },
  bodyL: { fontSize: 18, lineHeight: 25 },
  bodyM: { fontSize: 16, lineHeight: 22 },
  bodyS: { fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 14, letterSpacing: 0.48 },
  monoM: { fontFamily: fonts.mono, fontSize: 15, lineHeight: 18 },
  codeM: { fontFamily: fonts.mono, fontSize: 14, lineHeight: 24 },
  codeS: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 20 },
  numberL: { fontSize: 48, lineHeight: 53 },
});
