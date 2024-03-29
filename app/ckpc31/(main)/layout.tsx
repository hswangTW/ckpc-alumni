import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import UserInfo from '../components/user-info'
import NavBar from '../components/nav-bar'

export const metadata: Metadata = {
  title: 'CKPC 31st Anniversary',
  description: '由網頁開發經驗幾乎為零的小菜雞一隻所撰寫的，建物三一社慶 RPG 程式！',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  return (
    <div className={`flex flex-col`}>
      <div className='flex flex-col p-8 gap-4 bg-ckpc-buff'>
        <div className='pb-2'>
          <h1 className='flex text-4xl justify-left'>建物 31 社慶 RPG</h1>
          <h2 className='flex text-xl pt-2 justify-left'>原本只是想參加社慶的我莫名得到了決定社團命運的資格？！～既然參加了就努力導正歷史～</h2>
        </div>
        <UserInfo session={session} />
      </div>
      <NavBar />
      <div className='flex flex-col p-8 gap-4 bg-ckpc-buff-verylight'>
        {children}
      </div>
    </div>
  )
}
