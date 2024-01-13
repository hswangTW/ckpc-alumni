import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);

  if (!session) {
    return new Response('Not logged in', { status: 401 });
  }
  if (session?.user?.admin !== true) {
    return new Response('Not authorized', { status: 401 });
  }

  const storyId = searchParams.get('story_id');
  const show = searchParams.get('show');

  if (!storyId) {
    return new Response('Story ID not found', { status: 400 });
  }
  if (!show) {
    return new Response('Show not found', { status: 400 });
  }

  try {
    const result = await sql`
      UPDATE ckpc31_stories
      SET hidden = ${show === 'true' ? false : true}
      WHERE id = ${storyId};
    `;

    if (result.rowCount === 0) {
      return new Response('Bad Request.', { status: 400 });
    } else {
      return new Response('OK', { status: 200 });
    }
  } catch (error) {
    return new Response('SQL failed.', { status: 400 });
  }
}