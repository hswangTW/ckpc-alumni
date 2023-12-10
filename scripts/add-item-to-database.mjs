import { sql } from '@vercel/postgres';
import { error } from 'console';
import fs from 'fs';
import path from 'path';
import { exit } from 'process';
import readline from 'readline';
import { v5 as uuidv5 } from 'uuid';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const namespace = 'c0ec9dea-7da0-4c12-895c-722dcbfccdb8';
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
  const code = await getInput('What\'s the code for this item?\n> ');
  const title = await getInput('What\'s the title of this item?\n> ');

  // Generate the ID and copy the file
  const id = uuidv5(filepath, namespace);
  const url = `/images/items/${id}.${extension}`;
  const newpath = `${rootDir}/public${url}`;

  try {
    fs.copyFileSync(filepath, newpath);
  } catch (error) {
    console.log(`Failed to copy image file (${error})`);
    exit(1);
  }

  // SQL
  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id UUID NOT NULL PRIMARY KEY,
      code VARCHAR(20) NOT NULL,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL
    );
  `;
  await sql`
    INSERT INTO items (id, code, title, image_url)
    VALUES (${id}, ${code}, ${title}, ${url})
    ON CONFLICT (id) DO NOTHING;
  `;

  console.log(`Added row to the database.\n  id: ${id}\n  code: ${code}\n  title: ${title}\n  image_url: ${url}`);
}

await main();

exit(0);