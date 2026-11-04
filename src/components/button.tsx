import { Pressable, type PressableProps, StyleSheet, Text } from 'react-native';

import { colors, space, type } from '@/constants/theme';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: 'primary' | 'outline' | 'light';
};

// e2e buttons change no colour when pressed: they dim instead.
export function Button({ label, variant = 'primary', disabled, accessibilityState, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      accessibilityState={{ ...accessibilityState, disabled: Boolean(disabled) }}
      disabled={disabled}
      style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={[type.monoM, variant === 'light' ? styles.labelOnLight : styles.label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { height: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space(2) },
  primary: { backgroundColor: colors.blue },
  outline: { borderWidth: 1, borderColor: colors.neutral700 },
  light: { backgroundColor: colors.offWhite },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  label: { color: colors.offWhite },
  labelOnLight: { color: colors.neutral800 },
});
