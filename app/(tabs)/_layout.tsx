// app/(tabs)/_layout.tsx - FIXED: Proper Keyboard Avoidance

import { Platform, ColorValue, ImageSourcePropType, Keyboard } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { THEME } from '@/lib/theme';
import { Label, NativeTabs, VectorIcon, Icon as TabIcon } from 'expo-router/unstable-native-tabs';
import { View } from '@/components/ui/fragments/shadcn-ui/view';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { useRouter, usePathname, Stack } from 'expo-router';
import React, { useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type VectorIconFamily = {
  getImageSource: (name: string, size: number, color: ColorValue) => Promise<ImageSourcePropType>;
};

// ✅ FLOATING PAY BUTTON - Fixed Keyboard Handling
function FloatingPayButton() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isActive = pathname.includes('(pay)');

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // ✅ Animated values
  const animatedBottom = useSharedValue(insets.bottom + 16);
  const animatedOpacity = useSharedValue(1);
  const animatedScale = useSharedValue(1);

  // ✅ Listen to keyboard events
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setIsKeyboardVisible(true);

      // ✅ OPTION 1: Hide button when keyboard appears
      // animatedOpacity.value = withTiming(0, {
      //   duration: 200,
      //   easing: Easing.out(Easing.ease),
      // });
      // animatedScale.value = withTiming(0.8, {
      //   duration: 200,
      //   easing: Easing.out(Easing.ease),
      // });

      // ✅ OPTION 2: Keep button just above tab bar (not too high)
      // Uncomment this if you prefer button to stay visible:
      // animatedBottom.value = withTiming(80, {
      //   duration: event.duration || 250,
      //   easing: Easing.out(Easing.exp),
      // });
    });

    const hideSubscription = Keyboard.addListener(hideEvent, (event) => {
      setIsKeyboardVisible(false);

      // ✅ Show button when keyboard hides
      // animatedOpacity.value = withTiming(1, {
      //   duration: 200,
      //   easing: Easing.out(Easing.ease),
      // });
      // animatedScale.value = withTiming(1, {
      //   duration: 200,
      //   easing: Easing.out(Easing.ease),
      // });

      // ✅ Return to original position
      animatedBottom.value = withTiming(insets.bottom + 16, {
        duration: event.duration || 250,
        easing: Easing.out(Easing.exp),
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom]);

  // ✅ Update bottom position when safe area changes
  useEffect(() => {
    if (!isKeyboardVisible) {
      animatedBottom.value = insets.bottom + 18;
    }
  }, [insets.bottom, isKeyboardVisible]);

  const handlePress = () => {
    Keyboard.dismiss();
    router.push('/(tabs)/(pay)');
  };

  // ✅ Animated style with opacity and scale
  const animatedStyle = useAnimatedStyle(() => ({
    bottom: animatedBottom.value,
    opacity: animatedOpacity.value,
    transform: [{ translateX: -40 }, { scale: animatedScale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: '50%',
          zIndex: 1000,
        },
        animatedStyle,
      ]}
      pointerEvents={isKeyboardVisible ? 'none' : 'auto'} // ✅ Disable interaction when hidden
    >
      <Pressable onPress={handlePress}>
        <Button
          className="size-20 flex-col items-center justify-center gap-1 rounded-full border-4 border-card"
          style={{
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isActive ? 0.4 : 0.3,
                shadowRadius: 8,
              },
              android: {
                elevation: isActive ? 12 : 8,
              },
            }),
          }}>
          <MaterialIcons name="qr-code-scanner" size={32} color="white" />
          <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>Bayar</Text>
        </Button>
      </Pressable>
    </Animated.View>
  );
}

interface NativeTabsConfig extends React.PropsWithChildren {
  backgroundColor: string;
  badgeBackgroundColor: string;
  labelStyle: {
    fontWeight: '700';
    fontSize: number;
    color: string;
  };
  iconColor: string;
  tintColor: string;
  labelVisibilityMode: 'labeled';
  indicatorColor: string;
  disableTransparentOnScrollEdge: boolean;
}

export default function TabsLayout() {
  const pathname = usePathname();
  const tintColor = THEME.light.primary;
  const backgroundColor = THEME.light.card;
  const inactiveTintColor = THEME.light.mutedForeground;

  const labelSelectedStyle = useMemo(() => ({ color: tintColor }), [tintColor]);

  const nativeLabelStyle = useMemo(
    () => ({
      fontWeight: '700' as const,
      fontSize: 12,
      color: inactiveTintColor,
    }),
    [inactiveTintColor]
  );

  const tabBarConfig = useMemo(
    () => ({
      paddingTop: 8,
      height: 70,

      backgroundColor,
      ...Platform.select({
        android: { elevation: 8 },
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
      }),
    }),
    [backgroundColor]
  );

  // ✅ Hide tabs on activity route
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const shouldShowTabs = !isKeyboardVisible;

  // ✅ Listen to keyboard events
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true); // ✅ Hide background
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false); // ✅ Show background
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <>
      <Stack.Screen key={'header'} options={{ headerShown: false }} />

      <View style={{ flex: 1 }}>
        <NativeTabs
          {...({
            backgroundColor,
            badgeBackgroundColor: tintColor,
            labelStyle: nativeLabelStyle,
            iconColor: inactiveTintColor,
            tintColor,
            labelVisibilityMode: 'labeled',
            indicatorColor: THEME.light.muted,
            disableTransparentOnScrollEdge: true,
            tabBarStyle: tabBarConfig,
          } as NativeTabsConfig & { tabBarStyle: typeof tabBarConfig })}>
          <NativeTabs.Trigger name="(home)">
            <TabIcon
              src={<VectorIcon family={MaterialCommunityIcons as VectorIconFamily} name="home" />}
              selectedColor={tintColor}
            />
            <Label selectedStyle={labelSelectedStyle}>Beranda</Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="(activity)">
            <TabIcon
              src={
                <VectorIcon family={MaterialCommunityIcons as VectorIconFamily} name="history" />
              }
              selectedColor={tintColor}
            />
            <Label selectedStyle={labelSelectedStyle}>Aktifitas</Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="(pay)">
            <Label hidden>.</Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="(wallet)">
            <TabIcon
              src={<VectorIcon family={MaterialCommunityIcons as VectorIconFamily} name="wallet" />}
              selectedColor={tintColor}
            />
            <Label selectedStyle={labelSelectedStyle}>Dompet</Label>
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name="(profile)">
            <TabIcon
              src={
                <VectorIcon family={MaterialCommunityIcons as VectorIconFamily} name="account" />
              }
              selectedColor={tintColor}
            />
            <Label selectedStyle={labelSelectedStyle}>Saya</Label>
          </NativeTabs.Trigger>
        </NativeTabs>

        {/* ✅ Floating button with proper keyboard handling */}
        <FloatingPayButton />
      </View>
    </>
  );
}
