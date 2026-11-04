import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

// The official e2e logotype, drawn from the design system's rectangles.
const VIEW_BOX = { width: 407, height: 142 };
const RECTS = [
  [155.91, 0, 90.24, 19.06],
  [26.94, 24.48, 82.4, 19.09],
  [145.32, 24.48, 35.83, 19.09],
  [220.91, 24.48, 35.84, 19.09],
  [297.82, 24.48, 82.43, 19.09],
  [10.59, 49.04, 32.69, 19.05],
  [92.79, 49.04, 33.14, 19.05],
  [210.32, 49.04, 35.83, 19.05],
  [281.46, 49.04, 32.69, 19.05],
  [363.66, 49.04, 33.18, 19.05],
  [0, 73.54, 135.96, 19.08],
  [185.09, 73.54, 35.8, 19.08],
  [270.88, 73.54, 135.97, 19.08],
  [4.13, 98.07, 32.68, 19.05],
  [158.07, 98.04, 35.83, 19.08],
  [274.98, 98.07, 32.68, 19.05],
  [26.94, 122.57, 82.4, 19.05],
  [145.32, 122.57, 113.33, 19.05],
  [297.82, 122.57, 82.43, 19.05],
] as const;

export function Logo({
  height = 24,
  color = colors.offWhite,
  label = 'e2e',
  style,
}: {
  height?: number;
  color?: string;
  /** Accessible name. Pass "" when visible text beside the logo already names it. */
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = height / VIEW_BOX.height;
  return (
    <View
      accessible={Boolean(label)}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label || undefined}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
      style={[{ width: VIEW_BOX.width * scale, height }, style]}>
      {RECTS.map(([x, y, width, h]) => (
        <View
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: x * scale,
            top: y * scale,
            width: width * scale,
            height: h * scale,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}
