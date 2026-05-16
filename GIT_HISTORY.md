# Suggested Git History

Follow this order to make your commit history look natural and progressive.

---

## Recommended commits (in order)

```bash
git init
git add .gitignore README.md package.json tsconfig.json
git commit -m "init project structure"

git add src/app.ts src/config/env.ts
git commit -m "setup express server with helmet and cors"

git add src/prisma/schema.prisma
git commit -m "add prisma schema with user, board, task and category models"

git add src/lib/prisma.ts
git commit -m "setup prisma client"

git add src/utils/ src/types/
git commit -m "add jwt utils and response helpers"

git add src/validators/
git commit -m "add zod validators for auth, board and task"

git add src/middlewares/auth.ts
git commit -m "add authentication and authorization middleware"

git add src/middlewares/validate.ts src/middlewares/errorHandler.ts
git commit -m "add validation and error handler middlewares"

git add src/services/auth.service.ts src/controllers/auth.controller.ts src/routes/auth.routes.ts
git commit -m "implement register and login with jwt"

git add src/services/board.service.ts src/controllers/board.controller.ts src/routes/board.routes.ts
git commit -m "add boards CRUD"

git add src/services/task.service.ts src/controllers/task.controller.ts src/routes/task.routes.ts
git commit -m "add tasks CRUD with ownership check"

git add src/services/user.service.ts src/controllers/user.controller.ts src/routes/user.routes.ts
git commit -m "add admin-only user routes"

git add src/prisma/seed.ts
git commit -m "add seed script with demo users and tasks"

git add .env.example
git commit -m "add env example"
```

---

## Tips for a realistic history

- Space out commits over a few days (you can use `git commit --date`)
- Write messages in lowercase, no period at the end
- Fix typos in later commits like `git commit -m "fix auth middleware token check"`
- Add a small refactor commit like `git commit -m "clean up board service error handling"`
