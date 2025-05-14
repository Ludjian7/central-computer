// Script to check Supabase URL formats
const { exec } = require('child_process');
const dns = require('dns').promises;

async function checkSupabaseURL() {
  console.log('Checking Supabase URL formats...');
  
  // Original values from vercel.json
  const host = 'db.zzqkrmcdnwuyfgxvjnmn.supabase.co';
  const alternateHost = 'zzqkrmcdnwuyfgxvjnmn.supabase.co';
  
  // Check DNS resolution
  async function checkDNS(hostname) {
    try {
      console.log(`Resolving: ${hostname}`);
      const result = await dns.lookup(hostname);
      console.log(`✅ Resolved: ${hostname} -> ${result.address}`);
      return true;
    } catch (error) {
      console.log(`❌ Failed to resolve: ${hostname} (${error.message})`);
      return false;
    }
  }
  
  // Check ping
  function checkPing(hostname) {
    return new Promise((resolve) => {
      console.log(`Pinging: ${hostname}`);
      exec(`ping -n 2 ${hostname}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`❌ Failed to ping: ${hostname}`);
          console.log(stderr || stdout);
          resolve(false);
        } else {
          console.log(`✅ Ping successful: ${hostname}`);
          console.log(stdout.split('\n').slice(0, 3).join('\n'));
          resolve(true);
        }
      });
    });
  }
  
  // Check common Supabase domains
  const hostsToCheck = [
    host,
    alternateHost,
    'supabase.co',
    'supabase.com',
    'api.supabase.io'
  ];
  
  for (const h of hostsToCheck) {
    console.log(`\n--- Testing ${h} ---`);
    const dnsResult = await checkDNS(h);
    if (dnsResult) {
      await checkPing(h);
    }
  }
  
  // Try constructing different connection URLs
  console.log('\n--- Testing potential connection URLs ---');
  
  const user = 'postgres';
  const password = 'sKA1VADomm7n9TGA';
  const dbname = 'postgres';
  const port = '5432';
  
  const possibleUrls = [
    `postgresql://${user}:${password}@${host}:${port}/${dbname}`,
    `postgresql://${user}:${password}@${alternateHost}:${port}/${dbname}`,
    `postgres://${user}:${password}@${host}:${port}/${dbname}`,
    `postgres://${user}:${password}@${alternateHost}:${port}/${dbname}`
  ];
  
  console.log('Potential connection URLs:');
  possibleUrls.forEach((url, i) => {
    console.log(`${i+1}. ${url.replace(password, '********')}`);
  });
  
  console.log('\nRecommendation:');
  if (await checkDNS(alternateHost)) {
    console.log(`Use this URL format in your .env file:`);
    console.log(`DATABASE_URL=postgresql://${user}:${password}@${alternateHost}:${port}/${dbname}`);
  } else if (await checkDNS(host)) {
    console.log(`Use this URL format in your .env file:`);
    console.log(`DATABASE_URL=postgresql://${user}:${password}@${host}:${port}/${dbname}`);
  } else {
    console.log('Could not resolve either Supabase hostname. Please check your Supabase credentials.');
  }
}

checkSupabaseURL(); 