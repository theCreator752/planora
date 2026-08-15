import React from 'react';
import AuthLayout from '../components/Auth/AuthLayout.jsx';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm.jsx';

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Choose a new password">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
