import { Text } from './text';
import { View } from './view';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/lib/useTheme';
import { Image as ExpoImage, ImageProps as ExpoImageProps, ImageSource } from 'expo-image';
import React, { forwardRef, useState } from 'react';
import { ActivityIndicator, DimensionValue } from 'react-native';

export interface ImageProps extends Omit<ExpoImageProps, 'style'> {
  variant?: 'rounded' | 'circle' | 'default';
  source: ImageSource;
  className?: string;
  containerClassName?: string;
  showLoadingIndicator?: boolean;
  showErrorFallback?: boolean;
  errorFallbackText?: string;
  loadingIndicatorSize?: 'small' | 'large';
  aspectRatio?: number;
  width?: DimensionValue;
  height?: DimensionValue;
}

export const Image = forwardRef<ExpoImage, ImageProps>(
  (
    {
      variant = 'rounded',
      source,
      className,
      containerClassName,
      showLoadingIndicator = true,
      showErrorFallback = true,
      errorFallbackText = 'Failed to load image',
      loadingIndicatorSize = 'small',
      aspectRatio,
      width,
      height,
      contentFit = 'cover',
      transition = 200,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { primary, muted } = useThemeColors();

    const getVariantClasses = () => {
      switch (variant) {
        case 'circle':
          return 'rounded-full';
        case 'rounded':
          return 'rounded-xl';
        default:
          return '';
      }
    };

    const getDimensionClasses = () => {
      if (width && height) return '';
      if (width) return 'h-full';
      if (height) return 'w-full';
      return 'w-full h-full';
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleLoadEnd = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    // Build container style properly
    const containerStyle = {
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      ...(aspectRatio ? { aspectRatio } : {}),
      backgroundColor: muted,
    };

    return (
      <View
        className={cn('relative overflow-hidden bg-card', getVariantClasses(), containerClassName)}
        style={containerStyle}>
        <ExpoImage
          ref={ref}
          source={source}
          className={cn(getDimensionClasses(), getVariantClasses(), className)}
          contentFit={contentFit}
          transition={transition}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          {...props}
        />

        {/* Loading indicator */}
        {isLoading && showLoadingIndicator && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator size={loadingIndicatorSize} color={primary} />
          </View>
        )}

        {/* Error fallback */}
        {hasError && showErrorFallback && (
          <View className="absolute inset-0 flex items-center justify-center p-2">
            <Text variant="small" className="text-center text-muted-foreground" numberOfLines={2}>
              {errorFallbackText}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

Image.displayName = 'Image';
