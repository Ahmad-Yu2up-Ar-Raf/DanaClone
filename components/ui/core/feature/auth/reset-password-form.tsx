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
import { useSignIn } from '@clerk/clerk-expo';
import { Hash, Lock } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export function ResetPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = React.useState({
    password: '',
    code: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.code) {
      newErrors.code = 'Verification code is required';
    } else if (formData.code.length < 6) {
      newErrors.code = 'Code must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit() {
    if (!validateForm()) {
      showError('Validation Error', 'Please check your input and try again.');
      return;
    }

    if (!isLoaded) return;

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: formData.code,
        password: formData.password,
      });

      if (result.status === 'complete') {
        setActive({ session: result.createdSessionId });
        success('Password Reset', 'Your password has been successfully reset.');
        return;
      }
    } catch (err) {
      if (err instanceof Error) {
        const isPasswordMessage = err.message.toLowerCase().includes('password');
        setErrors({
          code: '',
          password: isPasswordMessage ? err.message : '',
        });
        showError('Reset Failed', err.message);
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
          <CardTitle className="text-center text-xl sm:text-left">Reset password</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the code sent to your email and set a new password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <GroupedInput>
              <GroupedInputItem
                label="New Password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
                error={errors.password}
                secureTextEntry
                returnKeyType="next"
              />
              <GroupedInputItem
                label="Code"
                placeholder="123456"
                icon={Hash}
                value={formData.code}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, code: text }))}
                error={errors.code}
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </GroupedInput>

            <Button className="w-full" onPress={onSubmit}>
              <Text>Reset Password</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
