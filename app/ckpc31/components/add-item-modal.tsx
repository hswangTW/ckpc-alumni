"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useRef, useEffect, FormEvent } from 'react'
import Image from 'next/image';
import QrScanner from './qr-scanner';
import { Html5QrcodeResult } from 'html5-qrcode';
import { unstable_noStore as noStore } from 'next/cache';

export default function AddItemModal() {
  noStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const addingItem = searchParams.get('addingItem');
  const [decodedQrcode, setDecodedQrcode] = useState<string>('');

  useEffect(() => {
    if (addingItem === 'y') {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [addingItem]);

  async function addItem(itemId: string) {
    const respose = await fetch(`/api/ckpc31/add-item?item_id=${itemId}`,
      { method: 'POST' }
    );
    if (!respose.ok) {
      return;
    }
    router.push(`/ckpc31/items/${itemId}`);
  }

  const handleClose = () => {
    dialogRef.current?.close();
    router.replace(pathname);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    addItem(formData.get('item-id') as string);
  }

  const handleQrSuccess = (decodedText: string, result: Html5QrcodeResult) => {
    setDecodedQrcode(decodedText);
    addItem(decodedText);
  }

  const dialog: JSX.Element | null = addingItem === 'y'
    ? (
      <dialog ref={dialogRef} className='fixed top-50 left-50 rounded-xl'>
        <div className='flex flex-col px-5 py-2'>
          <h1 className='py-4 text-xl'>新增歷史碎片</h1>
          <button className='absolute top-6 right-6' onClick={handleClose}>
            <Image
              src='/icons/cross.svg'
              width={16}
              height={16}
              alt='關閉'
            />
          </button>
          <QrScanner
            fps={10}
            disableFlip={false}
            onSuccess={handleQrSuccess}
          />
          {
            decodedQrcode ? (
              <p className='text-xs'>已掃描代碼: {decodedQrcode}，載入中請稍候</p>
            ) : (
              <p className='pt-2'>請掃描 QR code 或手動輸入道具代碼</p>
            )
          }
          <div className='flex flex-col py-3'>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-row gap-2'>
                <input
                  className='flex-grow rounded-md border border-gray-300'
                  type='text'
                  id='item-id'
                  name='item-id'
                />
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
          </div>
        </div>
      </dialog>
    ) : null;

  return dialog
}