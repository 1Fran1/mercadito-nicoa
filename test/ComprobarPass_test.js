const bcrypt = require('bcryptjs');

const passwordToRegister = 'Pablo12345';
bcrypt.hash(passwordToRegister, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hash generado para la contraseña registrada:', hash);

  // Simulación de comparación en login
  const passwordToLogin = 'Pablo12345';
  bcrypt.compare(passwordToLogin, hash, (err, isMatch) => {
    if (err) throw err;
    console.log('¿Coinciden las contraseñas?', isMatch);
  });
});
