const bcrypt = require('bcryptjs');
const password = 'Micheal@13';

bcrypt.hash(password, 10).then(hash => {
  console.log('NEW_HASH=' + hash);
});
