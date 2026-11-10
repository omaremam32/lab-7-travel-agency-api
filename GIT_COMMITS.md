# Git commands after small, completed changes

Open VS Code terminal inside **your existing Lab 7 Git repository**, not in a nested directory. Copy updated source files from the completed ZIP into that repository, preserving paths. Don't copy a `.git` folder; the completed ZIP does not include one.

**Your uploaded .git has NO commits and several pre-staged files.** Before making selective commits, run this once:

```bash
git rm -r -f --cached .
```

This **force-clears only the Git staging area** while keeping the files on disk (because the ZIP has staged versions different from the working files). It is appropriate for the **uncommitted repository shown in the uploaded ZIP**. Do NOT use it blindly on a different repository with prior commits.

Check:

```bash
git status --short
git check-ignore .env
```

The `.env` file must be ignored. If `.env` has already been shared publicly, change the compromised password/secret.

Commit in small steps, in this order:

**1. Project configuration**
```bash
git add .gitignore .env.example package.json README.md GIT_COMMITS.md
git commit -m "Set up lab configuration and documentation"
```

**2. Database and schema**
```bash
git add db.js database.sql upgrade_old_users_table.sql server.js
git commit -m "Set up MySQL pool and create lab tables"
```

**3. User API and manager self-join**
```bash
git add controllers/userController.js routes/userRoutes.js
git commit -m "Implement users API and manager self join"
```

**4. Authentication**
```bash
git add controllers/authController.js routes/authRoutes.js
git commit -m "Implement registration and login with hashes and JWT"
```

**5. Trip/review controllers and Express routing**
```bash
git add controllers/tripController.js routes/tripRoutes.js controllers/reviewController.js routes/reviewRoutes.js index.js
git commit -m "Connect trip and review CRUD endpoints"
```

**6. Lock file after installing packages**
```bash
npm install
git add package-lock.json package.json
git commit -m "Record installed package dependencies"
```

**7. Check and push**
```bash
node --check db.js
node --check server.js
node --check index.js
npm start
```

Then in another terminal:

```bash
git status
git log --oneline
git branch --show-current
git push -u origin main
```

Only use `main` if `git branch --show-current` says `main` and `git remote -v` shows an existing `origin` remote. Otherwise push the actual branch name; a first push requires connecting your GitHub repository first.

**Important:** Git commits record the state of files when you stage them. These commands create separate commits by feature even if you copied all finished files to the working tree at once. They do not represent a timeline of code you wrote earlier; they document the state you actually submitted now.
