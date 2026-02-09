import React from 'react';
import { View } from '../../shadcn-ui/view';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import { Button } from '../../shadcn-ui/button';
import { Text } from '../../shadcn-ui/text';
import { Icon } from '../../shadcn-ui/icon';
import { Copy, LucideIcon, Plus } from 'lucide-react-native';
import { Image } from 'react-native';
import { cn } from '@/lib/utils';
import { useToast } from '../../shadcn-ui/toast';

export type componentPropsStatusCard = {
  className?: string;
  primaryColor?: 'default' | 'orange' | 'purple';
  title?: string;
  subTitle?: string;
  actionButton?: string;
  Logo?: string | any;
  actionFunction?: () => void;
  actionIcon?: LucideIcon;
  rigthHeader?: React.ReactNode;
};

export const THEME = {
  default: {
    text: 'text-primary',
    background: 'bg-primary',
    border: 'border-primary',
    fill: 'fill-primary',
    foreground: 'text-primary-foreground',
  },

  purple: {
    text: 'text-purple-500',
    background: 'bg-purple-500',
    border: 'border-purple-500',
    fill: 'fill-purple-500',
    foreground: 'text-purple-50',
  },
  orange: {
    text: 'text-orange-500',
    background: 'bg-orange-500',
    border: 'border-orange-500',
    fill: 'fill-orange-500',
    foreground: 'text-orange-50',
  },

  // ✅ REMOVED: dark theme object - No longer needed
};

const StatusCard = ({
  title = 'Rp 238.420',
  subTitle = 'Saldo Utama',
  primaryColor = 'default',
  actionFunction,
  actionIcon,
  actionButton = 'Top Up',
  rigthHeader,
  Logo = require('@/assets/images/brand/app/logo-white.png'),
  ...props
}: componentPropsStatusCard) => {
  const toast = useToast();
  return (
    <Card
      className={cn(
        'h-fit w-[22.4em] gap-5 rounded-b-none rounded-t-3xl p-3.5',
        THEME[primaryColor].background,
        THEME[primaryColor].text,
        props.className
      )}>
      <CardHeader className="w-full flex-row items-center justify-between p-0">
        <Image
          source={Logo}
          resizeMode="contain"
          className={cn(
            'size-10',
            Logo !== require('@/assets/images/brand/app/logo-white.png') && 'rounded-full bg-card'
          )}
          // style={LOGO_STYLE}
        />

        {rigthHeader}
      </CardHeader>
      <CardContent>
        <View className="w-full justify-center gap-4"></View>
      </CardContent>
      <CardFooter className="flex-row items-end p-0">
        <View className="flex-1 gap-0.5">
          <CardDescription
            className={cn('text-[15px] font-light tracking-wide', THEME[primaryColor].foreground)}>
            {subTitle}
          </CardDescription>
          <CardTitle className={cn('text-[31px] tracking-tighter', THEME[primaryColor].foreground)}>
            {title}
          </CardTitle>
        </View>

        {actionButton && (
          <Button
            onPress={() => {
              toast.success('Sukses!', 'Top up berhasil dilakukan');
            }}
            size={'sm'}
            variant="secondary"
            className={cn(
              'h-[38px] gap-1.5 px-[18px]'
              // THEME[primaryColor].background,
            )}>
            {actionButton == 'Top-up' && (
              <Icon as={Plus} size={18} className={cn(THEME[primaryColor].text)} />
            )}
            <Text className={cn('text-sm', THEME[primaryColor].text)}>{actionButton}</Text>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StatusCard;
