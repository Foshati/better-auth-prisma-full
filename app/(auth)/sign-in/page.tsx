'use client';

import SignIn from '@/components/sign-in';
import { SignUp } from '@/components/sign-up';
import { Tabs } from '@/components/ui/tabs2';

export default function Page() {
  return (
    <div className='w-full '>
      <div className='flex items-center flex-col justify-center h-screen w-full '>
        <div className='md:w-[600px] w-full px-4'>
          <Tabs
            tabs={[
              {
                title: 'Sign In',
                value: 'sign-in',
                content: <SignIn />,
              },
              {
                title: 'Sign Up',
                value: 'sign-up',
                content: <SignUp />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
