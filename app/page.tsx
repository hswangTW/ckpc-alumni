import Link from 'next/link'
import Image from 'next/image'

import AddItemModal from '@/app/ui/add-item-modal';

export default function Home() {

  return (
    <main className='flex px-10 py-5'>
      <AddItemModal />
      <div className='flex flex-col'>
        <h1 className='flex text-[2.5rem] justify-center py-5'>建物 31 社慶測試</h1>
        <Link
          href='/?addingItem=y'
          className='flex w-[10rem] justify-center bg-blue-500 rounded-lg px-6 py-3 transition-colors hover:bg-blue-400 duration-200'
        >
          新增道具
        </Link>
      </div>
    </main>
  )
}
