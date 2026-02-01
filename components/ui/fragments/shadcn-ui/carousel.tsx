import { View } from './view';
import { useThemeColors } from '@/lib/useTheme';
import { cn } from '@/lib/utils';
import { BlurView } from 'expo-blur';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  itemWidth?: number;
  spacing?: number;
  className?: string;
  onIndexChange?: (index: number) => void;
}

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onPress?: (index: number) => void;
  className?: string;
}

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CarouselRef {
  goToSlide: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  getCurrentIndex: () => number;
}

export const Carousel = forwardRef<CarouselRef, CarouselProps>(
  (
    {
      children,
      autoPlay = false,
      autoPlayInterval = 3000,
      showIndicators = true,
      showArrows = false,
      loop = false,
      itemWidth,
      spacing = 0,
      className,
      onIndexChange,
    },
    ref
  ) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(screenWidth);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentIndexRef = useRef(currentIndex);

    useEffect(() => {
      currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    const slideWidth = itemWidth || containerWidth - spacing * 2;
    const snapToInterval = slideWidth + spacing;

    const clearTimers = useCallback(() => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    }, []);

    const scrollToIndex = useCallback(
      (index: number, animated: boolean = true) => {
        if (scrollViewRef.current && index >= 0 && index < children.length) {
          const scrollX = index * snapToInterval;

          requestAnimationFrame(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                x: scrollX,
                animated,
              });
            }
          });
        }
      },
      [snapToInterval, children.length]
    );

    const goToSlide = useCallback(
      (index: number) => {
        if (index >= 0 && index < children.length && index !== currentIndex) {
          setCurrentIndex(index);
          setIsUserInteracting(true);
          scrollToIndex(index);

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
          }
        }
      },
      [children.length, scrollToIndex, currentIndex]
    );

    const goToNext = useCallback(() => {
      const nextIndex = currentIndexRef.current + 1;
      const targetIndex =
        nextIndex < children.length ? nextIndex : loop ? 0 : currentIndexRef.current;
      if (targetIndex !== currentIndexRef.current) {
        setCurrentIndex(targetIndex);
        setIsUserInteracting(true);
        scrollToIndex(targetIndex);

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
      }
    }, [children.length, loop, scrollToIndex]);

    const goToPrevious = useCallback(() => {
      const prevIndex = currentIndexRef.current - 1;
      const targetIndex =
        prevIndex >= 0 ? prevIndex : loop ? children.length - 1 : currentIndexRef.current;
      if (targetIndex !== currentIndexRef.current) {
        setCurrentIndex(targetIndex);
        setIsUserInteracting(true);
        scrollToIndex(targetIndex);

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
      }
    }, [loop, children.length, scrollToIndex]);

    useImperativeHandle(
      ref,
      () => ({
        goToSlide,
        goToNext,
        goToPrevious,
        getCurrentIndex: () => currentIndex,
      }),
      [goToSlide, goToNext, goToPrevious, currentIndex]
    );

    const startAutoPlay = useCallback(() => {
      if (!autoPlay || children.length <= 1 || isUserInteracting) return;

      clearTimers();

      autoPlayTimerRef.current = setInterval(() => {
        const nextIndex = currentIndexRef.current + 1;
        const targetIndex =
          nextIndex >= children.length ? (loop ? 0 : currentIndexRef.current) : nextIndex;

        if (targetIndex !== currentIndexRef.current) {
          setCurrentIndex(targetIndex);
          scrollToIndex(targetIndex, true);
        }
      }, autoPlayInterval);
    }, [
      autoPlay,
      autoPlayInterval,
      children.length,
      loop,
      isUserInteracting,
      clearTimers,
      scrollToIndex,
    ]);

    const stopAutoPlay = useCallback(() => {
      clearTimers();
    }, [clearTimers]);

    useEffect(() => {
      if (autoPlay && !isUserInteracting) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }

      return stopAutoPlay;
    }, [autoPlay, isUserInteracting, startAutoPlay, stopAutoPlay]);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        onIndexChange?.(currentIndex);
      }, 50);

      return () => clearTimeout(timeoutId);
    }, [currentIndex, onIndexChange]);

    const handleScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isUserInteracting) {
          const scrollPosition = event.nativeEvent.contentOffset.x;
          const index = Math.round(scrollPosition / snapToInterval);

          if (index !== currentIndex && index >= 0 && index < children.length) {
            setCurrentIndex(index);
          }
        }
      },
      [currentIndex, snapToInterval, children.length, isUserInteracting]
    );

    const handleMomentumScrollEnd = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / snapToInterval);

        if (index >= 0 && index < children.length && index !== currentIndex) {
          setCurrentIndex(index);
        }

        if (autoPlay) {
          scrollTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
          }, 1000);
        }
      },
      [snapToInterval, children.length, autoPlay, currentIndex]
    );

    const handleTouchStart = useCallback(() => {
      setIsUserInteracting(true);
    }, []);

    const handleTouchEnd = useCallback(() => {
      // Let momentum scroll end handle it
    }, []);

    useEffect(() => {
      return () => {
        clearTimers();
      };
    }, [clearTimers]);

    const horizontalPan = Gesture.Pan()
      .onBegin(() => {})
      .onUpdate(() => {})
      .onEnd(() => {})
      .activeOffsetX([-10, 10])
      .activeOffsetY([-1000, 1000]);

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      if (width > 0) {
        setContainerWidth(width);
      }
    }, []);

    return (
      <View
        className={cn('w-full', className)}
        style={itemWidth ? { minWidth: itemWidth + spacing * 2 } : undefined}
        onLayout={handleLayout}>
        <View className="relative overflow-hidden">
          <GestureDetector gesture={horizontalPan}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled={!itemWidth}
              snapToInterval={itemWidth ? snapToInterval : undefined}
              snapToAlignment={itemWidth ? 'start' : 'center'}
              decelerationRate={itemWidth ? 'fast' : 'normal'}
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              scrollEventThrottle={16}
              bounces={false}
              contentContainerStyle={
                itemWidth
                  ? { paddingHorizontal: spacing }
                  : { width: children.length * containerWidth }
              }>
              {children.map((child, index) => (
                <View
                  key={index}
                  style={{
                    width: slideWidth,
                    marginRight: itemWidth ? spacing : 0,
                  }}>
                  {child}
                </View>
              ))}
            </ScrollView>
          </GestureDetector>

          {showArrows && children.length > 1 && (
            <>
              <View className="absolute left-1.5 top-1/2 z-10 -translate-y-3">
                <CarouselArrow
                  direction="left"
                  onPress={goToPrevious}
                  disabled={!loop && currentIndex === 0}
                />
              </View>
              <View className="absolute right-1.5 top-1/2 z-10 -translate-y-3">
                <CarouselArrow
                  direction="right"
                  onPress={goToNext}
                  disabled={!loop && currentIndex === children.length - 1}
                />
              </View>
            </>
          )}
        </View>

        {showIndicators && children.length > 1 && (
          <CarouselIndicators
            total={children.length}
            current={currentIndex}
            onPress={goToSlide}
            className="mt-3 self-center"
          />
        )}
      </View>
    );
  }
);

Carousel.displayName = 'Carousel';

export function CarouselContent({ children, className }: CarouselContentProps) {
  return <View className={className}>{children}</View>;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <View className={cn('min-h-[200px] rounded-xl border border-border bg-card p-4', className)}>
      {children}
    </View>
  );
}

export function CarouselIndicators({
  total,
  current,
  onPress,
  className,
}: CarouselIndicatorsProps) {
  const { primary, secondary } = useThemeColors();

  return (
    <View className={cn('flex-row items-center justify-center gap-1.5', className)}>
      {Array.from({ length: total }, (_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPress?.(index)}
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: index === current ? primary : secondary }}
        />
      ))}
    </View>
  );
}

export function CarouselArrow({
  direction,
  onPress,
  disabled = false,
  className,
}: CarouselArrowProps) {
  const { primary } = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={cn('h-6 w-6 overflow-hidden rounded-full', disabled && 'opacity-30', className)}
      activeOpacity={0.7}>
      <BlurView
        tint="systemChromeMaterial"
        intensity={100}
        className="flex-1 items-center justify-center rounded-full">
        {direction === 'left' ? (
          <ChevronLeft size={20} color={primary} />
        ) : (
          <ChevronRight size={20} color={primary} />
        )}
      </BlurView>
    </TouchableOpacity>
  );
}
