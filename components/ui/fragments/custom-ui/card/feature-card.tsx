import { Image } from 'react-native';
import React, { SVGProps } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import { Button, buttonTextVariants, buttonVariants } from '../../shadcn-ui/button';

import {
  ChevronRight,
  Lock,
  LogOut,
  LogOutIcon,
  LucideIcon,
  Receipt,
  ScrollText,
  Search,
  Settings,
  Settings2,
  Wallet,
} from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { View } from '../../shadcn-ui/view';
import { Text } from '../../shadcn-ui/text';

import { Separator } from '../../shadcn-ui/separator';
import { Icon } from '../../shadcn-ui/icon';
import { Href, router } from 'expo-router';
import { batasiHuruf } from '@/hooks/useWord';
import { useAuth } from '@clerk/clerk-expo';
import { useToast } from '../../shadcn-ui/toast';

interface FeatureCardProps {
  label: string;
  deskripcion?: string;
  href?: Href;
  Icon: LucideIcon;
  className?: string;
  onpress?: () => void;
}

const FeatureLink: FeatureCardProps[] = [
  {
    label: 'Daftar Tagihan ',
    Icon: Receipt,
    href: '/(tabs)/(home)',

    className: 'text-green-500',
  },
  {
    label: 'Dompet  Saya',
    href: '/(tabs)/(wallet)',
    Icon: Wallet,

    className: 'text-purple-500',
  },
  {
    label: 'Aktivitas Saya',
    href: '/(tabs)/(wallet)',
    Icon: ScrollText,

    className: ' text-orange-500',
  },
  {
    label: 'Setting & Bantuan',
    href: '/(tabs)/(wallet)',
    Icon: Settings2,

    className: ' text-gray-500',
  },
];
export default function FeatureCard() {
  const { signOut } = useAuth();
  const { success, error: showError } = useToast();

  async function onSignOut() {
    await signOut();
    success('Berhasil  ', 'Anda telah keluar dari akun');
  }

  return (
    <Card className="h-fit w-full max-w-sm gap-0 rounded-3xl bg-card pb-4 pt-6 text-primary-foreground shadow-sm">
      <CardHeader className="w-full flex-row items-center gap-3.5 rounded-2xl bg-card px-6 py-0">
        <Button variant={'outline'} size={'icon'} className="size-12 rounded-full">
          <Icon as={Search} size={29} className="inline-block text-primary" />
        </Button>
        <View>
          <CardTitle className="p-0 text-lg font-semibold tracking-tight">Fitur Lainnya </CardTitle>

          <CardDescription className="p-0 text-sm tracking-wide text-muted-foreground">
            Lihat Fitur Lainnya
          </CardDescription>
        </View>
      </CardHeader>
      <Separator className="m-auto mb-1 mt-4 w-[19em]" />
      <CardContent className="flex flex-col justify-between gap-0 px-2 py-1">
        {FeatureLink.map((item, index) => {
          const titleFeature = batasiHuruf(item.label, 18);
          const isLastStep = index === FeatureLink.length - 1;
          return (
            <>
              <Button
                onPress={() => {
                  item.onpress
                    ? item.onpress()
                    : router.push(item.href ? item.href : '/(tabs)/(home)');
                }}
                key={item.label}
                variant={'ghost'}
                className={cn(
                  // buttonVariants({ variant: 'ghost' }),

                  'h-[4em] w-full flex-row justify-between px-7 py-4 active:bg-accent'
                )}>
                <View className="relative h-fit flex-row items-center gap-4">
                  <Icon
                    as={item.Icon}
                    size={27}
                    className={cn('z-2 relative m-auto size-6', item.className)}
                  />

                  <View>
                    <Text variant={'h3'} className="text-base font-medium text-foreground/90">
                      {titleFeature}
                    </Text>
                    {item.deskripcion && (
                      <Text
                        variant={'small'}
                        className="text-xs tracking-wide text-muted-foreground/50">
                        {item.deskripcion}
                      </Text>
                    )}
                  </View>
                </View>
                <Icon as={ChevronRight} size={20} />
              </Button>

              <Separator
                key={index}
                orientation="horizontal"
                className="m-auto w-[19em] bg-border/60"
              />
            </>
          );
        })}
        <Button
          onPress={() => onSignOut()}
          variant={'ghost'}
          className={cn(
            // buttonVariants({ variant: 'ghost' }),

            'h-[4em] w-full flex-row justify-between px-7 py-4 active:bg-accent'
          )}>
          <View className="relative h-fit flex-row items-center gap-4">
            <Icon
              as={LogOut}
              size={27}
              className={cn('z-2 relative m-auto size-6 text-destructive')}
            />

            <View>
              <Text variant={'h3'} className="text-base font-medium text-foreground/90">
                Keluar Akun
              </Text>
            </View>
          </View>
          <Icon as={ChevronRight} size={20} />
        </Button>
      </CardContent>
    </Card>
  );
}
