import React from 'react';
import AuthLayout from '../components/Auth/AuthLayout.jsx';
import SignupForm from '../components/Auth/SignupForm.jsx';

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="A daily habit starts with one task.">
      <SignupForm />
    </AuthLayout>
  );
}
