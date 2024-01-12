import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const filename = `${id}.png`;
  const buffer = await readFile(path.join(process.cwd(), 'public/images/ckpc31_items', filename));

  const headers = new Headers();
  headers.append('Content-Disposition', `attachment; filename="${filename}"`);
  headers.append('Content-Type', 'image/png');

  return new Response(buffer, { headers });
}