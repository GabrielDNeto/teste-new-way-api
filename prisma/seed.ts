import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passHash = await bcrypt.hash('admin@123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {
      password: passHash,
    },
    create: {
      email: 'admin@mail.com',
      name: 'Admin User',
      password: passHash,
      isAdmin: true,
      Task: {
        create: {
          title: 'Admin Task 1',
          description: 'Admin Task Description 1',
          status: 'pending',
        },
      },
    },
  });

  console.log('✅ User created', { adminUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
