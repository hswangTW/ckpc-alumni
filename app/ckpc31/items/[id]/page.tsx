import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { sql } from '@vercel/postgres';

type ItemTable = {
  id: string,
  title: string,
  description: string,
};

type StaticParams = {
  id: string,
};

export const dynamicParams = false;

const itemsDirUrl = '/images/ckpc31_items';

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

export async function generateStaticParams() {
  const itemsDirectory = `${process.cwd()}/public${itemsDirUrl}`;
  const filenames = fs.readdirSync(itemsDirectory);
  const itemIds = filenames.map((filename) => (filename.replace(/\.[^./]+$/, '')));
  return itemIds.map((id) => ({ id })) as StaticParams[];
}

export default async function Page({ params }: { params: StaticParams }) {
  const { id } = params;
  const { title, description } = await fetchItemById(id);

  return (
    <div>
      <p className='text-xl'>{title}</p>
      <Image
        src={`${itemsDirUrl}/${id}.png`}
        width={500}
        height={500}
        alt={`Item: ${id}`}
      />
      <p>{description}</p>
      <Link href='/ckpc31' className='flex w-[10rem] justify-center bg-blue-500 rounded-lg px-6 py-3 transition-colors hover:bg-blue-400 duration-200'>回到首頁</Link>
    </div>
  );
}