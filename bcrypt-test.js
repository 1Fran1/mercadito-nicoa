const bcrypt = require('bcryptjs');

// Simula el registro
const password = 'Pablito123';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Hash generado:', hash);

    // Simula el login
    const inputPassword = 'Pablito123';
    bcrypt.compare(inputPassword, hash, (err, result) => {
      if (err) {
        console.error('Error al comparar contraseñas:', err);
      } else {
        console.log('¿Es la contraseña válida?:', result);  // Debe ser true
      }
    });
  }
});
