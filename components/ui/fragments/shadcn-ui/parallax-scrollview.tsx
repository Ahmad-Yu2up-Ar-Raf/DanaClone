import { View } from './view';
import { useBottomTabOverflow } from '@/hooks/useBottomTabOverflow';
import { useThemeColors } from '@/lib/useTheme';
import type { PropsWithChildren, ReactElement } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  headerHeight?: number;
  headerImage: ReactElement;
  className?: string;
}>;

export function ParallaxScrollView({
  children,
  headerHeight = 250,
  headerImage,
  className,
}: Props) {
  const { background } = useThemeColors();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <View className="flex-1">
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          className="overflow-hidden"
          style={[
            {
              backgroundColor: background,
              height: headerHeight,
            },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>

        <View className="flex-1 gap-4 overflow-hidden p-8" style={{ backgroundColor: background }}>
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
