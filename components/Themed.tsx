/**
 * COMPATIBILITY FILE: Themed.tsx
 *
 * File ini buat backward compatibility dengan components yang masih pake useThemeColor.
 * Tapi sekarang udah simplified dan proper integrate dengan Nativewind!
 */

import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';

/**
 * ✅ FIXED: useThemeColor hook
 *
 * Ini buat component yang masih pake pattern:
 * const color = useThemeColor({ light: 'xxx', dark: 'yyy' })
 *
 * Sekarang proper support Nativewind color scheme!
 */
export default function useThemeColor(
  props: { light?: string; dark?: string },
  colorName?: keyof typeof THEME.light
) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  // If specific light/dark props provided, use those
  if (props.light || props.dark) {
    return colorScheme === 'dark' ? props.dark : props.light;
  }

  // Otherwise use colorName from THEME
  if (colorName) {
    return THEME[theme][colorName];
  }

  return undefined;
}

/**
 * ✅ Alternative: Direct theme color getter
 */
export function getThemeColor(colorName: keyof typeof THEME.light) {
  // This is for cases where hook can't be used
  // Note: This won't react to theme changes, use in static contexts only
  return THEME.light[colorName]; // Default to light for static usage
}
