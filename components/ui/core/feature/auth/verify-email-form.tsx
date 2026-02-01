import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import { GroupedInput, GroupedInputItem } from '@/components/ui/fragments/custom-ui/form/input-form';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { useToast } from '@/components/ui/fragments/shadcn-ui/toast';
import { useSignUp } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import { Hash } from 'lucide-react-native';
import * as React from 'react';
import { type TextStyle, View } from 'react-native';

const RESEND_CODE_INTERVAL_SECONDS = 30;
const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const { success, error: showError } = useToast();

  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  const validateForm = () => {
    if (!code) {
      setError('Verification code is required');
      return false;
    }

    if (code.length < 6) {
      setError('Code must be at least 6 characters');
      return false;
    }

    setError('');
    return true;
  };

  async function onSubmit() {
    if (!validateForm()) {
      showError('Validation Error', 'Please enter a valid verification code.');
      return;
    }

    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        success('Email Verified', 'Your account has been created successfully.');
        return;
      }

      console.error(JSON.stringify(signUpAttempt, null, 2));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showError('Verification Failed', err.message);
        return;
      }
      console.error(JSON.stringify(err, null, 2));
      showError('Error', 'An unexpected error occurred. Please try again.');
    }
  }

  async function onResendCode() {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      restartCountdown();
      success('Code Resent', 'A new verification code has been sent to your email.');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showError('Resend Failed', err.message);
        return;
      }
      console.error(JSON.stringify(err, null, 2));
      showError('Error', 'An unexpected error occurred. Please try again.');
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Verify your email</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the verification code sent to {email || 'your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <GroupedInput>
              <GroupedInputItem
                label="Code"
                placeholder="123456"
                icon={Hash}
                value={code}
                onChangeText={setCode}
                error={error}
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </GroupedInput>

            <Button variant="link" size="sm" disabled={countdown > 0} onPress={onResendCode}>
              <Text className="text-center text-xs">
                Didn&apos;t receive the code? Resend{' '}
                {countdown > 0 ? (
                  <Text className="text-xs" style={TABULAR_NUMBERS_STYLE}>
                    ({countdown})
                  </Text>
                ) : null}
              </Text>
            </Button>

            <View className="gap-3">
              <Button className="w-full" onPress={onSubmit}>
                <Text>Continue</Text>
              </Button>
              <Button variant="link" className="mx-auto" onPress={router.back}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
