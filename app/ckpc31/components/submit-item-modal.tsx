"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useRef, useEffect, FormEvent } from 'react'
import { unstable_noStore as noStore } from 'next/cache';
import Image from 'next/image';

type Item = {
  id: string,
  title: string,
  submitted: boolean,
}

type SubmitItemModalProps = {
  items: Item[],
  quota: number,
}

export default function SubmitItemModal({ items, quota }: SubmitItemModalProps) {
  noStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const submitting = searchParams.get('submittingItem');

  useEffect(() => {
    router.refresh();
  }, []);

  useEffect(() => {
    if (submitting === 'y') {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
    router.refresh();
  }, [submitting]);

  const handleClose = () => {
    dialogRef.current?.close();
    router.replace(pathname);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const itemId = formData.get('item-id') as string;
    const respose = await fetch(`/api/ckpc31/submit-item?item_id=${itemId}`,
      { method: 'POST' }
    );
    if (!respose.ok) {
      alert(`提交歷史碎片失敗: ${respose.status} ${respose.statusText} (${await respose.text()})`);
      return;
    }
    router.push(pathname);
  }

  if (submitting === 'y') {
    return (
      <dialog ref={dialogRef} className='fixed top-50 left-50 rounded-xl'>
        <div className='flex flex-col px-5 py-2'>
          <h1 className='py-4 text-xl'>提交歷史碎片</h1>
          <button className='absolute top-6 right-6' onClick={handleClose}>
            <Image
              src='/icons/cross.svg'
              width={16}
              height={16}
              alt='關閉'
            />
          </button>
          <div className='flex flex-col py-3'>
            {quota === 0 ? (
              <p>你已經不能再提交更多碎片了。</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor='item-id'>請選擇要提交的歷史碎片（警告：你還可以提交 {quota} 個碎片，碎片一旦提交便無法反悔）</label>
                <div className='flex flex-row gap-2'>
                  <select
                    className='flex-grow rounded-md border border-gray-300'
                    name='item-id'
                  >
                    <option value=''>請選擇</option>
                    {
                      items.map((item) => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                      ))
                    }
                  </select>
                  <button
                    className='flex flex-row px-4 py-2 gap-2 items-center min-w-fit bg-ckpc-blue-light rounded-lg transition-colors hover:bg-ckpc-blue-verylight duration-100'
                    type='submit'
                  >
                    <Image
                      src='/icons/check.svg'
                      width={16}
                      height={16}
                      alt='送出'
                    />
                    送出
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </dialog>
    );
  } else {
    return null;
  }
}