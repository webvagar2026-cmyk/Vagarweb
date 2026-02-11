import * as bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
    console.error('Por favor proporciona una contraseña como argumento.');
    console.error('Uso: tsx scripts/generate-password.ts <tu-nueva-contraseña>');
    process.exit(1);
}

async function generateHash() {
    const hash = await bcrypt.hash(password, 10);
    console.log(`\nContraseña: ${password}`);
    console.log(`Hash generado: ${hash}`);
    console.log('\nCopia este hash y pégalo en scripts/seed.ts en la variable adminPasswordHash.\n');
}

generateHash();
