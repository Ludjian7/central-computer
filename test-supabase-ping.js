// Script to test network connectivity to Supabase
const dns = require('dns').promises;
const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

// Helper function to check DNS
async function checkDNS(hostname) {
  try {
    console.log(`[DNS] Resolving: ${hostname}`);
    const result = await dns.lookup(hostname);
    console.log(`[DNS] ✅ Resolved: ${hostname} -> ${result.address}`);
    return { success: true, address: result.address };
  } catch (error) {
    console.log(`[DNS] ❌ Failed to resolve: ${hostname} (${error.message})`);
    return { success: false, error: error.message };
  }
}

// Helper function to ping
async function pingHost(hostname) {
  try {
    console.log(`[PING] Pinging: ${hostname}`);
    const { stdout } = await execPromise(`ping -n 2 ${hostname}`);
    const success = stdout.includes('Reply from');
    if (success) {
      console.log(`[PING] ✅ Ping successful: ${hostname}`);
      const lines = stdout.split('\n').slice(0, 3);
      console.log(lines.join('\n'));
    } else {
      console.log(`[PING] ❌ Ping failed: ${hostname}`);
      console.log(stdout);
    }
    return { success, output: stdout };
  } catch (error) {
    console.log(`[PING] ❌ Failed to ping: ${hostname} (${error.message})`);
    return { success: false, error: error.message };
  }
}

// Helper function to make HTTP request
function httpGet(hostname, path = '/') {
  return new Promise((resolve) => {
    const url = `https://${hostname}${path}`;
    console.log(`[HTTP] Testing: ${url}`);
    
    const req = https.get(url, (res) => {
      const { statusCode } = res;
      
      if (statusCode === 200) {
        console.log(`[HTTP] ✅ HTTP request successful: ${url} (${statusCode})`);
        resolve({ success: true, statusCode });
      } else {
        console.log(`[HTTP] ⚠️ HTTP request returned: ${url} (${statusCode})`);
        resolve({ success: false, statusCode });
      }
    });
    
    req.on('error', (error) => {
      console.log(`[HTTP] ❌ HTTP request failed: ${url} (${error.message})`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      console.log(`[HTTP] ❌ HTTP request timeout: ${url}`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// Main function to test Supabase connectivity
async function testSupabaseConnectivity() {
  console.log('Testing Supabase connectivity...\n');
  
  // Hosts to test
  const hosts = [
    'zzqkrmcdnwuyfgxvjnmn.supabase.co',
    'db.zzqkrmcdnwuyfgxvjnmn.supabase.co',
    'supabase.co',
    'supabase.com',
    'database.supabase.co',
    'api.supabase.io'
  ];
  
  for (const host of hosts) {
    console.log(`\n=== Testing ${host} ===`);
    
    // Check DNS
    const dnsResult = await checkDNS(host);
    
    // If DNS resolves, try ping
    if (dnsResult.success) {
      await pingHost(host);
      
      // Try HTTP request
      await httpGet(host);
    }
  }
  
  console.log('\n=== Test Summary ===');
  console.log('1. If any of the Supabase domains resolved, your network can reach Supabase services.');
  console.log('2. The Postgres connection might still fail due to:');
  console.log('   - Incorrect credentials');
  console.log('   - Firewall blocking PostgreSQL port (5432)');
  console.log('   - VPN or proxy issues');
  console.log('3. Consider using the Supabase client library instead of direct Postgres connection');
}

testSupabaseConnectivity(); 