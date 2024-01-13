import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tableName = 'ckpc31_items';
const rootDir = process.cwd();

const getInput = (prompt) => (new Promise(resolve => {
  rl.question(prompt, resolve);
}));

async function main() {
  // Get the file path
  let filepath;
  if (process.argv.length === 2) {
    // Get the file path from stdin
    filepath = await getInput('Enter the image file path for the new item\n> ');
  } else if (process.argv.length === 3) {
    // Get the file path from argument
    filepath = process.argv[2];
    console.log(`Get image file path from argument: ${filepath}`)
  }
  else {
    console.error(`Too many arguments.`);
    exit(1);
  }

  // Parse the file extension
  if (!filepath.includes('.')) {
    console.error(`Failed to recognize the extension of file: \"${filepath}\"`);
    exit(1);
  }
  const extension = filepath.split('.').pop();

  // Ask basic information
  const id = await getInput('What\'s the id for this item?\n> ');
  const title = await getInput('What\'s the title of this item?\n> ');
  const description = await getInput('Write the description for this item:\n> ');
  const academic_score = await getInput('What\'s the academic score for this item?\n> ');
  const social_score = await getInput('What\'s the social score for this item?\n> ');
  const admin_score = await getInput('What\'s the administrative score for this item?\n> ');

  // Copy the file
  const newpath = `${rootDir}/public/images/ckpc31/items/${id}.${extension}`;

  try {
    fs.copyFileSync(filepath, newpath);
  } catch (error) {
    console.log(`Failed to copy image file (${error})`);
    exit(1);
  }

  console.log(`\nAdding row to the table \"${tableName}\".\n  id: ${id}\n  title: ${title}\n  description: ${description}`);
  console.log(`  scores: acedamic ${academic_score}, social ${social_score}, admin ${admin_score}`);
  const ans = await getInput('\nIs all the information correct? (y/n)\n> ');
  if (ans.toLowerCase() !== 'y' && ans.toLowerCase() !== 'yes') {
    console.log(`No row has been added to ${tableName}.`);
    exit(0);
  }

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
  await sql`
    INSERT INTO ckpc31_items (id, title, description, academic_score, social_score, admin_score)
    VALUES (${id}, ${title}, ${description}, ${academic_score}, ${social_score}, ${admin_score})
    ON CONFLICT (id) DO NOTHING;
  `;

  console.log('\nRow added.');
}

await main();

exit(0);