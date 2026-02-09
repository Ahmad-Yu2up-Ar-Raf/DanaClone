import { Icon } from './icon';
import { Text } from './text';
import { View } from './view';

import { THEME } from '@/lib/theme';

import { Search, X } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  loading?: boolean;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: TextStyle | TextStyle[];
  debounceMs?: number;
  iconColor?: string;
  containerClassName?: string;
}

export function SearchBar({
  loading = false,
  onSearch,
  iconColor,
  onClear,
  showClearButton = true,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  debounceMs = 300,
  placeholder = 'Search...',
  value,
  containerClassName,
  onChangeText,
  ...props
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value || '');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Theme colors
  const cardColor = THEME.light.card;
  const textColor = THEME.light.foreground;
  const muted = THEME.light.muted;
  const icon = THEME.light.accent;

  // Handle text change with debouncing
  const handleTextChange = useCallback(
    (text: string) => {
      setInternalValue(text);
      onChangeText?.(text);

      if (onSearch && debounceMs > 0) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        (debounceRef.current as any) = setTimeout(() => {
          onSearch(text);
        }, debounceMs);
      } else if (onSearch) {
        onSearch(text);
      }
    },
    [onChangeText, onSearch, debounceMs]
  );

  // Handle clear button press
  const handleClear = useCallback(() => {
    setInternalValue('');
    onChangeText?.('');
    onClear?.();
    onSearch?.('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, [onChangeText, onClear, onSearch]);

  // Get container style based on variant and size
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cardColor,
    height: 59,
    paddingHorizontal: 16,
    borderRadius: 12,
  };

  const baseInputStyle = {
    flex: 1,
    fontSize: 16,
    color: textColor,
    marginHorizontal: 8,
  };

  const displayValue = value !== undefined ? value : internalValue;
  const showClear = showClearButton && displayValue.length > 0;
  const [isFocused, setIsFocused] = useState(false);
  const toggleKeyboard = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    } else {
      inputRef && 'current' in inputRef && inputRef.current?.focus();
    }
  };
  const handleFocus = (e: any) => {
    setIsFocused(true);

    toggleKeyboard();
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
  };
  return (
    <Button
      variant={'outline'}
      className={cn(
        'b h-9 w-full items-center rounded-lg border-2 border-primary/40 bg-primary-foreground px-1 shadow-lg outline-primary transition-all duration-300 ease-out',
        containerClassName,
        isFocused ? '' : 'border-border'
      )}>
      {/* Left Icon */}
      {leftIcon || <Icon as={Search} size={16} className={cn('text-primary', iconColor)} />}

      {/* Text Input */}
      <Input
        className={cn(
          'max-w-xs bg-transparent px-1 text-sm text-accent-foreground transition-all duration-300 ease-out'
        )}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // style={[baseInputStyle, inputStyle]}
        placeholder={placeholder}
        value={displayValue}
        onChangeText={handleTextChange}
        {...props}
      />

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="small" color={muted} style={{ marginRight: 4 }} />}

      {/* Clear Button */}
      {/* {showClear && !loading && (
        <TouchableOpacity
          onPress={handleClear}
          style={{
            backgroundColor: icon,
            padding: 4,
            borderRadius: 16,
            opacity: 0.6,
          }}
          activeOpacity={0.7}>
          <Icon as={X} size={16} color={cardColor} strokeWidth={2} />
        </TouchableOpacity>
      )} */}

      {/* Right Icon */}
      {/* {rightIcon && !showClear && !loading && rightIcon} */}
    </Button>
  );
}

// SearchBar with suggestions dropdown
interface SearchBarWithSuggestionsProps extends SearchBarProps {
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  maxSuggestions?: number;
  showSuggestions?: boolean;
}

export function SearchBarWithSuggestions({
  suggestions = [],
  onSuggestionPress,
  maxSuggestions = 5,
  showSuggestions = true,
  containerStyle,
  ...searchBarProps
}: SearchBarWithSuggestionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardColor = THEME.light.card;
  const borderColor = THEME.light.border;

  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.toLowerCase().includes((searchBarProps.value || '').toLowerCase())
    )
    .slice(0, maxSuggestions);

  const shouldShowSuggestions =
    showSuggestions &&
    isExpanded &&
    filteredSuggestions.length > 0 &&
    (searchBarProps.value || '').length > 0;

  const handleSuggestionPress = (suggestion: string) => {
    onSuggestionPress?.(suggestion);
    setIsExpanded(false);
  };

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      <SearchBar
        {...searchBarProps}
        onFocus={(e) => {
          setIsExpanded(true);
          searchBarProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          // Delay hiding suggestions to allow for suggestion tap
          setTimeout(() => setIsExpanded(false), 150);
          searchBarProps.onBlur?.(e);
        }}
      />

      {/* Suggestions Dropdown */}
      {/* {shouldShowSuggestions && (
        <View
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: cardColor,
            marginTop: 8,
            borderRadius: 12,
            maxHeight: 200,
            zIndex: 999,
          }}>
          {filteredSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={`${suggestion}-${index}`}
              onPress={() => handleSuggestionPress(suggestion)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: index < filteredSuggestions.length - 1 ? 0.6 : 0,
                borderBottomColor: borderColor,
              }}
              activeOpacity={0.7}>
              <Text>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}
    </View>
  );
}
