'use client';

import { signIn, signOut} from 'next-auth/react';
import { Session } from 'next-auth';

type UserInfoProps = {
  session: Session | null,
};

export default function UserInfo({ session }: UserInfoProps) {
  const isSignedIn = (!!session && !!session.user);
  console.log(session);

  return (
    <div className='flex flex-row gap-2'>
      {isSignedIn ? (
        <>
          <p>您好，{session.user!.name}</p>
          <button onClick={() => signOut()}>登出</button>
        </>
      ) : (
        <>
          <p>告訴我們您是誰！</p>
          <button onClick={() => signIn()}>登入</button>
        </>
      )}
    </div>
  );
}