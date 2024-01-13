import { sql } from '@vercel/postgres';
import fs from 'fs';
import { exit } from 'process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  // Get the file path
  let filepath;
  if (process.argv.length === 3) {
    // Get the file path from argument
    filepath = process.argv[2];
    console.log(`Get json file path from argument: ${filepath}`)
  } else if (process.argv.length < 3) {
    console.error('Please specify the json file.');
    exit(1);
  }
  else {
    console.error(`Too many arguments.`);
    exit(1);
  }

  // Load the json file
  const raw = fs.readFileSync(filepath);
  const json = JSON.parse(raw);

  // SQL
  await sql`
    CREATE TABLE IF NOT EXISTS ckpc31_stories (
      id INT PRIMARY KEY,
      content TEXT NOT NULL,
      hidden BOOLEAN NOT NULL
    );
  `;

  for (const item of json) {
    const { id, content, hidden } = item;
    await sql`
      INSERT INTO ckpc31_stories (id, content, hidden)
      VALUES (${id}, ${content}, ${hidden})
      ON CONFLICT (id)
      DO UPDATE
      SET id = EXCLUDED.id, content = EXCLUDED.content, hidden = EXCLUDED.hidden
    `;
  }

  console.log('\Stories updated.');
}

await main();

exit(0);