import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Limpiamos los datos viejos para evitar conflictos de claves duplicadas (P2002)
  // El orden importa por las claves foráneas (primero tareas, después tableros, después usuarios)
  await prisma.task.deleteMany({});
  await prisma.board.deleteMany({});
  await prisma.user.deleteMany({});
  // Las categorías las dejamos o usamos createMany con skipDuplicates

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lumina.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@lumina.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Create a test user
  const userPassword = await bcrypt.hash("user123", 10);

  const user = await prisma.user.upsert({
    where: { email: "user@lumina.com" },
    update: {},
    create: {
      username: "testuser",
      email: "user@lumina.com",
      password: userPassword,
      role: Role.USER,
    },
  });

  // Create categories
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { name: "Frontend", color: "#3b82f6" },
      { name: "Backend", color: "#10b981" },
      { name: "Design", color: "#f59e0b" },
      { name: "DevOps", color: "#ef4444" },
    ],
  });

  // Create a board for the test user
  const board = await prisma.board.create({
    data: {
      title: "My first board",
      userId: user.id,
    },
  });

  // Add some tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Setup the project",
        description: "Initialize repo and install dependencies",
        completed: true,
        priority: "HIGH",
        boardId: board.id,
      },
      {
        title: "Build the API",
        description: "Create endpoints for boards and tasks",
        completed: false,
        priority: "HIGH",
        boardId: board.id,
      },
      {
        title: "Write tests",
        description: "Add unit and integration tests",
        completed: false,
        priority: "MEDIUM",
        boardId: board.id,
      },
    ],
  });

  console.log("Seed complete!");
  console.log(`Admin: ${admin.email} / admin123`);
  console.log(`User: ${user.email} / user123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });