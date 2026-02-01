import { SignUpForm } from '@/components/ui/core/feature/auth/sign-up-form';
import AuthLayout from '@/components/ui/core/layout/auth-layout';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function SignUpScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe ios:mt-0"
      keyboardDismissMode="interactive">
      <AuthLayout formType="register" title='Lets Get Started!' description='Create an account to continue'>
        <SignUpForm />
      </AuthLayout>
    </ScrollView>
  );
}
