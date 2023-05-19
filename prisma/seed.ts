import { Collection, Permission } from "@prisma/client";
import { getPasswordHash } from "~/services/auth.server";
import { prisma } from "~/services/db.server";
import { createPassword, editorUsers } from "./seed-data";

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.collection.deleteMany({}); // will delete related fields, entries, and fieldValues
  await prisma.user.deleteMany({});
  console.timeEnd("🧹 Cleaned up the database...");

  // create roles
  console.time(`👑 Created admin role/permission...`);
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        create: { name: "admin" },
      },
    },
  });

  // create collection and assign permissions to editor role
  const pageCollection: Collection & { permissions: Permission[] } =
    await prisma.collection.create({
      data: {
        title: "Pages",
        handle: "pages",
        permissions: {
          create: ["create", "read", "update", "delete"].map((operation) => ({
            name: `${operation}_pages`,
          })),
        },
      },
      include: {
        permissions: true,
      },
    });

  const editorRole = await prisma.role.create({
    data: {
      name: "editor",
      permissions: {
        connect: pageCollection.permissions.map((permission) => ({
          id: permission.id,
        })),
      },
    },
  });

  // create users
  console.time(`👤 Created editor users...`);
  editorUsers.forEach(async (editorUser) => {
    const user = await prisma.user.create({
      data: {
        ...editorUser,
        password: { create: createPassword(editorUser.username) },
        roles: {
          connect: {
            id: editorRole.id,
          },
        },
      },
    });

    return user;
  });

  console.timeEnd(`👤 Created editor users...`);

  console.time(`👤 Created admin user...`);

  const adminEmail = "blake@test.com";
  const adminUsername = "blake";
  const password = "test#pass";

  // create a new user
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      username: adminUsername,
      name: "Blake Admin",
      password: {
        create: {
          hash: await getPasswordHash(password),
        },
      },
    },
  });

  console.timeEnd(`👤 Created admin user...`);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
