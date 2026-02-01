import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import { Link } from '../../fragments/shadcn-ui/link';
import { SocialConnections } from '../feature/auth/social-connections';
import { Separator } from '../../fragments/shadcn-ui/separator';
import Wellcome from '@/assets/svg/welcome';
import { View } from '../../fragments/shadcn-ui/view';
import { Text } from '../../fragments/shadcn-ui/text';
type AuthLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  quote?: string;
  svg?: React.ReactNode;
  loading?: boolean;
  className?: string;
  numberOfIterations?: number;
  formType?: 'login' | 'register' | undefined; // ✅ Allow undefined
  signInGoogleButton?: boolean;
};
const AuthLayout = ({
  formType,
  numberOfIterations,
  className,
  svg = <Wellcome />,
  loading = false,
  signInGoogleButton = true,
  title = `Welcome Back!`,
  quote = `Your ideas are not just talk — make them happen.`,
  description = `The journey is about to begin`,
  ...props
}: AuthLayoutProps) => {
  const formTypeLabel = formType == 'register' ? 'login' : 'register';
  const formTypeLink = formType == 'register' ? '/(auth)/sign-in' : '/(auth)/sign-up';
  return (
    <Card className="relative flex h-full w-full max-w-sm content-center justify-start gap-6 overflow-hidden border-border/0 bg-background  p-6 shadow-none dark:bg-foreground sm:border-border">
      <CardHeader className="relative flex w-full flex-col gap-0 p-0">
        <View className="relative -mt-[8em] mb-4 flex h-fit max-h-[23.5em] w-full content-center items-center justify-center overflow-hidden">
          <View className="flex h-fit scale-[.50] content-center items-center overflow-hidden pt-[20em]">
            {svg}
          </View>
        </View>
        <CardTitle className="text-center text-2xl sm:text-left">{title}</CardTitle>
        <CardDescription className="text-center text-base text-muted-foreground dark:text-muted-foreground sm:text-left">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4 p-0 dark:bg-foreground">
        <View className="gap-5">{props.children}</View>

        <Text className="text-center text-muted-foreground dark:text-muted-foreground">
          {formType == 'register' ? ` alredy have an account? ` : 'don`t have an account? '}
          <Link href={formTypeLink} className="underline underline-offset-4">
            {formTypeLabel}
          </Link>
        </Text>
        {signInGoogleButton && (
          <>
            <CardFooter className="relative flex w-full flex-col gap-4 overflow-hidden p-0">
              <View className="flex-row items-center">
                <Separator className="flex-1" />
                <Text className="px-4 text-sm text-muted-foreground ">or continue with</Text>
                <Separator className="flex-1" />
              </View>
              <SocialConnections />
            </CardFooter>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthLayout;
