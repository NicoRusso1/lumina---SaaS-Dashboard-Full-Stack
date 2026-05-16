import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@taskflow.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@taskflow.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Create a test user
  const userPassword = await bcrypt.hash("user123", 10);

  const user = await prisma.user.upsert({
    where: { email: "user@taskflow.com" },
    update: {},
    create: {
      username: "testuser",
      email: "user@taskflow.com",
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
