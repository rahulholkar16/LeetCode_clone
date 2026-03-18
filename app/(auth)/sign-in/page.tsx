import SingInForm from '@/components/signin-form';
import React from 'react'

const SingInPage = () => {
  return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
          <div className="w-full max-w-sm">
              <SingInForm />
          </div>
      </div>
  );
}

export default SingInPage;