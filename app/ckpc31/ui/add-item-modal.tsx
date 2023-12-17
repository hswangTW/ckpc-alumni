"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useEffect, FormEvent } from 'react'

export default function AddItemModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const addingItem = searchParams.get('addingItem');

  useEffect(() => {
    if (addingItem === 'y') {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [addingItem]);

  const handleClose = () => {
    dialogRef.current?.close();
    router.replace('/ckpc31')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    router.push("/ckpc31/items/" + formData.get('item-id'));
  }

  const dialog: JSX.Element | null = addingItem === 'y'
    ? (
      <dialog ref={dialogRef} className='fixed top-50 left-50 rounded-xl backdrop-blur-3xl backdrop-grayscale'>
        <div className='w-[20rem] flex flex-col px-5 py-2'>
          <div className='flex flex-row py-3'>
            <h1 className='flex-1 text-2xl'>新增道具</h1>
            <button className='flex-none' onClick={handleClose}>
              x
            </button>
          </div>
          <div className='flex flex-col py-3'>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col'>
                <label htmlFor='item-id'>請輸入發現的道具代碼</label>
                <input
                  type='text'
                  id='item-id'
                  name='item-id'
                />
                <button type='submit'>送出</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    ) : null;

  return dialog
}