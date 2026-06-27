require('dotenv/config');

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient, Priority, Status } = require('../src/generated/prisma');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
      { name: 'Brian Mwangi', email: 'brian.mwangi@example.com' },
      { name: 'Citra Putri', email: 'citra.putri@example.com' },
      { name: 'Dewa Santoso', email: 'dewa.santoso@example.com' },
      { name: 'Elena Sari', email: 'elena.sari@example.com' },
    ],
    skipDuplicates: true,
  });

  await prisma.category.createMany({
    data: [
      { name: 'Hardware' },
      { name: 'Software' },
      { name: 'Network' },
      { name: 'Security' },
      { name: 'Access' },
    ],
    skipDuplicates: true,
  });

  const existingUsers = await prisma.user.findMany();
  const existingCategories = await prisma.category.findMany();

  const ticketData = [];

  const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
  const statuses = [Status.OPEN, Status.IN_PROGRESS, Status.RESOLVED, Status.CLOSED];

  for (let i = 1; i <= 20; i += 1) {
    const assignedTo = existingUsers[(i - 1) % existingUsers.length];
    const category = existingCategories[(i - 1) % existingCategories.length];

    ticketData.push({
      title: `Ticket ${i}: Incident ${category.name}`,
      description: `This is a seeded ticket for category ${category.name}.`,
      priority: priorities[i % priorities.length],
      status: statuses[i % statuses.length],
      assignedToId: assignedTo.id,
      categoryId: category.id,
    });
  }

  await prisma.ticket.createMany({
    data: ticketData,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
