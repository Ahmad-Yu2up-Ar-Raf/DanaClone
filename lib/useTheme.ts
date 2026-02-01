import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';

/**
 * ✅ MAIN THEME HOOK
 *
 * Primary hook buat theme controls dan checks
 */
export function useTheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  return {
    // Current theme mode
    theme: colorScheme ?? 'light',
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',

    // Theme controls
    setTheme: setColorScheme,
    toggleTheme: toggleColorScheme,

    // Utility setters
    setLight: () => setColorScheme('light'),
    setDark: () => setColorScheme('dark'),
    setSystem: () => setColorScheme('system'),
  };
}

/**
 * ✅ HOOK BUAT AKSES THEME MODE ONLY
 */
export function useThemeMode() {
  const { colorScheme } = useColorScheme();
  return colorScheme ?? 'light';
}

/**
 * ✅ HOOK BUAT CHECK DARK MODE
 */
export function useIsDark() {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark';
}

/**
 * ✅ LEGACY SUPPORT: useThemeColors
 *
 * Kept for backward compatibility dengan components yang belum di-migrate.
 * Hook ini sekarang proper react ke theme changes!
 *
 * RECOMMENDED: Pake className instead untuk new code!
 * <View className="bg-background" /> is better than:
 * const { background } = useThemeColors();
 * <View style={{ backgroundColor: background }} />
 */
export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  // Helper function buat akses token
  const token = (key: keyof typeof THEME.light) => THEME[scheme][key];

  return {
    // Basic colors
    background: token('background'),
    foreground: token('foreground'),

    // Card colors
    card: token('card'),
    cardForeground: token('cardForeground'),

    // Primary colors
    primary: token('primary'),
    primaryForeground: token('primaryForeground'),

    // Secondary colors
    secondary: token('secondary'),
    secondaryForeground: token('secondaryForeground'),

    // Muted colors
    muted: token('muted'),
    mutedForeground: token('mutedForeground'),

    // Accent colors
    accent: token('accent'),
    accentForeground: token('accentForeground'),

    // Destructive colors
    destructive: token('destructive'),
    destructiveForeground: token('destructiveForeground'),

    // Border & Input
    border: token('border'),
    input: token('input'),
    ring: token('ring'),

    // Popover
    popover: token('popover'),
    popoverForeground: token('popoverForeground'),

    // Chart colors
    chart1: token('chart1'),
    chart2: token('chart2'),
    chart3: token('chart3'),
    chart4: token('chart4'),
    chart5: token('chart5'),

    // Aliases biar lebih gampang
    textColor: token('foreground'),
    mutedColor: token('muted'),
    borderColor: token('border'),
    backgroundColor: token('background'),
  };
}

/**
 * ✅ LEGACY SUPPORT: useThemeColor
 *
 * Hook simplified buat dapetin satu warna aja kalo butuh
 * Usage: const primary = useThemeColor('primary');
 */
export function useThemeColor(key: keyof typeof THEME.light) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  return THEME[scheme][key];
}

/**
 * ✅ HELPER: Get current color scheme
 */
export function useCurrentColorScheme() {
  const { colorScheme } = useColorScheme();
  return colorScheme ?? 'light';
}

// Export default as useTheme for convenience
export default useTheme;
