import { View, Text } from 'react-native';
import React, { PropsWithChildren } from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { NAV_THEME } from '@/lib/theme';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useColorScheme } from 'nativewind';
import { ToastProvider } from '../ui/fragments/shadcn-ui/toast';

const Provider = ({ children }: PropsWithChildren) => {
  const { colorScheme } = useColorScheme();

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <ToastProvider>{children}</ToastProvider>
        <PortalHost />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Provider;
