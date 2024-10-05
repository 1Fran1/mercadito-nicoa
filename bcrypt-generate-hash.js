const bcrypt = require('bcryptjs');
const password = 'Pablito123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Hash generado:', hash);
  }
});