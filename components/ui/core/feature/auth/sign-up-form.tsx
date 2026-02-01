import { SocialConnections } from '@/components/ui/core/feature/auth/social-connections';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
 
import {
  GroupedInput,
  GroupedInputItem,
} from '@/components/ui/fragments/custom-ui/form/input-form';
 
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { useToast } from '@/components/ui/fragments/shadcn-ui/toast';
import { useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import { Link } from '@/components/ui/fragments/shadcn-ui/link';
import { useFormValidation, validationRules } from '@/hooks/Useformvalidation';

export function SignUpForm() {
  const { signUp, isLoaded } = useSignUp();
  const { success, error: showError } = useToast();

  const emailRef = React.useRef<TextInput>(null!);
  const passwordRef = React.useRef<TextInput>(null!);

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    registerField,
    setFieldError,
  } = useFormValidation({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      if (!isLoaded) return;

      try {
        await signUp.create({
          emailAddress: values.email,
          password: values.password,
        });

        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

        success('Verification Sent', 'Please check your email for the verification code.');
        router.push(`/(auth)/sign-up/verify-email?email=${values.email}`);
      } catch (err) {
        if (err instanceof Error) {
          const isEmailMessage =
            err.message.toLowerCase().includes('identifier') ||
            err.message.toLowerCase().includes('email');

          if (isEmailMessage) {
            setFieldError('email', err.message);
          } else {
            setFieldError('password', err.message);
          }
          showError('Sign Up Failed', err.message);
          return;
        }
        console.error(JSON.stringify(err, null, 2));
        showError('Error', 'An unexpected error occurred. Please try again.');
      }
    },
  });

  React.useEffect(() => {
    registerField({ name: 'email', rules: validationRules.email, ref: emailRef });
    registerField({ name: 'password', rules: validationRules.password, ref: passwordRef });
  }, [registerField]);

  return (
    <>
      <GroupedInput>
        <GroupedInputItem
          ref={emailRef}
          label="Email"
          placeholder="m@example.com"
          icon={Mail}
          value={formData.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          error={touched.email ? errors.email : undefined}
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <GroupedInputItem
          ref={passwordRef}
          label="Password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          error={touched.password ? errors.password : undefined}
          secureTextEntry
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
      </GroupedInput>

      <Button className="w-full" onPress={handleSubmit}>
        <Text>Continue</Text>
      </Button>
    </>
  );
}
