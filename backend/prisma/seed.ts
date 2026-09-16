import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generate/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined!');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: 'Task 1',
        description: 'Description for Task 1',
      },
      {
        title: 'Task 2',
        description: 'Description for Task 2',
      },
      {
        title: 'Task 3',
        description: 'Description for Task 3',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
