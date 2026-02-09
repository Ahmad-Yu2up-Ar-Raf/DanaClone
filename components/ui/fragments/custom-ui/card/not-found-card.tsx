import { View, Text } from 'react-native';
import React from 'react';
import ForgotPassword from '@/assets/svg/auth/forgot-password';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import { cn } from '@/lib/utils';

type componentProps = {
  className?: string;
  title: string;
  deskripsi?: string;
  svg?: React.ReactNode;
};

export default function NotFound({
  svg = <ForgotPassword />,
  className,
  title,
  deskripsi,
}: componentProps) {
  return (
    <Card
      className={cn(
        'relative m-auto flex h-full w-full max-w-sm content-center justify-start gap-3 border-0 bg-background p-7 shadow-none sm:border-border',
        className
      )}>
      <CardHeader className="relative mb-3 flex w-full flex-col gap-0 p-0">
        <View className="relative -mt-[8em] mb-4 flex h-fit max-h-[25em] w-full content-center items-center justify-center overflow-hidden">
          <View
            className={cn(
              'flex h-fit scale-[.40] content-center items-center overflow-hidden pt-[20em]',
              className
            )}>
            {svg}
          </View>
        </View>
        <CardTitle className="mb-0.5 text-center text-2xl sm:text-left">{title}</CardTitle>
        {deskripsi && (
          <CardDescription className="text-center text-sm text-muted-foreground sm:text-left dark:text-muted-foreground">
            {deskripsi}
          </CardDescription>
        )}
      </CardHeader>
      {/* <CardContent className="mb-0 gap-4 p-0 dark:bg-foreground"></CardContent> */}
    </Card>
  );
}
