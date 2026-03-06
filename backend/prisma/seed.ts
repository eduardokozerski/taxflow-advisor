import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const run = async () => {
  await prisma.company.upsert({
    where: { id: "seed-company-taxflow" },
    update: {},
    create: {
      id: "seed-company-taxflow",
      legalName: "Empresa Exemplo TaxFlow",
      businessSector: "servicos",
      companySize: "pequena"
    }
  });
};

run()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
