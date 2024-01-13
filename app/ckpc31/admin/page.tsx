import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from "@vercel/postgres"

import ControlPanel from './control-panel';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <p>請先登入</p>;
  } else if (!session.user.admin) {
    return <p>權限不足</p>;
  }

  const data = await sql`
    SELECT ckpc31_items.academic_score,
           ckpc31_items.social_score,
           ckpc31_items.admin_score
    FROM ckpc31_inventory JOIN ckpc31_items
    ON
      ckpc31_inventory.item_id = ckpc31_items.id AND
      ckpc31_inventory.submitted = true;
  ` as { rows: { academic_score: number, social_score: number, admin_score: number }[] };

  const scores = data.rows.reduce((acc, row) => {
    acc.academic += row.academic_score;
    acc.social += row.social_score;
    acc.admin += row.admin_score;
    return acc;
  }, { academic: 0, social: 0, admin: 0 });

  return (
    <div className='p-4'>
      <p className='text-2xl py-4'>總分</p>
      <p>學術: {scores.academic}</p>
      <p>社交: {scores.social}</p>
      <p>行政: {scores.admin}</p>
      <p className='text-2xl py-4'>劇本顯示/隱藏</p>
      <ControlPanel />
    </div>
  );
}