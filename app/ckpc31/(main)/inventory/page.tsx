import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from "@vercel/postgres"
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';

function ItemCard({ id, title }: { id: string, title: string }) {
  return (
    <Link
      className='flex flex-col bg-ckpc-buff-light rounded-lg px-6 py-3 transition-colors hover:bg-ckpc-buff-verylight duration-100'
      href={`/ckpc31/items/${id}`}
    >
      <p className=''>{title}</p>
    </Link>
  );
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  noStore();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <p>請先登入</p>;
  }

  const data = await sql`
    SELECT id, title FROM ckpc31_items
    WHERE id IN (
      SELECT item_id FROM ckpc31_inventory
      WHERE owner_id = ${session.user.id}
    );
  `;
      
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-ckpc-brown'>目前已收集到的歷史碎片:</p>
      <ul className='flex flex-col gap-1'>
        {data.rows.map((row) => (
          <li key={row.id}>
            <ItemCard id={row.id} title={row.title} />
          </li>
        ))}
      </ul>
    </div>
  )
}