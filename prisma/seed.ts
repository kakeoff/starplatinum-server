import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  getMockApplicationPublications,
  getMockApplications,
  getMockPublications,
} from './seedData';

const prisma = new PrismaClient();

const publications = getMockPublications();
const applications = getMockApplications();
const applicationPublications = getMockApplicationPublications();
async function main() {
  const password = await bcrypt.hash('12345678', 10);
  const usersPromises = [];
  usersPromises.push(
    prisma.user.create({
      data: {
        login: 'admin',
        password: password,
        role: 1,
      },
    }),
  );

  for (let i = 0; i < 50; i++) {
    usersPromises.push(
      prisma.user.create({
        data: {
          login: `user-${i}`,
          password: password,
          role: 0,
        },
      }),
    );
  }
  await Promise.all(usersPromises);

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
