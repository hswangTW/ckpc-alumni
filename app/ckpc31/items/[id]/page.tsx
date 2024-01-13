import fs from 'fs';
import path from 'path';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sql } from '@vercel/postgres';
import DownloadButton from '../../components/download-button';

type ItemTable = {
  id: string,
  title: string,
  description: string,
};

type StaticParams = {
  id: string,
};

export const dynamicParams = false; // This page uses static params.

const itemsDirUrl = '/images/ckpc31/items';

async function fetchItemById(id: string) {
  try {
    const data = await sql<ItemTable>`
      SELECT *
      FROM ckpc31_items
      WHERE id = ${id};
    `;

    return data.rows[0] as ItemTable;
  } catch (error) {
    console.error(`Failed to fetch item with id \"${id}\": ${error}`);
    throw new Error('Failed to fetch item.');
  }
}

async function fetchAllItemIds() {
  try {
    const data = await sql<ItemTable>`
      SELECT id
      FROM ckpc31_items;
    `;

    return data.rows.map((row) => row.id) as string[];
  } catch (error) {
    console.error(`Failed to fetch item ids: ${error}`);
    throw new Error('Failed to fetch item ids.');
  }
}

export const metadata = {
  title: 'CKPC 31st Anniversary',
  description: '由網頁開發經驗幾乎為零的小菜雞一隻所撰寫的，建物三一社慶 RPG 程式！',
};

export async function generateStaticParams() {
  const itemIds = await fetchAllItemIds();
  return itemIds.map((id) => ({ id })) as StaticParams[];
}

export default async function Page({ params }: { params: StaticParams }) {
  const { id } = params;
  const { title, description } = await fetchItemById(id);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col mx-4 mt-4 rounded-lg bg-ckpc-buff-light'>
        <p className='py-2 bg-ckpc-buff text-2xl text-center font-bold'>
          {title}
        </p>
        <Image
          src={`${itemsDirUrl}/${id}.png`}
          width={500}
          height={500}
          alt={`歷史碎片: ${title}`}
          priority={true}
        />
        <p className='m-4 p-4 rounded-lg bg-ckpc-buff-verylight'>
          {description}
        </p>
      </div>
      <div className='flex flex-row mx-4 gap-1'>
        <Link
          className='flex flex-grow w-1/2 justify-center bg-ckpc-blue-light rounded-lg px-6 py-3 transition-colors hover:bg-ckpc-blue-verylight duration-100'
          href='/ckpc31/inventory'
        >
          回到道具欄
        </Link>
        <DownloadButton
          text='下載圖檔'
          className='flex flex-grow w-1/2 justify-center bg-ckpc-blue-light rounded-lg px-6 py-3 transition-colors hover:bg-ckpc-blue-verylight duration-100'
          itemId={id}
        />
      </div>
    </div>
  );
}