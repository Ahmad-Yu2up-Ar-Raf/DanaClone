import { cn } from '@/lib/utils';
import { Icon } from '../../shadcn-ui/icon';
import { Text } from '../../shadcn-ui/text';
import type { LucideIcon } from 'lucide-react-native';
import React, { forwardRef, ReactElement, useState } from 'react';
import {
  Pressable,
  TextInput as TextInputB,
  TextInputProps,
  View,
  TextStyle,
  ViewStyle,
  Platform,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Input as TextInput } from '../../shadcn-ui/input';
import { Textarea } from '../../shadcn-ui/textarea';
import { Label } from '../../shadcn-ui/label';

export interface GroupedInputProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  title?: string;
  titleStyle?: TextStyle;
}

export const GroupedInput = ({
  children,
  containerStyle,
  title,
  titleStyle,
}: GroupedInputProps) => {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const token = (k: keyof typeof THEME.light) => (THEME as any)[scheme][k];
  const border = token('border');
  const background = token('card');

  const childrenArray = React.Children.toArray(children);

  const errors = childrenArray
    .filter(
      (child): child is ReactElement<any> =>
        React.isValidElement(child) && !!(child.props as any).error
    )
    .map((child) => child.props.error);

  return (
    <View style={containerStyle}>
      {!!title && (
        <Text variant="large" className="mb-2 ml-2" style={titleStyle}>
          {title}
        </Text>
      )}

      <View className="gap-5">
        {childrenArray.map((child, index) => (
          <View
            key={index}
            className={cn(
              'justify-center'

              // index !== childrenArray.length - 1 ? 'border-b border-border' : ''
            )}>
            {child}
          </View>
        ))}
      </View>

      {errors.length > 0 && (
        <View className="sr-only mt-[6px]">
          {errors.map((error, i) => (
            <Text
              key={i}
              className={cn('text-sm text-destructive', i === 0 ? 'ml-2 mt-0' : 'ml-2 mt-[4px]')}>
              {error}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export interface GroupedInputItemProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  rightComponent?: React.ReactNode | (() => React.ReactNode);
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  disabled?: boolean;
  type?: 'input' | 'textarea';
  rows?: number;
  showError?: boolean;
}

export const GroupedInputItem = forwardRef<TextInputB, GroupedInputItemProps>(
  (
    {
      showError = true,
      label,
      error,
      icon,
      rightComponent,
      inputStyle,
      labelStyle,
      errorStyle,
      disabled,
      type = 'input',
      rows = 3,
      onFocus,
      onBlur,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const { colorScheme } = useColorScheme();
    const scheme = colorScheme === 'dark' ? 'dark' : 'light';
    const token = (k: keyof typeof THEME.light) => (THEME as any)[scheme][k];

    const primary = token('primary');

    const isTextarea = type === 'textarea';

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const renderRightComponent = () => {
      if (!rightComponent) return null;
      return typeof rightComponent === 'function' ? rightComponent() : rightComponent;
    };

    return (
      <Pressable
        onPress={() => ref && 'current' in ref && ref.current?.focus()}
        disabled={disabled}
        className={cn(disabled ? 'opacity-60' : 'opacity-100')}>
        <View className={cn('flex flex-col gap-1.5')}>
          {isTextarea ? (
            <>
              {(icon || label || rightComponent) && (
                <View className="mb-2 flex-row items-center gap-2">
                  <View className="sr-only flex-1 flex-row items-center gap-2" pointerEvents="none">
                    {icon && (
                      <Icon
                        as={icon}
                        size={16}
                        className={cn(error ? 'text-destructive' : 'text-muted-foreground')}
                      />
                    )}
                    {label && (
                      <Text
                        variant="small"
                        className={cn(error ? 'text-destructive' : 'text-muted-foreground')}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {label}
                      </Text>
                    )}
                  </View>
                  {renderRightComponent()}
                </View>
              )}

              <Textarea
                ref={ref}
                placeholder={placeholder}
                editable={!disabled}
                selectionColor={primary as any}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={cn(
                  'border-0',
                  error && 'border-destructive text-destructive placeholder:text-destructive'
                )}
                {...props}
              />
            </>
          ) : (
            <View
              className={cn(
                'flex-1 flex-row items-center gap-2 rounded-xl border border-muted-foreground/50',
                error && 'border-destructive text-destructive'
              )}>
              <View className="sr-only flex-row items-center gap-2" pointerEvents="none">
                {icon && (
                  <Icon
                    as={icon}
                    size={16}
                    className={cn(error ? 'text-destructive' : 'text-muted-foreground')}
                  />
                )}
                {label && (
                  <Text
                    variant="small"
                    className={cn(error ? 'text-destructive' : 'text-muted-foreground')}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {label}
                  </Text>
                )}
              </View>

              <View className="relative flex-1">
                {/* <Label
                  className={cn(
                    'peer-focus:secondary peer-focus:dark:secondary absolute start-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-background px-2 text-lg capitalize text-muted-foreground duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-foreground dark:text-muted-foreground rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',

                    error && 'border-destructive text-destructive dark:text-destructive'
                  )}
                  nativeID={label}
                  htmlFor={label}>
                  {label}
                </Label> */}
                <TextInput
                  nativeID={label}
                  // error={error}
                  ref={ref}
                  placeholder={placeholder}
                  editable={!disabled}
                  selectionColor={primary as any}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={cn(error && 'placeholder:text-destructive', 'text-destructive')}
                  {...props}
                />
              </View>
              {renderRightComponent()}
            </View>
          )}
          {error && showError && (
            <Text className="mt-1 text-sm text-destructive dark:text-destructive">* {error}</Text>
          )}
        </View>
      </Pressable>
    );
  }
);
