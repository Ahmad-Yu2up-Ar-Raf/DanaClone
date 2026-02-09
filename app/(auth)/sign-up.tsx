import Accounting from '@/assets/svg/auth/register';
import { SignUpForm } from '@/components/ui/core/feature/auth/sign-up-form';
import AuthLayout from '@/components/ui/core/layout/auth-layout';
import * as React from 'react';

export default function SignUpScreen() {
  return (
    <AuthLayout
      className="scale-[.40]"
      formType="register"
      title="Buat Akun Baru"
      description="Mari berkenalan dengan kami!"
      svg={<Accounting />}>
      <SignUpForm />
    </AuthLayout>
  );
}
