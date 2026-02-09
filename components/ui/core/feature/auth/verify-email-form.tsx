import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { View } from '@/components/ui/fragments/shadcn-ui/view';
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner';
import { InputOTP } from '@/components/ui/fragments/shadcn-ui/input-otp';
import { router } from 'expo-router';
import * as React from 'react';
import { type TextStyle } from 'react-native';
import { useVerifyEmail } from '@/hooks/Useverifyemail';

const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  const { code, error, email, isSubmitting, countdown, handleCodeChange, onSubmit, onResendCode } =
    useVerifyEmail();

  const otpRef = React.useRef<{ focus: () => void }>(null);

  // Auto-focus OTP input on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      otpRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 🔥 InputOTP Component with auto-submit */}
      <View className="items-center">
        <InputOTP
          ref={otpRef as React.RefObject<any>}
          length={6}
          value={code}
          onChangeText={handleCodeChange}
          error={error}
          disabled={isSubmitting}
          showCursor
          containerClassName="w-full"
        />
      </View>

      {/* Loading indicator when submitting */}
      {isSubmitting && (
        <View className="items-center">
          <View className="flex-row items-center gap-2">
            <Spinner size="sm" className="text-primary" />
            <Text className="text-sm text-muted-foreground">Verifying code...</Text>
          </View>
        </View>
      )}

      {/* Resend button */}
      <Button
        variant="ghost"
        className="text-muted-foreground"
        size="sm"
        disabled={countdown > 0 || isSubmitting}>
        <Text className="text-center text-xs">
          Didn&apos;t receive the code?
          <Text
            onPress={countdown === 0 ? onResendCode : undefined}
            className={
              countdown === 0
                ? 'text-sm text-primary underline underline-offset-4'
                : 'text-sm text-muted-foreground'
            }>
            {' '}
            Resend{' '}
          </Text>
          {countdown > 0 ? (
            <Text className="text-sm" style={TABULAR_NUMBERS_STYLE}>
              ({countdown})
            </Text>
          ) : null}
        </Text>
      </Button>

      {/* Action buttons */}
      <View className="gap-3">
        <Button
          disabled={isSubmitting || code.length !== 6}
          className="w-full gap-2"
          onPress={onSubmit}>
          {isSubmitting && <Spinner className="text-primary-foreground" size="sm" />}
          <Text>{isSubmitting ? 'Verifying...' : 'Continue'}</Text>
        </Button>
        <Button variant="link" className="mx-auto" disabled={isSubmitting} onPress={router.back}>
          <Text>Cancel</Text>
        </Button>
      </View>
    </>
  );
}
