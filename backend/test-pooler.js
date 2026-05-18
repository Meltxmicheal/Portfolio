const { Client } = require('pg');
const regions = ['ap-south-1', 'ap-southeast-1', 'us-east-1', 'us-west-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'sa-east-1', 'ap-northeast-1', 'ap-southeast-2'];
async function test(region) {
  const client = new Client({
    connectionString: `postgresql://postgres.jivzcdlcwrmfahdvbigb:MeltxPortfolio2026@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('SUCCESS: aws-0-' + region + '.pooler.supabase.com');
    await client.end();
    return true;
  } catch(e) {
    if (e.code !== 'ENOTFOUND' && !e.message.includes('getaddrinfo')) {
       console.log('REACHED: aws-0-' + region + '.pooler.supabase.com but got error: ' + e.message);
    }
    return false;
  }
}
async function run() {
  for (let r of regions) {
    if (await test(r)) return process.exit(0);
  }
  console.log('Could not find region');
  process.exit(1);
}
run();
