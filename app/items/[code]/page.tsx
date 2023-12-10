import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { sql } from '@vercel/postgres';

type ItemTable = {
  id: string,
  code: string,
  title: string,
  image_url: string,
};

type StaticParams = {
  code: string,
};

export const dynamicParams = false;

export async function fetchItemById(id: string) {
  try {
    const data = await sql<ItemTable>`
      SELECT *
      FROM items
      WHERE id = ${id};
    `;

    return data.rows[0] as ItemTable;
  } catch (error) {
    console.error(`Failed to fetch item with id \"${id}\": ${error}`);
    throw new Error('Failed to fetch item.');
  }
}

export async function fetchItemByCode(code: string) {
  try {
    const data = await sql<ItemTable>`
      SELECT *
      FROM items
      WHERE code = ${code};
    `;

    return data.rows[0] as ItemTable;
  } catch (error) {
    console.error(`Failed to fetch item with code \"${code}\": ${error}`);
    throw new Error('Failed to fetch item.');
  }
}

export async function generateStaticParams() {
  const itemsDirectory = path.join(process.cwd(), 'public/images/items');
  const filenames = fs.readdirSync(itemsDirectory);
  const itemIds = filenames.map((filename) => (filename.replace(/\.[^./]+$/, '')));

  const items = await Promise.all(itemIds.map(async (id) => fetchItemById(id)));
  return items as StaticParams[];
}

export default async function Page({ params }: { params: StaticParams }) {
  const { code } = params;
  const { title, image_url } = await fetchItemByCode(code);

  return (
    <div>
      <p>{title}</p>
      <Image
        src={image_url}
        width={500}
        height={500}
        alt={`Item: ${code}`}
      />
      <Link href='/' className='flex w-[10rem] justify-center bg-blue-500 rounded-lg px-6 py-3 transition-colors hover:bg-blue-400 duration-200'>回到首頁</Link>
    </div>
  );
}