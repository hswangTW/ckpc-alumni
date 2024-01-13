import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from "@vercel/postgres"
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';

import AddItemModal from '@/app/ckpc31/components/add-item-modal';
import SubmitItemModal from '@/app/ckpc31/components/submit-item-modal';

const maxSubmittedItems = 2;

function ItemCard({ id, title }: { id: string, title: string }) {
  return (
    <Link
      className='flex flex-col bg-ckpc-buff-light rounded-lg px-6 py-3 transition-colors hover:bg-white duration-100'
      href={`/ckpc31/items/${id}`}
    >
      <p className=''>{title}</p>
    </Link>
  );
}

export const dynamic = 'force-dynamic';

async function fetchItems(userId: string) {
  noStore();

  const data = await sql`
    SELECT ckpc31_inventory.item_id AS id,
           ckpc31_inventory.submitted,
           ckpc31_items.title
    FROM ckpc31_inventory JOIN ckpc31_items
    ON
      ckpc31_inventory.item_id = ckpc31_items.id AND
      ckpc31_inventory.owner_id = ${userId};
  ` as { rows: { id: string, submitted: boolean, title: string }[] };

  return data.rows;
}

export default async function Home() {
  noStore();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <p>請先登入</p>;
  }

  const items = await fetchItems(session.user.id);

  const submittedItems = items.filter((item) => item.submitted);
  const unsubmittedItems = items.filter((item) => !item.submitted);
  const quota = Math.max(0, maxSubmittedItems - submittedItems.length);
      
  return (
    <>
      <AddItemModal />
      <SubmitItemModal items={unsubmittedItems} quota={quota} />
      <div className='flex flex-col gap-2'>
        <p className='text-ckpc-brown text-xs pb-2'>若歷史碎片更新不及時，請重新整理頁面</p>
        <p className='text-ckpc-brown text-lg'>尚未提交的歷史碎片:</p>
        <ul className='flex flex-col gap-1'>
          {unsubmittedItems.length === 0 && (
            <li>
              <p className='px-6 py-3'>尚無歷史碎片</p>
            </li>
          )}
          {unsubmittedItems.map((row) => (
            <li key={row.id}>
              <ItemCard id={row.id} title={row.title} />
            </li>
          ))}
        </ul>
        <p className='text-ckpc-brown text-lg pt-4'>已提交的歷史碎片:</p>
        <ul className='flex flex-col gap-1'>
          {submittedItems.length === 0 && (
            <li>
              <p className='px-6 py-3'>尚無歷史碎片</p>
            </li>
          )}
          {submittedItems.map((row) => (
            <li key={row.id}>
              <ItemCard id={row.id} title={row.title} />
            </li>
          ))}
        </ul>
        <div className='flex flex-row gap-2 pt-8'>
          <Link
            href='?addingItem=y'
            className='flex-grow text-center bg-ckpc-blue-light rounded-lg px-6 py-3 transition-colors hover:bg-ckpc-blue-verylight duration-100'
          >
            新增歷史碎片
          </Link>
          <Link
            href='?submittingItem=y'
            className='flex-grow text-center bg-ckpc-blue-light rounded-lg px-6 py-3 transition-colors hover:bg-ckpc-blue-verylight duration-100'
          >
            提交歷史碎片
          </Link>
        </div>
      </div>
    </>
  )
}