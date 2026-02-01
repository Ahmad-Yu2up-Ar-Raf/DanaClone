import { Text } from './text';
import { View } from './view';
import { cn } from '@/lib/utils';
import React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  textClassName?: string;
}

export function Badge({ children, variant = 'default', className, textClassName }: BadgeProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary';
      case 'destructive':
        return 'bg-destructive';
      case 'success':
        return 'bg-green-500';
      case 'outline':
        return 'bg-transparent border border-border';
      default:
        return 'bg-primary';
    }
  };

  const getTextVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'text-secondary-foreground';
      case 'destructive':
        return 'text-destructive-foreground';
      case 'success':
        return 'text-primary-foreground';
      case 'outline':
        return 'text-primary';
      default:
        return 'text-primary-foreground';
    }
  };

  return (
    <View
      className={cn(
        'items-center justify-center rounded-xl px-3 py-1.5',
        getVariantClasses(),
        className
      )}>
      <Text
        className={cn(
          'text-center text-[15px] font-medium',
          getTextVariantClasses(),
          textClassName
        )}>
        {children}
      </Text>
    </View>
  );
}
