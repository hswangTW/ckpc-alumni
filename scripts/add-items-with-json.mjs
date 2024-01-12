import { sql } from '@vercel/postgres';
import fs from 'fs';
import { exit } from 'process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tableName = 'ckpc31_items';
const rootDir = process.cwd();

async function main() {
  // Get the file path
  let filepath;
  if (process.argv.length === 3) {
    // Get the file path from argument
    filepath = process.argv[2];
    console.log(`Get json file path from argument: ${filepath}`)
  } else if (process.argv.length < 3) {
    console.error('Please specify the json file.');
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
    CREATE TABLE IF NOT EXISTS ckpc31_items (
      id TEXT NOT NULL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      academic_score INT NOT NULL,
      social_score INT NOT NULL,
      admin_score INT NOT NULL
    );
  `;

  for (const item of json) {
    const { id, title, description, academic_score, social_score, admin_score } = item;
    await sql`
      INSERT INTO ckpc31_items (id, title, description, academic_score, social_score, admin_score)
      VALUES (${id}, ${title}, ${description}, ${academic_score}, ${social_score}, ${admin_score})
      ON CONFLICT (id)
      DO UPDATE
      SET id = EXCLUDED.id, title = EXCLUDED.title, description = EXCLUDED.description,
          academic_score = EXCLUDED.academic_score, social_score = EXCLUDED.social_score, admin_score = EXCLUDED.admin_score
    `;
  }

  console.log('\nItems added/updated.');
}

await main();

exit(0);