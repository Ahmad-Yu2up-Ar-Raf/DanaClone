// app/(tabs)/(home)/_layout.tsx - OPTION A (RECOMMENDED)
import { View } from 'react-native';
import React from 'react';
import { router, Stack, Tabs } from 'expo-router';

export default function ActivityLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={SCREEN_OPTIONS} />
        {/* Tambahkan screen lain di sini jika ada nested routes */}
      </Stack>
    </>
  );
}

const SCREEN_OPTIONS = {
  header: () => (
    <View className="left-0 right-0 top-0 h-fit flex-row items-center justify-between bg-primary px-2 pb-0 pl-3 pr-5 pt-10">
      <BackTabs />
      <Text className="text-lg font-medium text-primary-foreground">Aktivitas Saya</Text>

      <Share />
    </View>
  ),
  // headerTintColor: THEME.light.primaryForeground,
  // headerStyle: {
  //   backgroundColor: THEME.light.primary,
  // },
};

import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';

import { ChevronLeft, Download } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';

export function BackTabs() {
  return (
    <Button
      variant={'link'}
      className="text-primary-foreground"
      size={'icon'}
      onPress={() => router.back()}>
      <Icon as={ChevronLeft} size={24} className="text-primary-foreground" />
    </Button>
  );
}
export function Share() {
  return (
    <Button
      variant={'secondary'}
      size={'icon'}
      className="size-7 bg-primary-foreground/80 active:bg-primary-foreground">
      <Icon as={Download} color={THEME.light.primary} size={17} />
    </Button>
  );
}
