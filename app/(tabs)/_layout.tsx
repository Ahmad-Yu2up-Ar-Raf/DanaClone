import { Platform, ColorValue, ImageSourcePropType, DynamicColorIOS } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'nativewind';
import { UserMenu } from '@/components/ui/core/feature/auth/user-menu';
import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { Label, NativeTabs, VectorIcon, Icon as TabIcon } from 'expo-router/unstable-native-tabs';

import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { View } from '@/components/ui/fragments/shadcn-ui/view';

import React, { useMemo } from 'react';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import theme from '@/theme';

type VectorIconFamily = {
  getImageSource: (name: string, size: number, color: ColorValue) => Promise<ImageSourcePropType>;
};

const SCREEN_OPTIONS = {
  header: () => (
    <View
      pointerEvents="box-none"
      className="top-safe absolute left-0 right-0 flex-row justify-between px-4 py-2 web:mx-2">
      <ThemeToggle />
      <UserMenu />
    </View>
  ),
};

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();

  /**
   * ✅ FIXED: Direct THEME access tanpa useThemeColor
   * Ini lebih clean dan proper react to theme changes
   */
  const currentTheme = colorScheme === 'dark' ? 'dark' : 'light';
  const tintColor = THEME[currentTheme].primary;
  const backgroundColor = THEME[currentTheme].background;
  const foreground = THEME[currentTheme].foreground;
  const backgroundColorIndicator = THEME[currentTheme].muted;
  const inactiveTintColor = THEME[currentTheme].mutedForeground;

  const labelSelectedStyle = Platform.OS === 'ios' ? { color: tintColor } : { color: foreground };

  const nativeLabelStyle = useMemo(() => {
    const color =
      Platform.OS === 'ios' && isLiquidGlassAvailable()
        ? DynamicColorIOS({ light: theme.colorBlack, dark: theme.colorWhite })
        : inactiveTintColor;
    return { fontWeight: '800', fontSize: 15, color } as any;
  }, [inactiveTintColor]);

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <NativeTabs
        backgroundColor={backgroundColor}
        badgeBackgroundColor={tintColor}
        labelStyle={nativeLabelStyle}
        iconColor={
          Platform.OS === 'ios' && isLiquidGlassAvailable()
            ? DynamicColorIOS({
                light: theme.colorBlack,
                dark: theme.colorWhite,
              })
            : inactiveTintColor
        }
        tintColor={
          Platform.OS === 'ios'
            ? DynamicColorIOS({
                light: THEME.light.primary,
                dark: THEME.dark.primary,
              })
            : tintColor
        }
        labelVisibilityMode="labeled"
        indicatorColor={backgroundColorIndicator}
        disableTransparentOnScrollEdge={true}>
        <NativeTabs.Trigger name="(home)/index">
          {Platform.select({
            ios: <TabIcon sf="house.fill" />,
            android: (
              <TabIcon
                src={<VectorIcon family={MaterialCommunityIcons as VectorIconFamily} name="home" />}
                selectedColor={tintColor}
              />
            ),
          })}
          <Label selectedStyle={labelSelectedStyle}>Home</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="(news)/index">
          {Platform.select({
            ios: <TabIcon sf="newspaper.fill" />,
            android: (
              <TabIcon
                src={
                  <VectorIcon
                    family={MaterialCommunityIcons as VectorIconFamily}
                    name="newspaper"
                  />
                }
                selectedColor={tintColor}
              />
            ),
          })}
          <Label selectedStyle={labelSelectedStyle}>News</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button onPress={toggleColorScheme} size="icon" variant="ghost" className="rounded-full">
      {/* ✅ FIXED: Remove dark: class, let CSS variables handle it */}
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-6 text-foreground dark:text-primary-foreground" />
    </Button>
  );
}
