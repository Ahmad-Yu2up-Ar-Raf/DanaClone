import { SignInForm } from '@/components/ui/core/feature/auth/sign-in-form';
import AuthLayout from '@/components/ui/core/layout/auth-layout';
import { View } from '@/components/ui/fragments/shadcn-ui/view';
import * as React from 'react';
import { ScrollView } from 'react-native';

export default function SignInScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-18 sm:py-4 sm:p-6 mt-safe content-center "
      keyboardDismissMode="interactive">
      <AuthLayout formType="login">
        <SignInForm />
      </AuthLayout>
    </ScrollView>
  );
}
