"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useRef, useEffect, FormEvent } from 'react'
import QrScanner from './qr-scanner';
import { Html5QrcodeResult } from 'html5-qrcode';

export default function AddItemModal() {
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
      alert(`新增歷史碎片失敗: ${respose.status} ${respose.statusText} (${await respose.text()})`);
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
      <dialog ref={dialogRef} className='fixed top-50 left-50 rounded-xl backdrop-blur-3xl backdrop-grayscale'>
        <div className='w-[20rem] flex flex-col px-5 py-2'>
          <div className='flex flex-row py-3'>
            <h1 className='flex-1 text-2xl'>新增道具</h1>
            <button className='flex-none' onClick={handleClose}>
              x
            </button>
          </div>
          <QrScanner
            fps={10}
            disableFlip={false}
            onSuccess={handleQrSuccess}
          />
          {
            decodedQrcode ?
              <p className='text-xs'>已掃描代碼: {decodedQrcode}，載入中請稍候</p> :
              <p>請掃描 QR code 或手動輸入道具代碼</p>
          }
          <div className='flex flex-col py-3'>
            <form onSubmit={handleSubmit}>
              <div className='flex flex-row'>
                <input
                  type='text'
                  id='item-id'
                  name='item-id'
                />
                <button type='submit' className='min-w-fit'>送出</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    ) : null;

  return dialog
}