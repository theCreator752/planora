import React from 'react';
import AuthLayout from '../components/Auth/AuthLayout.jsx';
import LoginForm from '../components/Auth/LoginForm.jsx';

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Plan tomorrow. Keep the streak alive.">
      <LoginForm />
    </AuthLayout>
  );
}
