require('dotenv').config();
const bcrypt = require('bcryptjs');

async function verify() {
  const password = 'Micheal@13';
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  
  console.log('Password length:', password.length);
  console.log('Hash length:', hash?.length);
  console.log('Hash value: [' + hash + ']');
  
  const match = await bcrypt.compare(password, hash);
  console.log('Password match:', match);
}

verify();
