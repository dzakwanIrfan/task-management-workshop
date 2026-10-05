import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generate/prisma/client';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const databaseUrl = requiredEnv('DATABASE_URL');
const email = requiredEnv('SEED_USER_EMAIL');
const password = requiredEnv('SEED_USER_PASSWORD');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 10) },
    select: { id: true, email: true },
  });

  const existing = await prisma.task.count({ where: { userId: user.id } });
  if (existing === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Task 1',
          description: 'Description for Task 1',
          userId: user.id,
        },
        {
          title: 'Task 2',
          description: 'Description for Task 2',
          userId: user.id,
        },
        {
          title: 'Task 3',
          description: 'Description for Task 3',
          userId: user.id,
        },
      ],
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
