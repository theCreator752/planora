import React from 'react';
import AuthLayout from '../components/Auth/AuthLayout.jsx';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm.jsx';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset your password" subtitle="We'll send you a reset link.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
