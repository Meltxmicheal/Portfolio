const bcrypt = require('bcryptjs');
const password = 'Micheal@13';
const hash = '$2b$10$Py8P15vTJG270APQdhLlCOOGwWMyQ7yNN8iziOxUgrVEP6Lvx/UK6';

async function test() {
  const match = await bcrypt.compare(password, hash);
  console.log('Password match:', match);
}

test();
