import { SignInForm } from '@/components/ui/core/feature/auth/sign-in-form';
import AuthLayout from '@/components/ui/core/layout/auth-layout';

import * as React from 'react';
import ForgotPassword from '@/assets/svg/auth/forgot-password';
export default function SignInScreen() {
  return (
    <AuthLayout
      svg={<ForgotPassword />}
      title="Selamat Datang!"
      description="Masuk untuk melanjutkan"
      formType="login">
      <SignInForm />
    </AuthLayout>
  );
}
