import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);

  if (!session) {
    return new Response('Not logged in', { status: 401 });
  }

  const userId = session?.user?.id;
  const itemId = searchParams.get('item_id');

  if (!userId) {
    return new Response('User ID not found', { status: 400 });
  }
  if (!itemId) {
    return new Response('Item ID not found', { status: 400 });
  }
  try {
    const result = await sql`
      UPDATE ckpc31_inventory
      SET submitted = true
      WHERE owner_id = ${userId} AND item_id = ${itemId};
    `;

    if (result.rowCount === 0) {
      return new Response('Bad Request. Probably the item does not exist.', { status: 400 });
    } else {
      return new Response('OK', { status: 200 });
    }
  } catch (error) {
    return new Response('SQL failed.', { status: 400 });
  }
}