'use client';

import clsx from 'clsx';
import { signIn, signOut} from 'next-auth/react';
import { Session } from 'next-auth';

type UserInfoProps = {
  session: Session | null,
  className?: string,
};

const textClassName = 'text-gray-700';
const buttomClassName = 'w-fit h-fit text-sm text-gray-700 bg-ckpc-buff-light rounded-lg px-3 py-1 transition-colors hover:bg-ckpc-buff-verylight duration-100'

export default function UserInfo({ session, className }: UserInfoProps) {
  const isSignedIn = (!!session && !!session.user);

  return (
    <div className={clsx('flex flex-col gap-2 content-center', className)}>
      {isSignedIn ? (
        <>
          <p className={textClassName}>您好，{session.user!.name}</p>
          <button
            className={buttomClassName}
            onClick={() => signOut()}
          >
            登出
          </button>
        </>
      ) : (
        <>
          <p className={textClassName}>告訴我們您是誰！</p>
          <button
            className={buttomClassName}
            onClick={() => signIn()}
          >
            登入
          </button>
        </>
      )}
    </div>
  );
}