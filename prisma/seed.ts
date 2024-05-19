import { PrismaClient } from '@prisma/client';
import {
  getMockApplicationPublications,
  getMockApplications,
  getMockPublications,
  getMockUsers,
} from './seedData';

const prisma = new PrismaClient();

async function main() {
  const publications = getMockPublications();
  const applications = getMockApplications();
  const applicationPublications = getMockApplicationPublications();
  const users = await getMockUsers();
  await prisma.user.createMany({
    data: users,
  });

  await prisma.publication.createMany({
    data: publications,
  });

  await prisma.application.createMany({
    data: applications,
  });

  await prisma.applicationPublications.createMany({
    data: applicationPublications,
  });
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
