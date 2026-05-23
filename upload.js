const { spawnSync } = require('child_process');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf-8');
const lines = envFile.split('\n');

for (const line of lines) {
  if (line.trim() === '' || line.startsWith('#')) continue;
  
  const [key, ...valueParts] = line.split('=');
  let value = valueParts.join('=').trim();
  
  // Remove quotes if present
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1);
  }

  console.log(`Uploading ${key}...`);
  
  const child = spawnSync('cmd.exe', ['/c', `npx vercel env add ${key} production`], {
    input: value,
    encoding: 'utf-8',
    stdio: ['pipe', 'inherit', 'inherit']
  });

  if (child.status !== 0) {
    console.error(`Failed to upload ${key}`);
  } else {
    console.log(`Successfully uploaded ${key}`);
  }
}
