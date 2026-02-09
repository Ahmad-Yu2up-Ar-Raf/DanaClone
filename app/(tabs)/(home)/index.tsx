import * as React from 'react';
import { View } from '@/components/ui/fragments/shadcn-ui/view';
import StatusCard, {
  componentPropsStatusCard,
} from '@/components/ui/fragments/custom-ui/card/status-card';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { CircleFadingArrowUp, HandCoins, Plus, Ticket, Wallet } from 'lucide-react-native';
import MenuCard from '@/components/ui/fragments/custom-ui/card/menu-card';

import { Dimensions, Keyboard, Platform, ScrollView, StyleSheet } from 'react-native';

import HistoryCard from '@/components/ui/fragments/custom-ui/card/history-card';
import { cn } from '@/lib/utils';

import Carousel from 'react-native-reanimated-carousel';
import { Image } from '@/components/ui/fragments/shadcn-ui/image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

export const STATUS_DUMMY: componentPropsStatusCard[] = [
  {
    className: 'status-card--primary',
    primaryColor: 'default',
    actionIcon: Plus,
    actionButton: 'Top-up',
    rigthHeader: (
      <View className="flex flex-row items-center gap-2">
        <Text
          className={cn('text-sm font-medium leading-none tracking-tight text-primary-foreground')}>
          5213 123 5678
        </Text>
        <Button
          variant="secondary"
          size={'sm'}
          className="relative flex h-fit w-fit justify-center rounded-[4px] p-[4.5px]">
          <View
            className={cn(
              'relative -left-0.5 top-0.5 z-20 size-2.5 rounded-[3px] border border-background bg-primary fill-primary'
            )}
            style={{
              backgroundColor: '#108bea',
            }}
          />
          <View
            className={cn(
              'absolute bottom-[7px] right-[3.5px] z-10 size-2 rounded-[2px] bg-primary fill-primary'
            )}
            style={{
              backgroundColor: '#108bea',
            }}
          />
        </Button>
      </View>
    ),
  },
  {
    className: 'status-card--primary',
    primaryColor: 'orange',
    title: 'Voucher  ',
    subTitle: 'Cashback & Voucher',
    actionButton: 'Lihat Voucher',
    Logo: require('@/assets/images/icon/icon-voucer.png'),
    rigthHeader: (
      <View className="flex flex-row items-center gap-2">
        <Text
          className={cn('text-sm font-medium leading-none tracking-tight text-primary-foreground')}>
          120 Vouchers
        </Text>
        <Button
          variant="secondary"
          size={'sm'}
          className="relative flex h-fit w-fit justify-center rounded-[4px] p-[4.5px]">
          <Icon as={Ticket} size={12} className="fill-orange-500 text-orange-300" />
        </Button>
      </View>
    ),
  },
  {
    className: 'status-card--primary',
    primaryColor: 'purple',
    title: 'DompetKu',
    subTitle: 'Dompet Saya',
    actionButton: 'Lihat Dompet',
    Logo: require('@/assets/images/icon/wallet.png'),
    rigthHeader: (
      <View className="flex flex-row items-center gap-2">
        <Text
          className={cn('text-sm font-medium leading-none tracking-tight text-primary-foreground')}>
          2 Dompet
        </Text>
        <Button
          variant="secondary"
          size={'sm'}
          className="relative flex h-fit w-fit justify-center rounded-[4px] p-[4.5px]">
          <Icon as={Wallet} size={12} className="fill-purple-500 text-purple-300" />
        </Button>
      </View>
    ),
  },
];

// 🔥 FIX: Use require() for local assets, NOT string paths!
const ads = [
  require('@/assets/images/ads/ads-1.png'),
  require('@/assets/images/ads/ads-2.png'),
  require('@/assets/images/ads/ads-3.png'),
];

export default function Screen() {
  const width = Dimensions.get('window').width;

  const CARD_WIDTH = width * 1;
  const ADS_HEIGHT = width / 2.2;

  return (
    <Wrapper>
      <View className="h-3" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        {STATUS_DUMMY.map((_, index) => (
          <StatusCard
            key={index}
            title={STATUS_DUMMY[index].title}
            subTitle={STATUS_DUMMY[index].subTitle}
            primaryColor={STATUS_DUMMY[index].primaryColor}
            actionButton={STATUS_DUMMY[index].actionButton}
            Logo={STATUS_DUMMY[index].Logo}
            rigthHeader={STATUS_DUMMY[index].rigthHeader}
            className={cn(
              'mr-1.5',
              index == STATUS_DUMMY.length - 1 && 'mr-8',
              STATUS_DUMMY[index].className
            )}
          />
        ))}
      </ScrollView>

      <View className="flex-1 items-center gap-5 px-4">
        <View className="h-[3em] max-w-sm flex-row items-center justify-center gap-x-2 bg-background px-1 py-0">
          <Button className="h-full w-1/2 gap-2 shadow-sm">
            <Icon as={CircleFadingArrowUp} size={22} className="text-primary-foreground" />
            <Text className="text-[15.5px] font-semibold">Kirim</Text>
          </Button>
          <Button variant={'outline'} className="h-full w-1/2 gap-2">
            <Icon as={HandCoins} size={22} />
            <Text className="text-[15.5px] font-semibold">Minta</Text>
          </Button>
        </View>
        <MenuCard />

        {/* 🔥 FIXED CAROUSEL - Direct pass require() result */}
        <Carousel
          width={CARD_WIDTH}
          height={ADS_HEIGHT}
          style={{ width }}
          loop
          autoPlay
          autoPlayInterval={2900}
          scrollAnimationDuration={800}
          data={ads}
          renderItem={({ item }) => (
            <View className="px-4">
              <Image
                source={item}
                width={width - 32}
                height={ADS_HEIGHT}
                contentFit="cover"
                variant="rounded"
                showLoadingIndicator
                showErrorFallback
                errorFallbackText="Failed to load ad"
              />
            </View>
          )}
        />

        <HistoryCard />
      </View>
      <Text
        className="m-auto mt-10 text-center text-sm text-muted-foreground"
        style={{ maxWidth: 360 }}>
        Dana Indonesia terdaftar serta diawasi oleh{' '}
        <Text className="font-semibold text-muted-foreground" variant={'small'}>
          Bank Indonesia
        </Text>{' '}
        dan{' '}
        <Text className="font-semibold text-muted-foreground" variant={'small'}>
          Komdigi
        </Text>
      </Text>
    </Wrapper>
  );
}

// ✅ FIXED WRAPPER - Background Always at Bottom of Viewport
// components/Wrapper.tsx atau di index.tsx - SIMPLE VERSION

export function Wrapper({
  children,
  showBackground = true,
  className,
  edges = ['top', 'bottom'],
}: {
  children: React.ReactNode;
  className?: string;
  showBackground?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();

  // ✅ Track keyboard visibility
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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

  const backgroundHeight = height / 2.98;
  const tabBarHeight = insets.bottom;

  return (
    <SafeAreaView edges={edges} style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View className={cn('flex h-full flex-1 flex-col gap-5', className)}>{children}</View>

        <View style={{ height: backgroundHeight / 1.5 }} />

        {/* ✅ CONDITIONAL RENDERING - Hide when keyboard visible */}
        {!isKeyboardVisible && showBackground && (
          <View
            style={[
              styles.backgroundContainer,
              {
                bottom: 0,
                height: backgroundHeight,
                width: width,
              },
            ]}
            pointerEvents="none">
            <Image
              source={require('@/assets/images/background/background-1.png')}
              width={width}
              height={backgroundHeight}
              contentFit="contain"
              showLoadingIndicator={false}
              showErrorFallback={false}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 64,
  },
  backgroundContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: -1,
  },
});
