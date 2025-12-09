import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash da senha (mude para senhas fortes!)
  const saltRounds = 10;
  
  // Usuário admin
  const adminPassword = await bcrypt.hash('SenhaAdmin123!', saltRounds);
  await prisma.user.upsert({
    where: { email: 'admin@sesau.araruama.gov.br' },
    update: {},
    create: {
      email: 'admin@sesau.araruama.gov.br',
      name: 'Administrador do Sistema',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Usuário médico
  const medicoPassword = await bcrypt.hash('SenhaMedico123!', saltRounds);
  await prisma.user.upsert({
    where: { email: 'medico@sesau.araruama.gov.br' },
    update: {},
    create: {
      email: 'medico@sesau.araruama.gov.br',
      name: 'Dr. Carlos Silva',
      password: medicoPassword,
      role: 'medico',
    },
  });

  // Usuário atendente
  const atendentePassword = await bcrypt.hash('SenhaAtendente123!', saltRounds);
  await prisma.user.upsert({
    where: { email: 'atendente@sesau.araruama.gov.br' },
    update: {},
    create: {
      email: 'atendente@sesau.araruama.gov.br',
      name: 'Ana Souza',
      password: atendentePassword,
      role: 'atendente',
    },
  });

  console.log('✅ Usuários criados com sucesso!');
  console.log('================================');
  console.log('Admin: admin@sesau.araruama.gov.br / SenhaAdmin123!');
  console.log('Médico: medico@sesau.araruama.gov.br / SenhaMedico123!');
  console.log('Atendente: atendente@sesau.araruama.gov.br / SenhaAtendente123!');
  console.log('================================');
  console.log('IMPORTANTE: Altere estas senhas após o primeiro login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });