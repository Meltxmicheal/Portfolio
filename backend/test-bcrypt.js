const bcrypt = require('bcryptjs');
const password = 'Micheal@13';

async function test() {
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);
  const match = await bcrypt.compare(password, hash);
  console.log('Self-match:', match);
}

test();
