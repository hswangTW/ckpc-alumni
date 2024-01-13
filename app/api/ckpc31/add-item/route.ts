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
      INSERT INTO ckpc31_inventory (item_id, owner_id, created_at, submitted)
      VALUES (
        (SELECT id FROM ckpc31_items WHERE id = ${itemId}),
        (SELECT id FROM users WHERE id = ${userId}),
        NOW(),
        false
      );
    `;

    if (result.rowCount === 0) {
      return new Response('Bad Request. Probably the item does not exist.', { status: 400 });
    } else {
      return new Response('OK', { status: 200 });
    }
  } catch (error) {
    return new Response('SQL failed. Probably the item is already added.', { status: 400 });
  }
}